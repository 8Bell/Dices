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

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const onChange = (e) => {
		const {
			target: { id, value },
		} = e;
		if (id === 'email') {
			setEmail(value + '@dice.cloud');
		} else if (id === 'password') {
			setPassword(value);
		} else if (id === 'name') setUserName(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
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

				await dbService
					.collection('users')
					.doc(data.user.uid)
					.set({
						uid: data.user.uid,
						email,
						userName,
						createdAt: Date.now(),
						isOnline: true,
						profileImg: null,
						personalColor:
							'#' +
							(Math.floor(Math.random() * 80) + 50).toString(16) +
							(Math.floor(Math.random() * 80) + 50).toString(16) +
							(Math.floor(Math.random() * 156) + 100).toString(16),
						friends: [],
					});
			} else {
				alert('이름을 입력해주세요.');
			}
		} catch (error) {
			console.log(error);
			switch (error.code) {
				case 'auth/email-already-in-use':
					alert('이미 사용중인 이메일 입니다.');
					break;
				case 'auth/invalid-email':
					alert('유효하지 않은 메일입니다');
					break;
				case 'auth/operation-not-allowed':
					alert('이메일 가입이 중지되었습니다.');
					break;
				case 'auth/weak-password':
					alert('비밀번호를 6자리 이상 입력해주세요');
					break;
				default:
					alert('올바른 아이디 혹은 비밀번호를 입력해주세요');
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
				}}>
				Join
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
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
					color='primary'
					sx={{
						mt: 2,
					}}
				/>
				<TextField
					onChange={onChange}
					margin='nomal'
					id='id'
					label='ID'
					type='text'
					fullWidth
					variant='standard'
					color='primary'
					sx={{
						mt: 2,
					}}
				/>
				<TextField
					onChange={onChange}
					margin='normal'
					id='pasword'
					label='Password'
					type='password'
					fullWidth
					variant='standard'
					color='info'
					sx={{
						mb: 2,
						borderColor: theme.palette.background.paper,
						borderBottom: '1px solid',
					}}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					pb: 3,
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
