import { createTheme, CssBaseline, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { authService } from './fbase';
import Game from './pages/Game';
// import Home from './pages/Home';
import './App.css';
import './fonts/font.css';
import useSound from './hooks/useSound';
import BGM from './sounds/bgm.mp3';

const Layout = ({ isLoggedIn, setIsLoggedIn, ColorModeContext }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState(
		localStorage.getItem('mode')
			? localStorage.getItem('mode')
			: prefersDarkMode
			? 'dark'
			: 'light'
	);
	// const [mode, setMode] = useState('light');

	useSound(BGM, 0.5, 20000000000000000000000000);

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
									main: '#111',
								},
								secondary: {
									main: '#222',
								},
								background: {
									default: '#111',
									paper: '#111',
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
			? appleThemeColor.setAttribute('content', '#111')
			: appleThemeColor.setAttribute('content', '#e3e3e4');
		localStorage.setItem('mode', mode);
	}, [appleThemeColor, mode]);

	return (
		<div>
			<CssBaseline />
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<Outlet />
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
	const ColorModeContext = createContext({ toggleColorMode: () => {} });

	useEffect(() => {
		isMobile ? setDrawerWidth('100%') : setDrawerWidth(340);
	}, [isMobile]);

	// const handleSignIn = () => {
	// 	authService.sendPasswordResetEmail
	//  }

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		});
	}, []);

	return (
		<Routes>
			<Route
				path='/'
				element={
					<Layout
						isLoggedIn={isLoggedIn}
						setIsLoggedIn={setIsLoggedIn}
						ColorModeContext={ColorModeContext}
					/>
				}>
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
				{/* <Route
					path='/pvpmode'
					element={
						<Pvp
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							isMobile={isMobile}
							isTablet={isTablet}
						/>
					}
				/> */}
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
