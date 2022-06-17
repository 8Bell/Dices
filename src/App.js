import { useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { authService } from './fbase';
import Home from './pages/Home';

const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
	return (
		<div>
			<Outlet />
		</div>
	);
};

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	const [isDeleteMod, setIsDeleteMod] = useState(false);

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
				element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
				<Route
					index
					element={
						<Home
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isDeleteMod={isDeleteMod}
							setIsDeleteMod={setIsDeleteMod}
						/>
					}
				/>
			</Route>
		</Routes>
	);
};

export default App;
