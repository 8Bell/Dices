import React, { useState, useEffect } from 'react';

import { authService, dbService } from '../fbase';

import ChatsNavTop from '../components/chatsNavTop';
import ChatsNavBottom from '../components/chatsNavBottom';
import { Avatar, AvatarGroup, Grid, makeStyles, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	background: {
		position: 'fixed',
		backgroundColor: '#f7f7f7',
		top: 0,
		height: '100vh',
		width: '100vw',
		zIndex: 0,
	},
	root: {
		position: 'absolute',
		backgroundColor: '#f7f7f7',
		width: '100vw',
		height: '100%',
		zIndex: 1,
	},
	paper: {
		marginLeft: 15,
		marginRight: 15,
	},
	groupAvatars: {
		marginTop: 15,
		marginRight: 15,

		right: 0,
		zIndex: 0,
	},
	groupAvatar: {
		width: theme.spacing(5),
		height: theme.spacing(5),
		fontWeight: 500,
	},
	chats: {
		marginTop: 67,
		marginBottom: 100,
	},
	chatsTitleBox: {
		marginBottom: 10,
	},
	chatsTitle: {
		marginTop: 3,
		marginLeft: 14,
		marginBottom: 6,
		color: 'gray',
	},
	chat: {
		height: 70,
		borderRadius: '25px',
		marginTop: 10,
		marginBottom: 15,
		backgroundColor: 'rgba(220,220,220,0.1)',
		boxShadow: '0 0 15px 4px rgba(0,0,0,0.06)',
	},
	chatName: {
		marginTop: 15,
		marginLeft: 20,
		fontSize: 16,
	},
	lastDialogue: {
		marginTop: -3,
		marginLeft: 20,
		color: 'gray',
		fontSize: 15,
	},
	chatCheckbox: {
		marginTop: 20,
		marginRight: 0,
	},
}));

export default function Chats() {
	const classes = useStyles();

	// 내 아이디 가져오기

	const [init, setInit] = useState(false);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [myAccount, setMyAccount] = useState({
		displayName: null,
		email: null,
		photoURL: null,
		emailVerified: false,
		uid: null,
		user: null,
	});

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getMyAccount = async () => {
		await authService.onAuthStateChanged((user) => {
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

	// 친구 목록 가져오기
	const [users, setUsers] = useState([]);

	useEffect(() => {
		dbService.collection('users').onSnapshot((snapshot) => {
			const dbUsers = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
				checked: false,
			}));
			setUsers(dbUsers);
		});
	}, []);

	// 채팅 목록 가져오기

	const [chats, setChats] = useState([]);
	const [myChats, setMyChats] = useState(chats);
	const [myChatsUid, setMyChatsUid] = useState([]);

	useEffect(() => {
		dbService
			.collection('chats')
			.orderBy('lastDialogueAt', 'desc')
			.onSnapshot((snapshot) => {
				const dbChats = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setChats(dbChats);
			});
	}, []);

	// 채팅방 참가인원의 이름 가져오기
	// 이름 변경의 경우를 고려해 고유값인 계정 uid로 작업

	const chatMemberNamesArr = []; // 모든 채팅들의 멤버 배열을 담은 배열

	const [chatTitles, setChatTitles] = useState([]);
	const chatTitleArr = [];

	const userUidArr = users.map((user) => user.uid); //전체 유저의 uid 배열
	const userNameArr = users.map((user) => user.userName); //전체 유저의 이름 배열
	const chatUidsArr = chats.map((chat) => chat.memberUid); // 모든 채팅의 멤버 uid 배열을 담은 배열

	useEffect(() => {
		getChatMemberNamesArr();

		setMyChats(chats.filter((chat) => chat.memberUid.includes(myAccount.uid))); //내가 속한 채팅만 반환
		setMyChatsUid(
			chats
				.filter((chat) => chat.memberUid.includes(myAccount.uid))
				.map((myChat) => myChat.chatId)
		); //내가 속한 채팅의 채팅id 배열
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chats]);

	const getChatMemberNamesArr = () => {
		chatUidsArr.map((chatUids) => {
			const chatMemberNames = [];

			chatUids.map((chatUid) => {
				chatMemberNames.push(userNameArr[userUidArr.indexOf(chatUid)]);
			});
			chatMemberNamesArr.push(chatMemberNames);

			let chatTitle = '';

			if (chatUids.length > 3) {
				chatTitle =
					chatMemberNames.slice(0, 3).join(', ') +
					'외' +
					' ' +
					(chatUids.length - 3) +
					'명의 채팅방';
			} else {
				chatTitle = chatMemberNames.join(', ') + '의 채팅방';
			}

			chatTitleArr.push(chatTitle);
		});

		setChatTitles(chatTitleArr);
	};

	const [thisRoom, setThisRoom] = useState('');

	//대화 가져오기
	const [dialogues, setDialogues] = useState([]);

	useEffect(() => {
		dbService
			.collectionGroup('dialogues')
			.orderBy('createdAt')
			.onSnapshot((snapshot) => {
				const dbDialogues = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setDialogues(dbDialogues);
			});
	}, []);

	// 분류된 대화 가져오기
	const [sortedDialogues, setSortedDialogues] = useState([]);

	useEffect(() => {
		thisRoom !== '' &&
			dbService
				.collection('chats')
				.doc(thisRoom)
				.collection('dialogues')
				.orderBy('createdAt')
				.onSnapshot((snapshot) => {
					const dbSortedDialogues = snapshot.docs.map((doc) => ({
						...doc.data(),
					}));
					setSortedDialogues(dbSortedDialogues);
				});
	}, [thisRoom]);

	// uid를 넣으면 이름을 반환하는 함수
	const uidToName = (inputUid) => {
		return userNameArr[userUidArr.indexOf(inputUid)];
	};
	// uid를 넣으면 유저 객체를 반환하는 함수
	const uidToUser = (inputUid) => {
		return users[userUidArr.indexOf(inputUid)];
	};

	// 채팅방 선택하기
	const [chatIndex, setChatIndex] = useState(0);

	const handleInRoom = async (index) => {
		setChatIndex(index);
		const roomId = await myChatsUid[index];
		setThisRoom(roomId);
		Navigate('/chatRoom');
		//	아래 두개 프롭스 전달 필요
		// chatIndex: index,
		// roomId: roomId,
	};

	return (
		<React.Fragment>
			<div className={classes.root}>
				<ChatsNavTop />
				<Grid className={classes.paper}>
					<Grid className={classes.chats}>
						<Grid className={classes.chatsTitleBox}>
							<Typography className={classes.chatsTitle}>
								{' '}
								모든 채팅 {myChats.length}
							</Typography>
						</Grid>
						<Grid>
							{myChats.map((myChat, index) => {
								return (
									<Grid
										container
										key={myChat.chatId}
										className={classes.chat}
										onClick={() => handleInRoom(index)}>
										<Grid item></Grid>
										<Grid item xs color='secondery'>
											<Typography
												variant='h6'
												className={
													classes.chatName
												}>
												{myChat.memberUid.length > 2
													? uidToName(
															myChat
																.memberUid[0]
													  ) +
													  ', ' +
													  uidToName(
															myChat
																.memberUid[1]
													  ) +
													  ' ' +
													  '외 ' +
													  (myChat.memberUid
															.length -
															2) +
													  '명'
													: uidToName(
															myChat.memberUid.filter(
																(
																	uid
																) =>
																	uid !==
																	myAccount.uid
															)[0]
													  )}
											</Typography>
											<Typography
												className={
													classes.lastDialogue
												}>
												{myChat.lastDialogue}
											</Typography>
										</Grid>
										<Grid
											item
											className={classes.groupAvatars}>
											<AvatarGroup max={3} spacing={19}>
												{myChat.memberUid.map(
													(uid, index) => {
														return (
															<Avatar
																key={
																	index
																}
																style={{
																	backgroundColor:
																		uidToUser(
																			uid
																		)
																			.personalColor,
																	filter: 'saturate(40%) grayscale(20%) brightness(130%)',
																}}
																src={
																	uidToUser(
																		uid
																	)
																		.profileImg
																}
																className={
																	classes.groupAvatar
																}>
																{uidToUser(
																	uid
																)
																	.profileImg ==
																	null &&
																	uidToUser(
																		uid
																	).userName.charAt(
																		0
																	)}
															</Avatar>
														);
													}
												)}
											</AvatarGroup>
										</Grid>
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Grid>
				<ChatsNavBottom />
			</div>
			<div className={classes.background} />
		</React.Fragment>
	);
}
