import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	//DialogTitle,
	IconButton,
	Paper,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';
import { useNavigate } from 'react-router-dom';
import { dbService, rtService } from '../../fbase';

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
			rtService.ref('games/' + myUid).set({
				myUid: myUid,
				dices: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
				left: 3,
				isFilled: {
					0: false,
					1: false,
					2: false,
					3: false,
					4: false,
					5: false,
					6: false,
					7: false,
					8: false,
					9: false,
					10: false,
					11: false,
					12: false,
					13: false,
					14: false,
				},
				isHold: {
					0: false,
					1: false,
					2: false,
					3: false,
					4: false,
				},
				scoreData: {
					0: 0,
					1: 0,
					2: 0,
					3: 0,
					4: 0,
					5: 0,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
					12: 0,
					13: 0,
					14: 0,
				},
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

	const handleRejectedClick = () => {
		smallFlatSound.play();
		dbService.collection('users').doc(challengerUid).update({
			pvp: 'rejected',
		});
		setBattleModalOpen(false);
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

					mb: -3,
					fontSize: 20,
					fontWight: 800,
				}}>
				{Eng ? 'New challenger!' : '대결 신청'}
			</DialogTitle>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					backdropFilter: 'opacity(0.3)',

					pb: 4,

					fontSize: 20,
					fontWight: 800,
				}}>
				{Eng ? user.userName + " 's Information" : user.userName + '님의 정보'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 1, mt: 0 }}>
					<Paper
						elevation={0}
						sx={{
							mr: -1,
							ml: -1,
							mb: 2,
							p: 2,
							borderRadius: 5,
							border: '1px solid',
							borderColor: theme.palette.divider,
						}}>
						<Typography
							sx={{
								fontSize: 18,
								mb: 2,
							}}>
							{Eng ? 'Single Game' : '싱글 게임'}
						</Typography>
						{(Eng ? 'Best Score : ' : '최고 점수 : ') + user.indivBestScore}
						<br />
						{(Eng ? 'Number of games : ' : '게임 횟수 : ') +
							user.indivNumberOfGames}
						<br />
						{(Eng ? 'Everage Score : ' : '평균 점수 : ') +
							(user.indivNumberOfGames === 0
								? 0
								: Math.round(
										user.indivTotalScore /
											user.indivNumberOfGames
								  ))}
					</Paper>
					<Paper
						elevation={0}
						sx={{
							mr: -1,
							ml: -1,
							mb: 4,
							p: 2,
							borderRadius: 5,
							border: '1px solid',
							borderColor: theme.palette.divider,
						}}>
						<Typography
							sx={{
								fontSize: 18,
								mb: 2,
							}}>
							{Eng ? 'Rank Game' : '랭크 게임'}
						</Typography>
						{(Eng ? 'Best Score : ' : '최고 점수 : ') + user.pvpBestScore}
						<br />
						{(Eng ? 'Number of games : ' : '대전 횟수 : ') +
							user.pvpNumberOfGames}

						<br />
						{(Eng ? 'Wins : ' : '승리 : ') + user.win}
						<br />
						{(Eng ? 'Defeats : ' : '패배 : ') + user.defeat}
						<br />
						{(Eng ? 'Winning rate : ' : '승률 : ') +
							(user.pvpNumberOfGames === 0
								? 0
								: Math.round(user.win / user.pvpNumberOfGames) *
								  100) +
							' %'}
					</Paper>
					{Eng
						? 'Would you like to accept ' + user.userName + "'s challenge ?"
						: user.userName + '님의 대전 신청을 수락하시겠어요?'}
				</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					pt: 3,
					pb: 5,
				}}>
				<IconButton
					onClick={handleRejectedClick}
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
