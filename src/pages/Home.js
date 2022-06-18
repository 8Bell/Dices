import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Rooms from '../components/Rooms';

export default function Home({ isLoggedIn, setIsLoggedIn, open, setOpen, drawerWidth }) {
	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			{/* <DrawerHeader /> */}
			<Rooms />
		</Box>
	);
}
