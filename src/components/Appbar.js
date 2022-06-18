import { Brightness4, Brightness7, GroupRounded, Menu } from '@mui/icons-material';
import { createTheme, IconButton, styled, Toolbar, Typography, useTheme } from '@mui/material';
import { createContext, useContext } from 'react';
import MuiAppBar from '@mui/material/AppBar';

export default function TopAppBar({ open, setOpen, ColorModeContext, drawerWidth }) {
	const theme = useTheme();

	const AppBar = styled(MuiAppBar, {
		shouldForwardProp: (prop) => prop !== 'open',
	})(({ theme, open }) => ({
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			width: `calc(100% - ${drawerWidth}px)`,

			marginLeft: `${drawerWidth}px`,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}));

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
						transitionDuration: '1s',
					}}>
					YACHU
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
