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
	CloudDoneRounded,
	CloudUploadOutlined,
	MusicNoteRounded,
	MusicOffRounded,
	Settings,
} from '@mui/icons-material';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { Howler } from 'howler';
import SignIn from './auth/SignIn';
import { authService } from '../fbase';

import dl from '../static/img/dl.gif';
import d0 from '../static/img/d0.png';
import d1 from '../static/img/d1.png';
import d2 from '../static/img/d2.png';
import d3 from '../static/img/d3.png';
import d4 from '../static/img/d4.png';
import d5 from '../static/img/d5.png';
import d6 from '../static/img/d6.png';
import ll from '../static/img/ll.gif';
import l0 from '../static/img/l0.png';
import l1 from '../static/img/l1.png';
import l2 from '../static/img/l2.png';
import l3 from '../static/img/l3.png';
import l4 from '../static/img/l4.png';
import l5 from '../static/img/l5.png';
import l6 from '../static/img/l6.png';
import SignOut from './auth/Signout';
import SmallFlatSound from '../static/sounds/smallFlat.mp3';
import effectSound from '../hooks/effectSound';
//import UserInformation from './modal/UserInformation';

export default function SideMenu({
	isLoggedIn,
	setIsLoggedIn,
	open,
	setOpen,
	drawerWidth,
	isTablet,
	ColorModeContext,
	me,
	members,
	Eng,
	setEng,
	// mute,
	// setMute,
}) {
	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const handleDrawerClose = () => {
		smallFlatSound.play();
		setOpen(false);
	};

	const [modalOpen, setModalOpen] = useState(false); // login
	const [modal2Open, setModal2Open] = useState(false); //logout
	//const [modal3Open, setModal3Open] = useState(false); //userinfo
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);

	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 0.5);

	const savedMute = localStorage.getItem('mute')
		? JSON.parse(localStorage.getItem('mute'))
		: false;

	const [mute, setMute] = useState(savedMute);

	const handleChangeVolum = () => {
		smallFlatSound.play();
		mute ? Howler.volume(0.5) : Howler.volume(0);
		setMute(!mute);
	};

	useEffect(() => {
		localStorage.setItem('mute', JSON.stringify(mute));
	}, [mute]);

	const handleClickOpen = () => {
		smallFlatSound.play();
		setModalOpen(true);
	};

	//------ LOG IN OUT ------//

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			user ? setIsLoggedIn(true) : setIsLoggedIn(false);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//------ HANDLE MEMBER CLICK ------//
	// const [propIdx, setPropIdx] = useState(0);

	// const handleMemberClick = (idx) => {
	// 	smallFlatSound.play();
	// 	setPropIdx(idx);
	// 	setTimeout(() => {
	// 		setModal3Open(true);
	// 	}, [100]);
	// };

	//-----local best score ----//
	const bestScore = localStorage.getItem('BestScore')
		? JSON.parse(localStorage.getItem('BestScore'))
		: 0;

	//--------DICE IMGS-------//

	const D = [d0, d1, d2, d3, d4, d5, d6, dl];
	const L = [l0, l1, l2, l3, l4, l5, l6, ll];

	//-------SPEEDDIAL--------//
	const actions = [
		{
			icon: (
				<IconButton
					//sx={{ position: 'absolute', left: 15, bottom: 10 }}
					onClick={() => {
						colorMode.toggleColorMode();
						smallFlatSound.play();
					}}
					color='inherit'>
					{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
				</IconButton>
			),
			name: 'Mode',
		},
		{
			icon: (
				<IconButton
					//	sx={{ position: 'absolute', left: 65, bottom: 10 }}
					onClick={handleChangeVolum}
					color='inherit'>
					{mute ? <MusicOffRounded /> : <MusicNoteRounded />}
				</IconButton>
			),
			name: 'Bgm',
		},
		{
			icon: (
				<IconButton
					sx={{ fontSize: 18, fontWeight: 'bold' }}
					onClick={() => {
						setEng(!Eng);
						smallFlatSound.play();
					}}
					color='inherit'>
					{Eng ? 'EN' : 'KO'}
				</IconButton>
			),
			name: 'Language',
		},
	];

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
			<DrawerHeader
				sx={{
					borderTop: isTablet ? '1px solid' : 'none',
					//borderBottom: 'none',
					borderColor: theme.palette.divider,
				}}>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'absolute',
						left: 2,
						ml: 2,
						fontWeight: 'bold',
					}}>
					{Eng ? 'Rank' : '랭킹'}
				</Typography>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftRounded fontSize='large' />
				</IconButton>
			</DrawerHeader>
			<Divider />
			<ListItem disablePadding sx={{ ml: 2, height: 50 }}>
				{/* <ListItemButton> */}
				<ListItemText primary={Eng ? 'NAME' : '이름'} sx={{ textAlign: 'left' }} />
				<ListItemText
					primary={Eng ? 'Record' : '최고 점수'}
					sx={{
						textAlign: 'right',
						position: 'absolute',
						right: Eng ? 103 : 95,
					}}
				/>
				<ListItemText
					primary={Eng ? 'Rank' : '랭크'}
					sx={{
						textAlign: 'right',
						position: 'absolute',
						right: Eng ? 35 : 35,
					}}
				/>
				{/* </ListItemButton> */}
			</ListItem>

			<Divider />

			<ListItem disablePadding>
				<ListItemButton>
					<ListItemText
						primary={
							me[0]
								? me[0].userName
								: Eng
								? 'guest player(me)'
								: '손님(나)'
						}
						sx={{ textAlign: 'left' }}
					/>
					<ListItemText
						primary={me[0] ? me[0].indivBestScore : bestScore}
						sx={{ textAlign: 'right', position: 'absolute', right: 100 }}
					/>
					{isLoggedIn ? (
						<img
							src={
								theme.palette.mode === 'dark'
									? D[`${me[0] ? me[0].Rank + 1 : 1}`]
									: L[`${me[0] ? me[0].Rank + 1 : 1}`]
							}
							alt={me[0] ? me[0].Rank + 1 : 1}
							style={{ width: 35 }}
						/>
					) : (
						<ListItemText primary='-' sx={{ textAlign: 'right', mr: 2 }} />
					)}
				</ListItemButton>
			</ListItem>

			<Divider />

			<List>
				{members.map((member, idx) => (
					<ListItem key={idx} disablePadding>
						<ListItemButton
						// onClick={() => {
						// 	handleMemberClick(idx);
						// }}
						>
							<ListItemText
								primary={member.userName}
								sx={{ textAlign: 'left' }}
							/>
							<ListItemText
								primary={member.indivBestScore}
								sx={{
									textAlign: 'right',
									position: 'absolute',
									right: 100,
								}}
							/>
							<img
								src={
									theme.palette.mode === 'dark'
										? D[member.Rank + 1]
										: L[member.Rank + 1]
								}
								alt={me[0] ? me[0].Rank + 1 : 1}
								style={{ width: 35 }}
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

				<SpeedDial
					ariaLabel='SpeedDial openIcon example'
					sx={{
						position: 'absolute',
						bottom: 4,
						left: 10,
					}}
					icon={
						<SpeedDialIcon
							icon={<Settings sx={{ fontSize: 27 }} />}
							openIcon={<Settings sx={{ fontSize: 27 }} />}
						/>
					}
					onClick={() => smallFlatSound.play()}>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
						/>
					))}
				</SpeedDial>

				<IconButton
					sx={{ position: 'absolute', right: 20, bottom: 7 }}
					onClick={
						isLoggedIn
							? () => {
									setModal2Open(true);
									smallFlatSound.play();
							  }
							: handleClickOpen
					}
					color='inherit'>
					{isLoggedIn ? (
						<CloudDoneRounded sx={{ fontSize: 28 }} />
					) : (
						<CloudUploadOutlined sx={{ fontSize: 28 }} />
					)}
				</IconButton>

				<SignIn modalOpen={modalOpen} setModalOpen={setModalOpen} Eng={Eng} />
				<SignOut modal2Open={modal2Open} setModal2Open={setModal2Open} Eng={Eng} />
				{/* <UserInformation
					modal3Open={modal3Open}
					setModal3Open={setModal3Open}
					members={members}
					propIdx={propIdx}
					Eng={Eng}
				/> */}
			</Box>
		</Drawer>
	);
}
