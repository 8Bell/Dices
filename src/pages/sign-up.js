import {
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	makeStyles,
	TextField,
	Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { authService, dbService, Timestamp } from '../../fbase';

function Copyright() {
	return (
		<Typography
			variant='body2'
			color='textSecondary'
			align='center'
			style={{
				position: 'fixed',
				bottom: '30px',
				left: '50%',
				transform: 'translateX(-50%)',
			}}>
			{'Copyright © '}
			<Link color='inherit' href='/home'>
				Whale Talk
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(3),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingLeft: 5,
		paddingRigt: 10,
	},
	icon: {
		width: 200,
		height: 200,
	},

	form: {
		width: 'calc(100% - 50px)', // Fix IE 11 issue.
		marginTop: theme.spacing(0),
	},
	textField: {
		marginTop: theme.spacing(0),
		borderRadius: '30px',
	},
	submit: {
		margin: theme.spacing(6, 0, 3),
		height: '50px',
		borderRadius: '30px',
	},
	title: {
		margin: theme.spacing(-1, 0, 1, 0),
		fontSize: '23px',
		fontWeight: 500,
		color: '#44546A',
	},
}));

export default function SignUp() {
	const classes = useStyles();

	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				setTimeout(() => {
					Navigate('/friends');
				}, 2500);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rePassword, setRePassword] = useState('');

	const onChange = (e) => {
		const {
			target: { id, value },
		} = e;
		if (id === 'email') {
			setEmail(value);
		} else if (id === 'password') {
			setPassword(value);
		} else if (id === 'rePassword') {
			setRePassword(value);
		} else if (id === 'Name') setUserName(value);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			if (userName !== '') {
				if (password === rePassword) {
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
							createdDate: Timestamp,
							isOnline: true,
							profileImg: null,
							personalColor:
								'#' +
								(Math.floor(Math.random() * 80) + 50).toString(16) +
								(Math.floor(Math.random() * 80) + 50).toString(16) +
								(Math.floor(Math.random() * 156) + 100).toString(
									16
								),
							friends: [],
						});
				} else {
					alert('확인 비밀번호가 일치하지 않습니다.');
				}
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
					alert('비밀번호를 6자리 이상 입력해주세요.');
					break;
				default:
					alert('회원가입이 실패했습니다.');
			}
		}
	};

	return (
		<React.Fragment>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<img
						src='/images/whale plastic 2@0.5x.png'
						alt='whale icon'
						className={classes.icon}
						height='200'
						width='200'
					/>
					<Typography component='h1' variant='h5' className={classes.title}>
						가입하기
					</Typography>
					<form className={classes.form} onSubmit={onSubmit} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									variant='standard'
									required
									fullWidth
									id='Name'
									label='이름'
									name='Name'
									autoComplete='lname'
									className={classes.textField}
									value={userName}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='standard'
									required
									fullWidth
									id='email'
									label='이메일을 입력하세요'
									name='email'
									autoComplete='email'
									className={classes.textField}
									value={email}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='standard'
									required
									fullWidth
									name='password'
									label='비밀번호를 입력하세요'
									type='password'
									id='password'
									autoComplete='current-password'
									className={classes.textField}
									value={password}
									onChange={onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='standard'
									required
									fullWidth
									name='rePassword'
									label='비밀번호 확인'
									type='password'
									id='rePassword'
									autoComplete='current-password'
									className={classes.textField}
									value={rePassword}
									onChange={onChange}
								/>
							</Grid>
						</Grid>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							가입하기
						</Button>
					</form>
					<Grid container justifyContent='flex-end' style={{ marginRight: 50 }}>
						<Grid item>
							<Link href='/' variant='body2'>
								로그인 화면으로 돌아가기
							</Link>
						</Grid>
					</Grid>
				</div>
				<Box mt={5}>
					<Copyright />
				</Box>
			</Container>
		</React.Fragment>
	);
}
