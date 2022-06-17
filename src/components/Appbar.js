import { Menu } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

export default function TopAppBar({ mobileOpen, setMobileOpen, drawerWidth }) {
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<AppBar
			position='fixed'
			sx={{
				width: { sm: `calc(100% - ${drawerWidth}px)` },
				ml: { sm: `${drawerWidth}px` },
			}}>
			<Toolbar>
				<IconButton
					color='inherit'
					aria-label='open drawer'
					edge='start'
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: 'none' } }}>
					<Menu />
				</IconButton>
				<Typography variant='h6' noWrap component='div'>
					Responsive drawer
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
