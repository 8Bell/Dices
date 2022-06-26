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
import React, { useState } from 'react';
import { authService, dbService } from '../../fbase';

export default function SignIn({ modalOpen, setModalOpen }) {
	const theme = useTheme();
	const handleClose = () => {
		setModalOpen(false);
	};

	const [signIn, setSignIn] = useState(true);

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onChange = (e) => {
		const {
			target: { id, value },
		} = e;
		if (id === 'id') {
			setEmail(value + '@dice.cloud');
		} else if (id === 'password') {
			setPassword(value);
		} else if (id === 'name') setUserName(value);
	};

	//--------- SIGN IN -------------//

	const onSignUpSubmit = async (e) => {
		e.preventDefault();
		console.log('email', email);

		try {
			if (userName !== '') {
				const data = await authService.createUserWithEmailAndPassword(
					email,
					password
				);
				await data.user.updateProfile({
					displayName: userName,
				});
				console.log(data);

				await dbService.collection('users').doc(data.user.uid).set({
					uid: data.user.uid,
					email,
					userName,
					createdAt: Date.now(),
					isOnline: true,
					profileImg: null,
				});
			} else {
				alert('이름을 입력해주세요.');
			}
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/email-already-in-use':
					alert('This ID is already in use.');
					break;
				case 'auth/invalid-email':
					alert('This ID is not available.');
					break;
				case 'auth/operation-not-allowed':
					alert('Your subscription has been stopped.');
					break;
				case 'auth/weak-password':
					alert('Please enter a password with at least 6 digits');
					break;
				default:
					alert('Please enter a valid ID or password.');
			}
		}
	};

	return (
		<Dialog
			open={modalOpen}
			onClose={handleClose}
			sx={{
				backgroundColor:
					theme.palette.mode === 'dark'
						? 'rgba(17, 17, 17, 0.5)'
						: 'rgba(227, 227, 227, 0.4)',
				backdropFilter: 'blur(5px)',
				transitionDuration: '0.5s',
			}}>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					backdropFilter: 'opacity(0.3)',
					pt: 4,
					fontSize: 22,
					fontWight: 800,
				}}>
				{signIn ? 'Sign In' : 'Sign up'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				{signIn && (
					<>
						<DialogContentText>
							Join us and save your score to compete with your friends.
						</DialogContentText>

						<TextField
							onChange={onChange}
							margin='nomal'
							id='name'
							label='Name'
							type='text'
							fullWidth
							variant='standard'
							color='info'
							sx={{
								mt: 2,
							}}
						/>
					</>
				)}
				<TextField
					onChange={onChange}
					margin='nomal'
					id='id'
					label='ID'
					type='text'
					fullWidth
					variant='standard'
					color='info'
					sx={{
						mt: 2,
					}}
				/>
				<TextField
					onChange={onChange}
					margin='normal'
					id='password'
					label='Password (+6)'
					type='password'
					fullWidth
					variant='standard'
					color='info'
					sx={{
						mb: 2,
					}}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					pb: 3,
				}}>
				<Button
					onClick={() => setSignIn(!signIn)}
					sx={{
						color: theme.palette.text.primary,
						position: 'absolute',
						left: 0,
						ml: 2,
					}}>
					{signIn ? 'Sign in' : 'Sign up'}
				</Button>
				<Button onClick={handleClose} sx={{ color: theme.palette.text.primary }}>
					Cancel
				</Button>
				<Button
					onClick={signIn ? onSignUpSubmit : onSignUpSubmit}
					sx={{ color: theme.palette.text.primary, mr: 2 }}>
					Sign up
				</Button>
			</DialogActions>
		</Dialog>
	);
}
