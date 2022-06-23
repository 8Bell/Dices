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
	ChevronLeftRounded,
} from '@mui/icons-material';
import { Box } from '@mui/material';

export default function SideMenu({ open, setOpen, drawerWidth, ColorModeContext }) {
	const theme = useTheme();
	const colorMode = useContext(ColorModeContext);

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const handleDrawerClose = () => {
		setOpen(false);
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
			anchor='left'
			open={open}>
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
					Ranking
				</Typography>
				<IconButton onClick={handleDrawerClose}>
					<ChevronLeftRounded fontSize='large' />
				</IconButton>
			</DrawerHeader>
			<Divider />
			<ListItem disablePadding>
				<ListItemButton>
					<ListItemText primary='Me' />
					<ListItemIcon>
						<Casino />
					</ListItemIcon>
				</ListItemButton>
			</ListItem>
			<Divider />

			<List>
				{['User 1', 'User 2', 'User 3', 'User 4'].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemText primary={text} />
							<ListItemIcon>
								{index % 2 === 0 ? <Casino /> : <CasinoOutlined />}
							</ListItemIcon>
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
			<Box
				sx={{
					width: '100%',
					height: 60,
					// backgroundColor: '#fff',
					position: 'absolute',
					bottom: 0,
				}}>
				<Divider />
				<IconButton
					sx={{ position: 'absolute', left: 10, bottom: 10 }}
					onClick={colorMode.toggleColorMode}
					color='inherit'>
					{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
				</IconButton>
			</Box>
		</Drawer>
	);
}
