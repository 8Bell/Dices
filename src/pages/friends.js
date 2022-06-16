import React, { useState, useEffect } from 'react';

import { authService, dbService } from '../fbase';

import FormDialog from '../components/addfriends';

import FriendsNavBottom from '../components/friendsNavBottom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import FriendsNavTop from '../components/friendsNavTop';
import {
	Avatar,
	AvatarGroup,
	Checkbox,
	FormControlLabel,
	Grid,
	makeStyles,
	Typography,
	Zoom,
} from '@mui/material';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	background: {
		position: 'fixed',
		backgroundColor: '#fbfbfb',
		top: 0,
		height: '100vh',
		width: '100vw',
		zIndex: 0,
	},

	paper: {
		position: 'absolute',
		width: 'calc(100vw - 20px)',
		marginLeft: 10,
		marginRight: 10,
		zIndex: 1,
	},
	profile: {
		height: 85,
		backgroundColor: '#fbfbfb',
		marginTop: 55,
		borderBottom: 'solid 1.5px #eee',
	},
	profileAvatar: {
		top: '23%',
		left: 10,
		width: 50,
		height: 50,
		color: theme.palette.getContrastText(theme.palette.primary.main),
		backgroundColor: theme.palette.primary.main,
		fontWeight: 400,
		fontSize: 25,
	},
	profileName: {
		marginTop: 20,
		marginLeft: 26,
		fontSize: 19,
		fontWeight: 500,
	},
	profileEmail: {
		marginTop: -4,
		marginLeft: 27,
		fontSize: 15,
		fontWeight: 400,
		color: 'gray',
	},
	groupAvatars: {
		marginTop: 23,
		marginRight: 10,
		zIndex: 0,
	},
	groupAvatar: {
		width: theme.spacing(2),
		height: theme.spacing(2),
		fontWeight: 500,
	},
	friends: {
		marginBottom: 100,
	},
	friendsTitleBox: {
		borderBottom: 'solid 1px #f0f0f0',
	},
	friendsTitle: {
		marginTop: 7,
		marginLeft: 14,
		marginBottom: 5,
		color: 'gray',
		fontSize: 13,
		fontWeight: 500,
	},
	friend: {
		height: 67,
		backgroundColor: '#fbfbfb',
		borderBottom: 'solid 1px #f0f0f0',
	},
	friendAvatar: {
		top: '23%',
		left: 10,
		width: 40,
		height: 40,
		color: theme.palette.getContrastText(theme.palette.primary.main),
		backgroundColor: theme.palette.primary.main,
		fontWeight: 500,
		zIndex: 0,
	},

	friendName: {
		marginTop: 15,
		marginLeft: 26,
		fontSize: 16,
		fontWeight: 500,
	},
	friendEmail: {
		marginTop: -5,
		marginLeft: 27,
		color: 'gray',
		fontSize: 14,
		fontWeight: 400,
	},
	friendCheckbox: {
		marginTop: 20,
		marginRight: 0,
	},
}));

export default function Friends() {
	const classes = useStyles();

	// 내 아이디 가져오기
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const myAcc = {
		displayName: '',
		email: '',
		photoURL: '',
		emailVerified: '',
		uid: '',
		user: '',
	};

	const [myAccount, setMyAccount] = useState(myAcc);

	useEffect(() => {
		getMyAccount();
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
				Navigate('/');
			}
			setInit(true);
		});
	}, []);

	const getMyAccount = async () => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setMyAccount({
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					emailVerified: user.emailVerified,
					uid: user.uid,
					user: user,
				});
			}
		});
	};

	// 유저 목록 가져오기
	const [users, setUsers] = useState([]);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		dbService
			.collection('users')
			.orderBy('userName')
			.onSnapshot((snapshot) => {
				const dbUsers = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
					checked: false,
				}));
				setUsers(dbUsers);
			});
	}, []);

	// uid to color
	const uidToColor = (inputUid) => {
		const myAcc = users.filter((member) => member.uid === inputUid);
		try {
			return myAcc[0].personalColor;
		} catch (err) {
			//console.log(err);
		}
	};

	//나를 제외한 유저 목록 필터링
	useEffect(() => {
		setMembers(users.filter((user) => user.id !== myAccount.uid));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	// 친구 추가하기 - 모달창 열기
	const [addFriendState, setAddFriendState] = useState(false);

	// 채팅 추가하기 클릭시 체크박스 나타나게
	const [chatMakingState, setChatMakingState] = useState(false);

	//체크 박스 작동
	const [checkedState, setCheckedState] = useState(
		new Array(users.length).fill(false).slice(0, -1)
	);
	useEffect(() => {
		setCheckedState(new Array(users.length).fill(false).slice(0, -1));
	}, [users]);

	const handleChecked = (position) => {
		console.log(position);
		const updateCheckedState = checkedState.map((item, index) =>
			index === position ? !item : item
		);
		setCheckedState(updateCheckedState);
	};
	console.log('checkedState', checkedState);

	return (
		<React.Fragment>
			<Grid className={classes.paper}>
				<FriendsNavTop
					chatMakingState={chatMakingState}
					setChatMakingState={setChatMakingState}
					setAddFriendState={setAddFriendState}
					checkedState={checkedState}
					setCheckedState={setCheckedState}
					myAccount={myAccount}
					users={users}
				/>

				<Grid container className={classes.profile}>
					<Grid item>
						<Avatar
							src={myAccount.photoURL}
							style={{
								backgroundColor: uidToColor(myAccount.uid),
							}}
							className={classes.profileAvatar}>
							{myAccount.photoURL == null &&
								myAccount.displayName.charAt(0)}
						</Avatar>
					</Grid>
					<Grid item xs>
						<Typography className={classes.profileName}>
							{myAccount.displayName}
						</Typography>
						<Typography className={classes.profileEmail}>
							{myAccount.email}
						</Typography>
					</Grid>
					<Grid item className={classes.groupAvatars}>
						<AvatarGroup
							max={3}
							style={{
								height: 36,
							}}>
							{members.map((member, index) => {
								if (checkedState[index] === true) {
									return (
										<Zoom
											in={checkedState[index]}
											key={index}>
											<Avatar
												style={{
													backgroundColor:
														member.personalColor,
													filter: 'saturate(40%) grayscale(20%) brightness(130%)',
												}}
												src={member.profileImg}
												className={
													classes.groupAvatar
												}>
												{member.profileImg ==
													null &&
													member.userName.charAt(
														0
													)}
											</Avatar>
										</Zoom>
									);
								}
							})}
						</AvatarGroup>
					</Grid>
				</Grid>
				<Grid className={classes.friends}>
					<Grid className={classes.friendsTitleBox}>
						<Typography className={classes.friendsTitle}>
							{' '}
							모든 유저 {members.length}
						</Typography>
					</Grid>
					{members.map((member, index) => {
						return (
							<Grid container key={index} className={classes.friend}>
								<Grid item>
									<Avatar
										style={{
											backgroundColor:
												member.personalColor,
											filter: 'saturate(40%) grayscale(20%) brightness(130%) ',
										}}
										src={member.profileImg}
										className={classes.friendAvatar}>
										{member.profileImg == null &&
											member.userName.charAt(0)}
									</Avatar>
								</Grid>
								<Grid item xs color='secondery'>
									<Typography className={classes.friendName}>
										{member.userName}
									</Typography>
									<Typography className={classes.friendEmail}>
										{member.email}
									</Typography>
								</Grid>
								<Grid>
									<Zoom in={chatMakingState}>
										<FormControlLabel
											label=''
											control={
												<Checkbox
													icon={
														<FavoriteBorderIcon />
													}
													checkedIcon={
														<FavoriteIcon />
													}
													color='primary'
													checked={
														checkedState[
															index
														]
													}
													onClick={() =>
														handleChecked(
															index
														)
													}
													value={
														checkedState[
															index
														]
													}
													className={
														classes.friendCheckbox
													}
												/>
											}
										/>
									</Zoom>
								</Grid>
							</Grid>
						);
					})}
				</Grid>

				<FormDialog
					addFriendState={addFriendState}
					setAddFriendState={setAddFriendState}
				/>
				<FriendsNavBottom />
			</Grid>
			<div className={classes.background} />
		</React.Fragment>
	);
}
