import { useTheme } from '@emotion/react';
import { Casino, CasinoOutlined, ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	styled,
	Toolbar,
	Typography,
} from '@mui/material';

export default function LeftDrawer({ drawerWidth, open, setOpen }) {
	const theme = useTheme();

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	return (
		<div>
			<Toolbar />
			<Divider />
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
							left: 20,
						}}>
						Current Users
					</Typography>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{['Mori', 'Dog', 'Cat', 'Rabbit'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemText primary={text} />
								<ListItemIcon>
									{index % 2 === 0 ? (
										<Casino />
									) : (
										<CasinoOutlined />
									)}
								</ListItemIcon>
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
			</Drawer>
		</div>
	);
}
