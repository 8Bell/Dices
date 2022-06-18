import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Rooms from '../components/Rooms';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { Grid } from '@mui/material';
import Score from '../components/Score';
import SideScore from '../components/SideScore';

export default function Game({ drawerWidth, isMobile, isTablet, ColorModeContext }) {
	const Main = styled('main', {
		shouldForwardProp: (prop) => prop !== 'open',
	})(({ theme, open }) => ({
		flexGrow: 1,
		padding: theme.spacing(1),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: isMobile ? '-200%' : -drawerWidth * 2,

		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: isMobile ? '-300%' : -drawerWidth * 2,
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

	const [open, setOpen] = useState(false);
	const [sideScoreOpen, setSideScoreOpen] = useState(false);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Navbar
				open={open}
				setOpen={setOpen}
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isTablet={isTablet}
			/>
			<SideMenu
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
			/>
			<SideScore
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isMobile={isMobile}
			/>
			<Main open={open}>
				<DrawerHeader />

				<Grid container>
					{!isTablet && (
						<Grid xs={4}>
							<Score isMobile={isMobile} />
						</Grid>
					)}
					<Grid xs>
						<Rooms />
					</Grid>
				</Grid>
			</Main>
		</Box>
	);
}
