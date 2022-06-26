import React, { useContext, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import ListItemText from '@mui/material/ListItemText';
import {
	Brightness4,
	Brightness7,
	ChevronLeftRounded,
	CloudOffRounded,
	CloudUploadRounded,
	MusicNoteRounded,
	MusicOffRounded,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Howler } from 'howler';
import SignIn from './auth/SignIn';
import { authService, dbService } from '../fbase';

export default function SideMenu({
	isLoggedIn,
	setIsLoggedIn,
	open,
	setOpen,
	drawerWidth,
	ColorModeContext,
}) {
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const [mute, setMute] = useState(false);

	const handleChangrVolum = () => {
		mute ? Howler.volume(0.5) : Howler.volume(0);
		setMute(!mute);
	};

	const [modalOpen, setModalOpen] = useState(false);

	const handleClickOpen = () => {
		setModalOpen(true);
	};

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			user ? setIsLoggedIn(true) : setIsLoggedIn(false);
		});
		console.log('isLoggedIn', isLoggedIn);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLogOut = () => {
		authService.signOut();
		console.log('isLoggedIn', isLoggedIn);
	};

	//--------------CURRENT USER ---------------//

	const [myUid, setMyUid] = useState('');

	useEffect(() => {
		authService.currentUser !== null && setMyUid(authService.currentUser.uid);
	}, []);

	//-----------------USERS------------------//

	const [users, setUsers] = useState([]);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		dbService
			.collection('users')
			.orderBy('Rank')
			.onSnapshot((snapshot) => {
				const dbUsers = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
					checked: false,
				}));
				setUsers(dbUsers);
			});
	}, []);

	const [me, setMe] = useState([]);

	useEffect(() => {
		setMe(users.filter((user) => user.id === myUid));
		setMembers(users.filter((user) => user.id !== myUid));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	console.log('me', me);
	console.log('members', members);
	console.log('myUid', myUid);

	//-----local best score ----//
	const bestScore = localStorage.getItem('BestScore')
		? JSON.parse(localStorage.getItem('BestScore'))
		: 0;

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant='persistent'
			anchor='left'
			open={open}>
			<DrawerHeader>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'absolute',
						left: 2,
						ml: 2,
					}}>
					Rank
				</Typography>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftRounded fontSize='large' />
				</IconButton>
			</DrawerHeader>
			<Divider />

			<ListItem disablePadding>
				<ListItemButton>
					<ListItemText
						primary={me[0] ? me[0].userName : 'player'}
						sx={{ textAlign: 'left' }}
					/>
					<ListItemText
						primary={me[0] ? me[0].bestScore : bestScore}
						sx={{ textAlign: 'right', position: 'absolute', right: 70 }}
					/>
					<ListItemText
						primary={me[0] ? me[0].Rank : 0}
						sx={{ textAlign: 'right' }}
					/>
				</ListItemButton>
			</ListItem>

			<Divider />

			<List>
				{members.map((member, idx) => (
					<ListItem key={idx} disablePadding>
						<ListItemButton>
							<ListItemText
								primary={member.userName}
								sx={{ textAlign: 'left' }}
							/>
							<ListItemText
								primary={member.bestScore}
								sx={{
									textAlign: 'right',
									position: 'absolute',
									right: 70,
								}}
							/>
							<ListItemText
								primary={member.Rank}
								sx={{ textAlign: 'right' }}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
			{/* <Divider /> */}
			<Box
				sx={{
					width: '100%',
					height: 60,
					// backgroundColor: '#fff',
					position: 'absolute',
					bottom: 0,
				}}>
				<Divider />
				<IconButton
					sx={{ position: 'absolute', left: 15, bottom: 10 }}
					onClick={colorMode.toggleColorMode}
					color='inherit'>
					{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
				</IconButton>
				<IconButton
					sx={{ position: 'absolute', left: 65, bottom: 10 }}
					onClick={handleChangrVolum}
					color='inherit'>
					{mute ? <MusicOffRounded /> : <MusicNoteRounded />}
				</IconButton>
				<IconButton
					sx={{ position: 'absolute', right: 15, bottom: 10 }}
					onClick={isLoggedIn ? handleLogOut : handleClickOpen}
					color='inherit'>
					{isLoggedIn ? <CloudOffRounded /> : <CloudUploadRounded />}
				</IconButton>
				<SignIn modalOpen={modalOpen} setModalOpen={setModalOpen} />
			</Box>
		</Drawer>
	);
}
