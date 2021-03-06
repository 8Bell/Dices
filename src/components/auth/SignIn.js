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
import { authService, dbService, rtService, rtTimestamp } from '../../fbase';

import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../util/effectSound';

export default function SignIn({ modalOpen, setModalOpen, Eng, handleDeleteGame }) {
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
			setEmail(value + '@dices.cloud');
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
					handleDeleteGame();
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

						indivNumberOfGames: 0,
						indivBestScore: 0,
						indivTotalScore: 0,

						pvpNumberOfGames: 0,
						pvpBestScore: 0,
						win: 0,
						defeat: 0,
						Rank: 0,

						pvp: '',
					});
					checkOnline();
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
					alert(
						`${
							Eng
								? 'This Name is already in use.'
								: '?????? ?????? ???????????????.'
						}`
					);
					break;
				case 'auth/invalid-email':
					alert(
						`${
							Eng
								? 'This Name is not available.'
								: '????????? ???????????? ???????????????.'
						}`
					);
					break;
				case 'auth/operation-not-allowed':
					alert(
						`${
							Eng
								? 'Your subscription has been stopped.'
								: '????????? ?????????????????????. ?????? ??? ?????? ??????????????????.'
						}`
					);
					break;
				case 'auth/weak-password':
					alert(
						`${
							Eng
								? 'Please enter a password with at least 6 digits'
								: '6?????? ????????? ??????????????? ??????????????????.'
						}`
					);

					break;
				default:
					alert(
						`${
							Eng
								? 'An unknown error occurred.'
								: '??? ??? ?????? ????????? ??????????????????.'
						}`
					);
			}
		}
	};

	//---------------SIGN IN-------------------//

	const handleSignIn = async (e) => {
		smallFlatSound.play();

		e.preventDefault();
		try {
			handleDeleteGame();
			await authService.signInWithEmailAndPassword(email, password);
			checkOnline();
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/wrong-password':
					alert(
						`${
							Eng
								? 'The Name or Password is incorrect.'
								: '?????? ?????? ??????????????? ???????????????.'
						}`
					);

					break;
				case 'auth/user-not-found':
					alert(
						`${
							Eng
								? 'The Name or Password is incorrect.'
								: '?????? ?????? ??????????????? ???????????????.'
						}`
					);
					break;
				case 'auth/invalid-email':
					alert(
						`${
							Eng
								? 'The Name form is not vaild.'
								: '???????????? ?????? ???????????????.'
						}`
					);
					break;
				case 'auth/too-many-requests':
					alert(
						`${
							Eng
								? 'Please try again later'
								: '??????????????? ?????????????????????. ?????? ??? ?????? ??????????????????.'
						}`
					);
					break;
				default:
					alert(
						`${
							Eng
								? 'An unknown error occurred.'
								: '??? ??? ?????? ????????? ??????????????????.'
						}`
					);
			}
		}
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
				{signIn ? (Eng ? 'Sign In' : '?????????') : Eng ? 'Sign up' : '????????????'}
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
						{Eng
							? [
									'Join us and save your score',
									<br />,
									'to compete with your friends.',
							  ]
							: [
									'???????????? ????????? ???????????????.',
									<br />,
									'????????? ????????? ??? ????????????! ',
							  ]}
					</DialogContentText>
				)}

				<TextField
					onChange={onChange}
					margin='dense'
					id='name'
					label={Eng ? 'Name' : '??????'}
					helperText={
						!signIn
							? Eng
								? 'Under 12 letters'
								: '12??? ????????? ??????????????????.'
							: ''
					}
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
					label={Eng ? 'Password' : '????????????'}
					helperText={
						!signIn
							? Eng
								? ' At least 6 letters '
								: '6??? ?????? ??????????????????.'
							: ''
					}
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
					{signIn
						? Eng
							? 'New member?'
							: '???????????? ????????????????'
						: Eng
						? 'i already have.'
						: '???????????????????'}
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
