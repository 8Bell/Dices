import { CheckRounded, CloseRounded } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField,
	useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { authService, dbService } from '../../fbase';

import SmallFlatSound from '../../sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';

export default function SignIn({ modalOpen, setModalOpen }) {
	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();
	const handleClose = () => {
		setModalOpen(false);
	};

	const [signIn, setSignIn] = useState(true);

	//--------- INPUT -------------//

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onChange = (e) => {
		const {
			target: { id, value },
		} = e;
		if (id === 'name') {
			setUserName(value);
			setEmail(value + '@dice.cloud');
		} else if (id === 'password') {
			setPassword(value);
		}
	};

	//--------- SIGN UP -------------//

	const handleSignUp = async (e) => {
		smallFlatSound.play();
		e.preventDefault();
		try {
			if (userName !== '') {
				if (userName.length <= 12) {
					const data = await authService.createUserWithEmailAndPassword(
						email,
						password
					);
					await data.user.updateProfile({
						displayName: userName,
					});
					console.log('uid', data.user.uid);
					await dbService.collection('users').doc(data.user.uid).set({
						uid: data.user.uid,
						userName,
						createdAt: Date.now(),
						isOnline: true,
						profileImg: null,
						bestScore: 0,
						totalScore: 0,
						playtimes: 0,
						Rank: 0,
					});
				} else {
					alert('Please enter your name in 12 characters or less.');
				}
			} else {
				alert('Please enter your name.');
			}
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/email-already-in-use':
					alert('This Name is already in use.');
					break;
				case 'auth/invalid-email':
					alert('This Name is not available.');
					break;
				case 'auth/operation-not-allowed':
					alert('Your subscription has been stopped.');
					break;
				case 'auth/weak-password':
					alert('Please enter a password with at least 6 digits');
					break;
				default:
					alert('An unknown error occurred.');
			}
		}
	};

	//---------------SIGN IN-------------------//

	const handleSignIn = async (e) => {
		smallFlatSound.play();
		e.preventDefault();
		try {
			await authService.signInWithEmailAndPassword(email, password);
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/wrong-password':
					alert('The Name or Password is incorrect.');
					break;
				case 'auth/user-not-found':
					alert('The Name or Password is incorrect.');
					break;
				case 'auth/invalid-email':
					alert('The Name form is not vaild.');
					break;
				case 'auth/too-many-requests':
					alert('Please try again later');
					break;
				default:
					alert('An unknown error occurred.');
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
				transitionDuration: '0.8s',
			}}>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					backdropFilter: 'opacity(0.3)',
					pt: 3,
					pb: 0,
					mb: 0,
					fontSize: 22,
					fontWight: 800,
				}}>
				{signIn ? 'Sign In' : 'Sign up'}
			</DialogTitle>
			<IconButton
				onClick={() => {
					handleClose();
					smallFlatSound.play();
				}}
				sx={{ position: 'absolute', top: 15, right: 0, mr: 3 }}>
				<CloseRounded />
			</IconButton>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				{!signIn && (
					<DialogContentText sx={{ mb: 2 }}>
						{[
							'Join us and save your score',
							<br />,
							'to compete with your friends.',
						]}
					</DialogContentText>
				)}

				<TextField
					onChange={onChange}
					margin='nomal'
					id='name'
					label='Name'
					helperText={!signIn ? 'Under 12 letters ' : ''}
					type='text'
					fullWidth
					variant='standard'
					color='info'
					sx={{
						mt: 0,
					}}
				/>
				<TextField
					onChange={onChange}
					margin='normal'
					id='password'
					label='Password'
					helperText={!signIn ? ' At least 6 letters ' : ''}
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
					onClick={() => {
						setSignIn(!signIn);
						smallFlatSound.play();
					}}
					sx={{
						color: theme.palette.text.primary,
						position: 'absolute',
						left: 0,
						ml: 2,
					}}>
					{signIn ? 'New member ?' : 'i already have '}
				</Button>

				<IconButton
					onClick={signIn ? handleSignIn : handleSignUp}
					sx={{ color: theme.palette.text.primary, ml: 0, mr: 2 }}>
					<CheckRounded />
				</IconButton>
			</DialogActions>
		</Dialog>
	);
}
