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
import { authService } from '../../fbase';
import SmallFlatSound from '../../sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';

export default function SignOut({ modal2Open, setModal2Open }) {
	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		smallFlatSound.play();
		setModal2Open(false);
	};

	const handleLogOut = () => {
		smallFlatSound.play();
		authService.signOut();
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
				{'Log Out'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 2 }}>
					{[
						"Are you sure you're Log Out?",
						<br />,
						'The current score will not be uploaded.',
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
