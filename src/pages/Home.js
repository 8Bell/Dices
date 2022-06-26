import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { useTheme } from '@emotion/react';
import PWAPrompt from 'react-ios-pwa-prompt';
import GameMenu from '../components/GameMenu';

export default function Home({
	isLoggedIn,
	setIsLoggedIn,
	drawerWidth,
	isMobile,
	isTablet,
	ColorModeContext,
}) {
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

	const [open, setOpen] = useState(false);

	return (
		<Box sx={{ display: 'flex' }}>
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
				drawerWidth={drawerWidth}
				// isMobile={isMobile}
			/>
			<SideMenu
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
			/>
			<Main open={open}>
				<DrawerHeader />
				<GameMenu isLoggedIn={isLoggedIn} isMobile={isMobile} isTablet={isTablet} />
				<PWAPrompt
					promptOnVisit={1}
					timesToShow={10}
					delay={3000}
					copyClosePrompt='Close'
					permanentlyHideOnDismiss={false}
					copyTitle='홈화면에 추가하기'
					copyBody={[
						'쾌적한 게임환경을 위해 아래 버튼을 눌러 ',
						<br />,
						'앱을 홈화면에 추가 후 사용해주세요',
					]}
					copyShareButtonLabel="1)  화면 하단의 '공유하기' 버튼을 눌러주세요."
					copyAddHomeButtonLabel="2) '홈화면에 추가'를 누르면 완료! "
				/>
			</Main>
		</Box>
	);
}
