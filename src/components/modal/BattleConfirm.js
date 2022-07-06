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

export default function BattleConFilm({ battleModalOpen, setBattleModalOpen, Eng, myUid }) {
	const navigate = useNavigate();

	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setBattleModalOpen(false);
	};

	const [challenger, setChallenger] = useState({});
	const [challengerUid, setChallengerUid] = useState('');

	useEffect(() => {
		myUid &&
			dbService
				.collection('users')
				.doc(myUid)
				.onSnapshot((snapshot) => {
					const dbChallengerUid = snapshot.data().pvp;

					console.log('dbChallengerUid', dbChallengerUid);

					setChallengerUid(dbChallengerUid);
				});
		challengerUid !== '' &&
			dbService
				.collection('users')
				.doc(challengerUid)
				.onSnapshot((snapshot) => {
					setChallenger(snapshot.data());
				});
	}, [challengerUid, myUid]);

	console.log('myUid', myUid);

	console.log('challengerUid', challengerUid);

	console.log('challenger', challenger);

	const user = challenger
		? challenger
		: {
				uid: '',
				userName: '',
				createdAt: Date.now(),
				isOnline: true,
				profileImg: null,

				indivNumberOfGames: 0,
				indivBestScore: 0,
				indivTotalScore: 0,

				pvpNumberOfGames: 0,
				pvpBestScore: 0,
				pvpTotalScore: 0,

				win: 0,
				defeat: 0,
				Rank: 0,
		  };
	console.log('user', user);

	const handleBattleClick = () => {
		smallFlatSound.play();
		sessionStorage.setItem('opponentUid', JSON.stringify(challengerUid));
		dbService.collection('users').doc(challengerUid).update({
			pvp: 'accept',
		});

		myUid &&
			challengerUid &&
			dbService
				.collection('games')
				.doc(myUid)
				.set({
					myUid,
					dices: [0, 0, 0, 0, 0],
					left: 3,
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
					isHold: [false, false, false, false, false],
					scoreData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					myTurn: true,
					opponentUid: challengerUid,
				});

		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left', 'score');

		// eslint-disable-next-line react-hooks/exhaustive-deps

		setTimeout(() => {
			dbService.collection('users').doc(myUid).update({
				pvp: '',
			});
			navigate('/pvp');
		}, [1500]);
		//setSnackBarOpen(true);
	};
	console.log('myUid', myUid);

	// const handleSnackBarClose = (event, reason) => {
	// 	if (reason === 'clickaway') {
	// 		return;
	// 	}

	// 	setSnackBarOpen(false);
	// };

	return (
		<Dialog
			open={battleModalOpen}
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
				{user.userName}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 1, mt: 0 }}>
					{Eng
						? ['Refresh the game?', <br />, 'Current content will be saved']
						: [
								'최고 점수 : ' + user.indivBestScore,
								<br />,
								'게임 횟수 : ' + user.indivNumberOfGames,
								<br />,
								<br />,
								user.userName + '님의 대전을 수락 하시겠어요?',
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
						setBattleModalOpen(false);
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
					onClick={handleBattleClick}
					sx={{
						color: theme.palette.text.primary,
						mr: 5,
						position: 'absolute',
						right: 0,
					}}>
					<FiberManualRecordOutlined />
				</IconButton>
			</DialogActions>
			{/* <Snackbar
				open={snackBarOpen}
				autoHideDuration={100000}
				onClose={handleSnackBarClose}>
				<Alert
					onClose={handleSnackBarClose}
					sx={{
						borderRadius: 20,
						width: '85%',
						position: 'fixed',
						bottom: '5%',
						mr: 10,
					}}>
					Waiting
				</Alert>
			</Snackbar> */}
		</Dialog>
	);
}
