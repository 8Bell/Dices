import React, { useContext } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	Brightness4,
	Brightness7,
	Casino,
	CasinoOutlined,
	ChevronLeft,
	ChevronRight,
} from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { height } from '@mui/system';
import Score from './Score';

export default function SideScore({ sideScoreOpen, setSideScoreOpen, drawerWidth, isMobile }) {
	const theme = useTheme();

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const handleDrawerClose = () => {
		setSideScoreOpen(false);
	};

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant='persistent'
			anchor='right'
			open={sideScoreOpen}>
			<DrawerHeader>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'absolute',
						left: 2,
						ml: 2,
					}}>
					Score
				</Typography>
				<IconButton onClick={handleDrawerClose}>
					<ChevronRight />
				</IconButton>
			</DrawerHeader>
			<Divider />

			<Score isMobile={isMobile} />
			<Divider />
		</Drawer>
	);
}
