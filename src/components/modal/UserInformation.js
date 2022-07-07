import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Alert,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Snackbar,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';
import { dbService } from '../../fbase';

export default function UserInformation({
	modal3Open,
	setModal3Open,
	members,
	propIdx,
	Eng,
	myUid,
	me,
	rejected,
	setRejected,
	isMobile,
}) {
	const [snackBarOpen, setSnackBarOpen] = useState(false);

	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setModal3Open(false);
	};
	console.log('me', me);

	const user =
		propIdx === 'me' && me
			? me
			: members[propIdx]
			? members[propIdx]
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
		sessionStorage.setItem('opponentUid', JSON.stringify(user.uid));

		dbService.collection('users').doc(user.uid).update({
			pvp: myUid,
		});

		setTimeout(() => {
			setRejected(true);
		}, 28000);
		setTimeout(() => {
			handleSnackBarClose();
		}, 30000);

		setSnackBarOpen(true);
	};

	const handleSnackBarClose = (reason) => {
		if (reason === 'clickaway') {
			return;
		}

		dbService.collection('users').doc(user.uid).update({
			pvp: '',
		});
		dbService.collection('users').doc(myUid).update({
			pvp: '',
		});
		setSnackBarOpen(false);
		setRejected(false);
	};

	return (
		<Dialog
			open={modal3Open}
			onClose={handleClose}
			sx={{
				position: 'fixed',
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
					pb: 3,
					mb: 0,
					fontSize: 20,
					fontWight: 800,
				}}>
				{propIdx === 'me'
					? Eng
						? 'My Information'
						: '내 정보'
					: Eng
					? user.userName + " 's Information"
					: user.userName + '님의 정보'}
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
						? propIdx !== 'me' &&
						  "Would you like to propose a confrontation to '" +
								user.userName +
								"' ?"
						: propIdx !== 'me' &&
						  user.userName + '님에게 대전을 신청하시겠어요?'}
				</DialogContentText>
			</DialogContent>
			{propIdx !== 'me' && (
				<DialogActions
					sx={{
						backgroundColor: theme.palette.background.paper,
						color: theme.palette.text.primary,
						pt: 3,
						pb: 5,
					}}>
					<IconButton
						onClick={() => {
							setModal3Open(false);
							smallFlatSound.play();
							handleSnackBarClose();
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
			)}
			<Snackbar
				open={snackBarOpen}
				autoHideDuration={30000}
				sx={{
					position: 'absolute',
					width: '100%',
					transform: isMobile ? 'translate(5%,-10%)' : 'translateY(15%)',
				}}
				onClose={handleSnackBarClose}>
				<Alert
					onClose={handleSnackBarClose}
					severity={rejected ? 'error' : 'info'}
					sx={{
						borderRadius: 20,
						width: 'calc(100% - 45px)',
					}}>
					{Eng
						? rejected
							? 'Rejected'
							: 'Waiting...'
						: rejected
						? '거절되었습니다'
						: '수락 대기중...'}
				</Alert>
			</Snackbar>
		</Dialog>
	);
}
