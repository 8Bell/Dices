import { createTheme, CssBaseline, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { authService, rtService, rtTimestamp } from './fbase';
import Game from './pages/Game';
// import Home from './pages/Home';
import './App.css';
import './static/fonts/font.css';
import useSound from './hooks/useSound';
import BGM from './static/sounds/bgm.mp3';
import PWAPrompt from 'react-ios-pwa-prompt';
import { Howler } from 'howler';
import PVPGame from './pages/PVPGame';

const Layout = ({ ColorModeContext }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState(
		localStorage.getItem('mode')
			? localStorage.getItem('mode')
			: prefersDarkMode
			? 'dark'
			: 'light'
	);
	// const [mode, setMode] = useState('light');

	useSound(BGM, 0.4, 20000000000000);

	useEffect(() => {
		localStorage.getItem('mute') &&
			JSON.parse(localStorage.getItem('mute')) === true &&
			Howler.volume(0);
	}, []);

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
			},
		}),
		[]
	);

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
					...(mode === 'light'
						? {
								// palette values for light mode
								primary: {
									main: '#e3e3e4',
								},
								secondary: {
									main: '#ddd',
								},
								background: {
									default: '#e3e3e4',
									paper: '#e3e3e4',
								},
								divider: '#aaa',
								text: {
									primary: grey[900],
									secondary: grey[700],
								},
								action: {
									active: grey[400],
									hover: grey[200],
									selected: grey[300],
								},
								info: {
									main: '#bbb',
								},
						  }
						: {
								// palette values for dark mode

								primary: {
									main: '#191919',
								},
								secondary: {
									main: '#222',
								},
								background: {
									default: '#191919',
									paper: '#191919',
								},
								text: {
									primary: '#fff',
									secondary: grey[500],
								},
								action: {
									active: grey[800],
									hover: grey[600],
									selected: grey[700],
								},
								info: {
									main: '#444',
								},
						  }),
				},
			}),
		[mode]
	);

	const appleThemeColor = document.getElementById('theme-color');
	useEffect(() => {
		mode === 'dark'
			? appleThemeColor.setAttribute('content', '#191919')
			: appleThemeColor.setAttribute('content', '#e3e3e4');
		localStorage.setItem('mode', mode);
	}, [appleThemeColor, mode]);

	return (
		<div>
			<CssBaseline />
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<Outlet />
					<PWAPrompt
						promptOnVisit={1}
						timesToShow={10}
						delay={3000}
						copyClosePrompt='Close'
						permanentlyHideOnDismiss={false}
						copyTitle='???????????? ????????????'
						copyBody={[
							'????????? ??????????????? ?????? ?????? ????????? ?????? ',
							<br />,
							'?????? ???????????? ?????? ??? ??????????????????',
						]}
						copyShareButtonLabel="1)  ?????? ????????? '????????????' ????????? ???????????????."
						copyAddHomeButtonLabel="2) '???????????? ??????'??? ????????? ??????! "
					/>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</div>
	);
};

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

	const [drawerWidth, setDrawerWidth] = useState(340);

	const [pvpScoreDrawerWidth, setPvpScoreDrawerWidth] = useState(450);

	const ColorModeContext = createContext({ toggleColorMode: () => {} });

	const checkOnline = () => {
		const myUid = authService.currentUser.uid;
		const connectionRef = rtService.ref('UsersConnection/' + myUid + '/connection');
		const lastOnlineRef = rtService.ref('UsersConnection/' + myUid + '/lastOnline');
		const connectedRef = rtService.ref('.info/connected');
		connectedRef.on('value', (snapshot) => {
			if (snapshot.val() === true) {
				connectionRef.push().set(true);
				connectedRef.onDisconnect().push().remove();
				//connectedRef.onDisconnect().push().set(false);
				lastOnlineRef.onDisconnect().set(rtTimestamp);
			}
		});
	};

	useEffect(() => {
		isMobile ? setDrawerWidth('100%') : setDrawerWidth(340);
		isMobile ? setPvpScoreDrawerWidth('100%') : setPvpScoreDrawerWidth(450);
	}, [isMobile]);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				setIsLoggedIn(true);
				checkOnline();
			} else {
				setIsLoggedIn(false);
				checkOnline();
			}
		});
	}, []);

	return (
		<Routes>
			<Route path='/' element={<Layout ColorModeContext={ColorModeContext} />}>
				<Route
					index
					element={
						<Game
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							isMobile={isMobile}
							isTablet={isTablet}
						/>
					}
				/>
				<Route
					path='/pvp'
					element={
						<PVPGame
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							pvpScoreDrawerWidth={pvpScoreDrawerWidth}
							isMobile={isMobile}
							isTablet={isTablet}
						/>
					}
				/>
				{/* <Route
					path='/home'
					element={
						<Home
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							isMobile={isMobile}
							isTablet={isTablet}
						/>
					}
				/> */}
			</Route>
		</Routes>
	);
};

export default App;
