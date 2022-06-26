import React, { useContext, useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	Brightness4,
	Brightness7,
	Casino,
	CasinoOutlined,
	ChevronLeftRounded,
	LoginRounded,
	LogoutRounded,
	MusicNoteRounded,
	MusicOffRounded,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Howler } from 'howler';
import SignIn from './auth/SignIn';
import { authService } from '../fbase';

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
	}, []);

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
					<ListItemText primary='Me' />
					<ListItemIcon>
						<Casino />
					</ListItemIcon>
				</ListItemButton>
			</ListItem>
			<Divider />

			<List>
				{[].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemText primary={text} />
							<ListItemIcon>
								{index % 2 === 0 ? <Casino /> : <CasinoOutlined />}
							</ListItemIcon>
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
					onClick={handleClickOpen}
					color='inherit'>
					{isLoggedIn ? <LogoutRounded /> : <LoginRounded />}
				</IconButton>
				<SignIn modalOpen={modalOpen} setModalOpen={setModalOpen} />
			</Box>
		</Drawer>
	);
}
