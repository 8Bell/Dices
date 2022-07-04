import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Alert,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	//DialogTitle,
	IconButton,
	Snackbar,
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

	const handleSnackBarClose = (event, reason) => {
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
					{Eng
						? ['Refresh the game?', <br />, 'Current content will be saved']
						: [
								'최고 점수 : ' + user.indivBestScore,
								<br />,
								'게임 횟수 : ' + user.indivNumberOfGames,
								<br />,
								<br />,
								user.userName + '님에게 대전을 신청 하시겠어요?',
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
						width: '85%',
						position: 'fixed',
						bottom: '5%',
						mr: 10,
					}}>
					Waiting
				</Alert>
			</Snackbar>
		</Dialog>
	);
}
