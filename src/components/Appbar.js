import { Brightness4, Brightness7, GroupRounded, Menu } from '@mui/icons-material';
import { AppBar, createTheme, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { createContext, useContext } from 'react';

export default function TopAppBar({ open, setOpen, ColorModeContext }) {
	const theme = useTheme();

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const colorMode = useContext(ColorModeContext);

	return (
		<AppBar position='fixed' open={open}>
			<Toolbar>
				<IconButton
					color='inherit'
					aria-label='open drawer'
					onClick={handleDrawerOpen}
					edge='start'
					sx={{ mr: 2, ...(open && { display: 'none' }) }}>
					<GroupRounded />
				</IconButton>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'relative',
						marginLeft: open ? '340px' : '10px',
						transitionDuration: '0.2s',
					}}>
					Game Rooms
				</Typography>

				<IconButton
					sx={{ ml: 1, position: 'absolute', right: 10 }}
					onClick={colorMode.toggleColorMode}
					color='inherit'>
					{theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
				</IconButton>
			</Toolbar>
		</AppBar>
	);
}
