import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	useTheme,
} from '@mui/material';
import React from 'react';
import { authService, rtService, rtTimestamp } from '../../fbase';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import { getEffectSound } from '../../util/effectSound';

export default function SignOut({ modal2Open, setModal2Open, Eng, handleDeleteGame }) {
	//-----------EFFECT SOUNDS-------------//

	const theme = useTheme();
	const smallFlatSound = getEffectSound(SmallFlatSound, 1);

	const handleClose = () => {
		setModal2Open(false);
	};

	const checkOnline = () => {
		const myUid = authService.currentUser.uid;
		const connectionRef = rtService.ref('UsersConnection/' + myUid + '/connection');
		const lastOnlineRef = rtService.ref('UsersConnection/' + myUid + '/lastOnline');
		const connectedRef = rtService.ref('.info/connected');
		connectedRef.on('value', (snapshot) => {
			if (snapshot.val() === true) {
				connectionRef.push().set(true);
				connectedRef.onDisconnect().push().remove();
				//connectedRef.onDisconnect().push().set(false);
				lastOnlineRef.onDisconnect().set(rtTimestamp);
			}
		});
	};

	const handleLogOut = () => {
		smallFlatSound.play();
		handleDeleteGame();
		authService.signOut();
		checkOnline();
	};

	return (
		<Dialog
			open={modal2Open}
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
					pb: 3,
					mb: 0,
					fontSize: 22,
					fontWight: 800,
				}}>
				{Eng ? 'Log Out' : '로그아웃'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 2 }}>
					{Eng
						? [
								"Are you sure you're Log Out?",
								<br />,
								'The current score will not be uploaded.',
						  ]
						: [
								'로그아웃 하시겠습니까?',
								<br />,
								'게임 진행상황은 저장되지 않습니다.',
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
						setModal2Open(false);
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
					onClick={handleLogOut}
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
