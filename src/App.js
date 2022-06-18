import { createTheme, CssBaseline, ThemeProvider, useMediaQuery, useTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

import { authService } from './fbase';
import Game from './pages/Game';

import Home from './pages/Home';

const Layout = ({ isLoggedIn, setIsLoggedIn, ColorModeContext }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

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
									main: '#eee',
								},
								secondary: {
									main: '#ddd',
								},
								background: {
									default: '#eee',
									paper: '#eee',
								},
								text: {
									primary: grey[900],
									secondary: grey[800],
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
									secondary: grey[400],
								},
						  }),
				},
			}),
		[mode]
	);

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

	const [drawerWidth, setDrawerWidth] = useState(340);
	const ColorModeContext = createContext({ toggleColorMode: () => {} });

	useEffect(() => {
		isMobile ? setDrawerWidth('100%') : setDrawerWidth(340);
	}, [isMobile]);

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
						<Home
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							isMobile={isMobile}
						/>
					}
				/>
				<Route
					path='/game'
					element={
						<Game
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							ColorModeContext={ColorModeContext}
							drawerWidth={drawerWidth}
							isMobile={isMobile}
						/>
					}
				/>
			</Route>
		</Routes>
	);
};

export default App;
