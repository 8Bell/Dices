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
}) {
	const [snackBarOpen, setSnackBarOpen] = useState(false);

	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setModal3Open(false);
	};

	const user = members[propIdx]
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

		// navigate('/pvp');
		setSnackBarOpen(true);
	};
	console.log('myUid', myUid);

	const handleSnackBarClose = (reason) => {
		if (reason === 'clickaway') {
			return;
		}

		dbService.collection('users').doc(user.uid).update({
			pvp: '',
		});
		setSnackBarOpen(false);
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
					<Paper
						elevation={5}
						sx={{ mr: -1, ml: -1, mb: 2, p: 2, borderRadius: 5 }}>
						<Typography
							sx={{
								fontSize: 18,
								mb: 2,
							}}>
							솔로게임
						</Typography>
						{'최고 점수 : ' + user.indivBestScore}
						<br />
						{'게임 횟수 : ' + user.indivNumberOfGames}
						<br />
						{'평균 점수 : ' +
							(user.indivNumberOfGames === 0
								? 0
								: Math.round(
										user.indivTotalScore /
											user.indivNumberOfGames
								  ))}
					</Paper>
					<Paper
						elevation={5}
						sx={{ mr: -1, ml: -1, mb: 2, p: 2, borderRadius: 5 }}>
						<Typography
							sx={{
								fontSize: 18,
								mb: 2,
							}}>
							랭크게임
						</Typography>
						{'최고 점수 : ' + user.pvpBestScore}
						<br />
						{'대전 횟수 : ' + user.pvpNumberOfGames}

						<br />
						{'승리 : ' + user.win}
						<br />
						{'패배 : ' + user.defeat}
						<br />
						{'승률 : ' +
							(user.pvpNumberOfGames === 0
								? 0
								: Math.round(user.win / user.pvpNumberOfGames) *
								  100) +
							' %'}
					</Paper>
					{user.userName + '님에게 대전을 신청하시겠어요?'}
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
			<Snackbar
				open={snackBarOpen}
				autoHideDuration={100000}
				onClose={handleSnackBarClose}>
				<Alert
					onClose={handleSnackBarClose}
					sx={{
						borderRadius: 20,
						width: 'calc(100% - 40px)',
						position: 'fixed',
						bottom: '5%',
						// mr: '10px',
						// ml: '10px',
					}}>
					Waiting
				</Alert>
			</Snackbar>
		</Dialog>
	);
}
