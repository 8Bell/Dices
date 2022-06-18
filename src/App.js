import { createTheme, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import TopAppBar from './components/Appbar';
import LeftDrawer from './components/Drawer';
import { authService } from './fbase';
import Home from './pages/Home';

const Layout = ({ isLoggedIn, setIsLoggedIn, open, setOpen, drawerWidth }) => {
	const ColorModeContext = createContext({ toggleColorMode: () => {} });

	const [mode, setMode] = useState('light');
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
									main: grey[800],
								},
								background: {
									default: '#fbfbfb',
									paper: '#eeeeee',
								},
								text: {
									primary: grey[900],
									secondary: grey[800],
								},
						  }
						: {
								// palette values for dark mode

								primary: {
									main: grey[800],
								},
								background: {
									default: '#121212',
									paper: '#111',
								},
								text: {
									primary: '#fff',
									secondary: grey[500],
								},
						  }),
				},
			}),
		[mode]
	);

	const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
		({ theme, open, drawerWidth }) => ({
			flexGrow: 1,
			padding: theme.spacing(3),
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			marginLeft: 0,
			marginTop: 100,
			...(open && {
				transition: theme.transitions.create('margin', {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginLeft: drawerWidth,
			}),
		})
	);

	return (
		<div>
			<CssBaseline />
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<Main open={open} drawerWidth={drawerWidth}>
						<TopAppBar
							open={open}
							setOpen={setOpen}
							ColorModeContext={ColorModeContext}
						/>

						<Outlet />
						<LeftDrawer
							drawerWidth={drawerWidth}
							open={open}
							setOpen={setOpen}
						/>
					</Main>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</div>
	);
};

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	const [open, setOpen] = useState(true);

	const drawerWidth = 340;

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
						open={open}
						setOpen={setOpen}
						drawerWidth={drawerWidth}
					/>
				}>
				<Route
					index
					element={
						<Home
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							open={open}
							setOpen={setOpen}
							drawerWidth={drawerWidth}
						/>
					}
				/>
			</Route>
		</Routes>
	);
};

export default App;
