import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Zoom } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			width: '100vw',
			height: 55,
			position: 'fixed',
			top: 0,
			left: 0,
			zIndex: 1,
			backgroundColor: 'rgba(220,220,220,0.3)',
			backdropFilter: 'blur(7px)',
			boxShadow: '0 0 12px 6px rgba(0,0,0,0.1)',
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
			color: '#444',
			fontSize: 22,
			fontWeight: 500,
		},
		plusIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 0,
			right: 10,
			color: '#444',
		},
		nextIconBtn: {
			position: 'absolute',
			zIndex: 2,
			top: 0,
			right: 10,
		},
		nextIconText: {
			marginRight: 5,
			fontSize: 20,
			fontWeight: 500,
		},
	})
);

// eslint-disable-next-line no-empty-pattern
export default function ChatsNavTop({}) {
	const classes = useStyles();
	const [auth, setAuth] = useState(true);
	const [anchorEl, setAnchorEl] = (useState < null) | (HTMLElement > null);
	const open = Boolean(anchorEl);

	const handleMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleAddChat = () => {
		setAnchorEl(null);
	};
	const handleAddFriend = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<AppBar className={classes.root}>
				<Toolbar>
					<Typography variant='h5' className={classes.title}>
						채팅
					</Typography>
					{auth && (
						<div>
							<Zoom in={true}>
								<IconButton
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleMenu}
									color='inherit'
									className={classes.plusIconBtn}></IconButton>
							</Zoom>
							<Zoom in={true}>
								<IconButton
									color='primary'
									className={classes.nextIconBtn}>
									<Typography
										className={
											classes.nextIconText
										}></Typography>
								</IconButton>
							</Zoom>

							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}>
								<MenuItem onClick={handleAddChat}>
									채팅 추가하기
								</MenuItem>
								<MenuItem onClick={handleAddFriend}>
									친구 추가하기
								</MenuItem>
							</Menu>
						</div>
					)}
				</Toolbar>
			</AppBar>
		</div>
	);
}
