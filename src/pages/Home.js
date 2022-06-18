import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Rooms from '../components/Rooms';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';

export default function Home({ drawerWidth, isMobile, ColorModeContext }) {
	const Main = styled('main', {
		shouldForwardProp: (prop) => prop !== 'open',
	})(({ theme, open }) => ({
		flexGrow: 1,
		padding: theme.spacing(1),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: isMobile ? '-100%' : -drawerWidth,

		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
		}),
	}));

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const [open, setOpen] = useState(true);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Navbar
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
			/>
			<SideMenu open={open} setOpen={setOpen} drawerWidth={drawerWidth} />
			<Main open={open}>
				<DrawerHeader />
				<Rooms />
			</Main>
		</Box>
	);
}
