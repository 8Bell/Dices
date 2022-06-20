import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Rooms from '../components/Rooms';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { Grid, Paper } from '@mui/material';
import Score from '../components/Score';
import SideScore from '../components/SideScore';
import { useTheme } from '@emotion/react';
import Board from '../components/Board';

export default function Game({ drawerWidth, isMobile, isTablet, ColorModeContext }) {
	const theme = useTheme();

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
		<Box sx={{ display: 'flex', overflowX: 'hidden' }}>
			<div
				class={
					theme.palette.mode === 'dark'
						? 'page-preloader-dark'
						: 'page-preloader-light'
				}
			/>
			<CssBaseline />
			<Navbar
				open={open}
				setOpen={setOpen}
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isMobile={isMobile}
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
					<Grid
						xs
						sx={{
							ml: isTablet ? 0 : 2,
							mr: isTablet ? 0 : 1,
							mt: isTablet ? -1 : 1,
						}}>
						<Board isTablet={isTablet} />
					</Grid>
				</Grid>
			</Main>
		</Box>
	);
}
