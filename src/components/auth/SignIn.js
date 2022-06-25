import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	useTheme,
} from '@mui/material';
import React from 'react';

export default function SignIn({ modalOpen, setModalOpen }) {
	const theme = useTheme();
	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<Dialog open={modalOpen} onClose={handleClose}>
			<DialogTitle
				sx={{
					bgcolor: theme.palette.background.default,
				}}>
				Join
			</DialogTitle>
			<DialogContent
				sx={{
					bgcolor: theme.palette.background.default,
				}}>
				<DialogContentText>
					Join and save your score to compete with your friends.
				</DialogContentText>
				<TextField
					margin='dense'
					id='name'
					label='ID'
					type='email'
					fullWidth
					variant='standard'
					sx={{ mt: 2 }}
				/>
				<TextField
					margin='dense'
					id='name'
					label='Password'
					type='password'
					fullWidth
					variant='standard'
					sx={{ mb: 2 }}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					bgcolor: theme.palette.background.default,
				}}>
				<Button onClick={handleClose} sx={{ color: theme.palette.text.primary }}>
					Cancel
				</Button>
				<Button onClick={handleClose} sx={{ color: theme.palette.text.primary }}>
					Join
				</Button>
			</DialogActions>
		</Dialog>
	);
}
