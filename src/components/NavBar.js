import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FormatListBulletedRounded, GroupRounded, ViewListRounded } from '@mui/icons-material';
import Divider from '@mui/material/Divider';

export default function Navbar({
	open,
	setOpen,
	sideScoreOpen,
	setSideScoreOpen,
	drawerWidth,
	ColorModeContext,
	isTablet,
}) {
	const AppBar = styled(MuiAppBar, {
		shouldForwardProp: (prop) => prop !== 'open',
	})(({ theme, open }) => ({
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: `${drawerWidth}px`,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}));

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleScoreOpen = () => {
		setSideScoreOpen(true);
	};

	return (
		<div>
			<AppBar
				position='fixed'
				open={open}
				sx={{
					backgroundImage: 'none',
					boxShadow: 'none',
					borderBottom: 'solid 1px theme.palette.divider',
				}}>
				<Toolbar>
					<IconButton
						color='inherit'
						ariaLabel='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						sx={{ mr: 2, ...(open && { display: 'none' }) }}>
						<GroupRounded sx={{ fontSize: 25 }} />
					</IconButton>
					{isTablet && (
						<IconButton
							color='inherit'
							ariaLabel='open drawer'
							onClick={handleScoreOpen}
							edge='end'
							sx={{ mr: 0.5, position: 'absolute', right: 0 }}>
							<FormatListBulletedRounded sx={{ fontSize: 26 }} />
						</IconButton>
					)}
				</Toolbar>
				<Divider />
			</AppBar>
		</div>
	);
}
