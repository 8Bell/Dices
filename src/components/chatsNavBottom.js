import { ChatRounded, LockRounded, PeopleAltRounded } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, makeStyles } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { authService } from '../fbase';

const useStyles = makeStyles({
	root: {
		width: 'calc(100vw - 40px)',
		height: 65,
		position: 'fixed',
		bottom: 20,
		left: '20px',
		backgroundColor: 'rgba(220,220,220,0.2)',
		backdropFilter: 'blur(7px)',
		boxShadow: '0 0 20px 10px rgba(0,0,0,0.1)',
		borderRadius: '50px',
	},
});

export default function ChatsNavBottom() {
	const classes = useStyles();
	const [value, setValue] = React.useState('chats');

	const handleChange = (newValue) => {
		setValue(newValue);
	};
	const onClick = () => {
		setValue('signOut');
		setTimeout(() => {
			window.confirm('로그아웃하시겠습니까?')
				? authService.signOut()
				: setTimeout(() => {
						setValue('chats');
				  }, 300);
		}, 300);
	};

	return (
		<div>
			<BottomNavigation value={value} onChange={handleChange} className={classes.root}>
				<BottomNavigationAction
					onClick={() => {
						Navigate('/friends');
					}}
					label='친구'
					value='friends'
					style={{ transform: 'translateY(4px)' }}
					icon={<PeopleAltRounded />}></BottomNavigationAction>

				<BottomNavigationAction
					label='채팅'
					value='chats'
					style={{ transform: 'translateY(4px)' }}
					icon={<ChatRounded />}></BottomNavigationAction>

				<BottomNavigationAction
					onClick={onClick}
					label='로그아웃'
					value='signOut'
					style={{ transform: 'translateY(4px)' }}
					icon={<LockRounded />}
				/>
			</BottomNavigation>
		</div>
	);
}
