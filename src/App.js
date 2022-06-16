import { useEffect, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { authService } from './fbase';
import SignIn from './pages';
import ChatRoom from './pages/chatRoom';
import Chats from './pages/chats';
import Friends from './pages/friends';
import SignUp from './pages/sign-up';

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
						<SignIn
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isDeleteMod={isDeleteMod}
							setIsDeleteMod={setIsDeleteMod}
						/>
					}
				/>
				<Route
					path='/signup'
					element={
						<SignUp
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isDeleteMod={isDeleteMod}
							setIsDeleteMod={setIsDeleteMod}
						/>
					}
				/>
				<Route
					path='/chats'
					element={
						<Chats
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isDeleteMod={isDeleteMod}
							setIsDeleteMod={setIsDeleteMod}
						/>
					}
				/>
				<Route
					path='/friends'
					element={
						<Friends
							isLoggedIn={isLoggedIn}
							setIsLoggedIn={setIsLoggedIn}
							isDeleteMod={isDeleteMod}
							setIsDeleteMod={setIsDeleteMod}
						/>
					}
				/>
				<Route
					path='/chatroom'
					element={
						<ChatRoom
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
