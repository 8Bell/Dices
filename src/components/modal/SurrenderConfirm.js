import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	//DialogTitle,
	IconButton,
	useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../../fbase';

export default function SurrenderConfirm({
	surrenderModalOpen,
	setSurrenderModalOpen,
	setDices,
	setIsHold,
	setIsFilled,
	setLeft,
	setIsFin,
	setIsStart,
	Eng,
	myUid,
	opponentUid,
	me,
	total,
	setNewBestScore,
}) {
	const navigate = useNavigate();
	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setSurrenderModalOpen(false);
	};
	const diceArr = [0, 0, 0, 0, 0];

	//-------SURRENDER DATA -------------//

	//opponentUserData
	const [opponentData, setOpponentData] = useState({});

	useEffect(() => {
		dbService
			.collection('users')
			.doc(opponentUid)
			.onSnapshot((snapshot) => {
				setOpponentData(snapshot.data());
			});
	}, [opponentUid]);

	async function endGame() {
		if (me && me.pvpBestScore < total) {
			await dbService.collection('users').doc(myUid).update({
				pvpBestScore: total,
			});
			setNewBestScore(true);
		}

		opponentUid &&
			(await dbService
				.collection('users')
				.doc(opponentUid)
				.update({
					pvpNumberOfGames: opponentData.pvpNumberOfGames + 1,
					win: opponentData.win + 1,
				}));
		myUid &&
			(await dbService
				.collection('users')
				.doc(myUid)
				.update({
					pvpNumberOfGames: me.pvpNumberOfGames + 1,
					defeat: me.defeat + 1,
				}));
	}

	const handleSurrender = async () => {
		smallFlatSound.play();

		await endGame();

		localStorage.setItem(
			'myData',
			JSON.stringify({
				scoreData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				isFilled: [
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
				],
				dices: [0, 0, 0, 0, 0],
				isHold: [false, false, false, false, false],
				left: 3,
			})
		);
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFin(false);
		setIsStart(true);

		setTimeout(() => {
			myUid &&
				dbService.collection('users').doc(myUid).update({
					pvp: 'end',
				});
			navigate('/');
		}, [1000]);
	};

	console.log('opponent', opponentData);

	return (
		<Dialog
			open={surrenderModalOpen}
			onClose={handleClose}
			sx={{
				backgroundColor:
					theme.palette.mode === 'dark'
						? 'rgba(17, 17, 17, 0.5)'
						: 'rgba(227, 227, 227, 0.4)',
				backdropFilter: 'blur(5px)',
				transitionDuration: '0.8s',
			}}>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					backdropFilter: 'opacity(0.3)',
					pt: 3,
					pb: 2,
					mb: 0,
					fontSize: 20,
					fontWight: 800,
				}}>
				{Eng ? 'Surrender?' : '항복할까요?'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 1, mt: 0 }}>
					{Eng
						? [
								// 'Reset the game?',
								// <br />,
								'The data is reflected in the results.',
						  ]
						: [
								// '게임을 재시작할까요?',
								// <br />,
								'데이터는 결과에 반영됩니다.',
						  ]}
				</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					pb: 5,
				}}>
				<IconButton
					onClick={() => {
						setSurrenderModalOpen(false);
						smallFlatSound.play();
					}}
					sx={{
						color: theme.palette.text.primary,
						ml: 5,
						position: 'absolute',
						left: 0,
					}}>
					<ClearRounded />
				</IconButton>

				<IconButton
					onClick={handleSurrender}
					sx={{
						color: theme.palette.text.primary,
						mr: 5,
						position: 'absolute',
						right: 0,
					}}>
					<FiberManualRecordOutlined />
				</IconButton>
			</DialogActions>
		</Dialog>
	);
}
