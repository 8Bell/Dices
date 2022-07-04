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

import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';

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

						pvp: '',
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
					alert(
						`${
							Eng
								? 'This Name is already in use.'
								: '사용 중인 이름입니다.'
						}`
					);
					break;
				case 'auth/invalid-email':
					alert(
						`${
							Eng
								? 'This Name is not available.'
								: '사용이 불가능한 이름입니다.'
						}`
					);
					break;
				case 'auth/operation-not-allowed':
					alert(
						`${
							Eng
								? 'Your subscription has been stopped.'
								: '가입이 중지되었습니다. 잠시 뒤 다시 시도해주세요.'
						}`
					);
					break;
				case 'auth/weak-password':
					alert(
						`${
							Eng
								? 'Please enter a password with at least 6 digits'
								: '6자리 이상의 비밀번호를 설정해주세요.'
						}`
					);

					break;
				default:
					alert(
						`${
							Eng
								? 'An unknown error occurred.'
								: '알 수 없는 오류가 발생했습니다.'
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
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/wrong-password':
					alert(
						`${
							Eng
								? 'The Name or Password is incorrect.'
								: '이름 혹은 비밀번호가 틀렸습니다.'
						}`
					);

					break;
				case 'auth/user-not-found':
					alert(
						`${
							Eng
								? 'The Name or Password is incorrect.'
								: '이름 혹은 비밀번호가 틀렸습니다.'
						}`
					);
					break;
				case 'auth/invalid-email':
					alert(
						`${
							Eng
								? 'The Name form is not vaild.'
								: '유효하지 않은 이름입니다.'
						}`
					);
					break;
				case 'auth/too-many-requests':
					alert(
						`${
							Eng
								? 'Please try again later'
								: '로그인이이 중지되었습니다. 잠시 뒤 다시 시도해주세요.'
						}`
					);
					break;
				default:
					alert(
						`${
							Eng
								? 'An unknown error occurred.'
								: '알 수 없는 오류가 발생했습니다.'
						}`
					);
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
				{signIn ? (Eng ? 'Sign In' : '로그인') : Eng ? 'Sign up' : '가입하기'}
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
									'가입하고 점수를 저장하세요.',
									<br />,
									'친구와 경쟁할 수 있습니다! ',
							  ]}
					</DialogContentText>
				)}

				<TextField
					onChange={onChange}
					margin='nomal'
					id='name'
					label={Eng ? 'Name' : '이름'}
					helperText={
						!signIn
							? Eng
								? 'Under 12 letters '
								: '12자 이내로 입력해주세요.'
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
					label={Eng ? 'Password' : '비밀번호'}
					helperText={
						!signIn
							? Eng
								? ' At least 6 letters '
								: '6자 이상 입력해주세요.'
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
							? 'New member ?'
							: '아이디가 없으신가요?'
						: Eng
						? 'i already have'
						: '회원이신가요?'}
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
