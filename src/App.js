import { createTheme, ThemeProvider } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import TopAppBar from './components/Appbar';
import { authService } from './fbase';
import Home from './pages/Home';

const Layout = ({ isLoggedIn, setIsLoggedIn, open, setOpen }) => {
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

	return (
		<div>
			<ColorModeContext.Provider value={colorMode}>
				<ThemeProvider theme={theme}>
					<TopAppBar
						open={open}
						setOpen={setOpen}
						ColorModeContext={ColorModeContext}
					/>
					<Outlet />
				</ThemeProvider>
			</ColorModeContext.Provider>
		</div>
	);
};

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	const [open, setOpen] = useState(true);

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
						/>
					}
				/>
			</Route>
		</Routes>
	);
};

export default App;
