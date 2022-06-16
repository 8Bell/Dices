import {
	AppBar,
	createStyles,
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	Zoom,
} from '@mui/material';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: '100vw',
			height: 70,
			position: 'fixed',
			top: 0,
			left: 0,
			zIndex: 2,
			backgroundColor: 'rgba(220,220,220,0.3)',
			backdropFilter: 'blur(7px)',
			boxShadow: '0 0 12px 6px rgba(0,0,0,0.1)',
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
			fontSize: 17,
			marginTop: 9,
			color: '#444',
		},
		plusIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 7,
			right: 10,
		},
		nextIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 8,
			right: 10,
		},
		nextIconText: {
			marginRight: 5,
			fontSize: 22,
			fontWeight: 500,
		},
	})
);

export default function ChatRoomNavTop({ myChats, chatIndex, uidToName, myAccount }) {
	const classes = useStyles();
	const myChat = myChats[chatIndex];
	const [auth, setAuth] = useState(true);
	const [anchorEl, setAnchorEl] = (useState < null) | (HTMLElement > null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleAddChat = () => {
		setAnchorEl(null);
	};
	const handleAddFriend = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<AppBar className={classes.root}>
				<Toolbar>
					<Typography className={classes.title}>
						{myChat
							? myChat.memberUid.length > 3
								? uidToName(myChat.memberUid[0]) +
								  ', ' +
								  uidToName(myChat.memberUid[1]) +
								  ', ' +
								  uidToName(myChat.memberUid[2]) +
								  '외 ' +
								  (myChat.memberUid.length - 3) +
								  '명의 채팅방'
								: myChat.memberUid.length > 2
								? uidToName(myChat.memberUid[0]) +
								  ', ' +
								  uidToName(myChat.memberUid[1]) +
								  ', ' +
								  uidToName(myChat.memberUid[2]) +
								  '의 채팅방'
								: uidToName(
										myChat.memberUid.filter(
											(uid) => uid !== myAccount.uid
										)[0]
								  )
							: '채팅'}
					</Typography>
					{auth && (
						<div>
							<Zoom in={true}>
								<IconButton
									color='primary'
									onClick={() => Navigate('/chats')}
									className={classes.nextIconBtn}>
									<Typography className={classes.nextIconText}>
										채팅목록
									</Typography>
								</IconButton>
							</Zoom>

							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}>
								<MenuItem onClick={handleAddChat}>
									채팅 추가하기
								</MenuItem>
								<MenuItem onClick={handleAddFriend}>
									친구 추가하기
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
}
