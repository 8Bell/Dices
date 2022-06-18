import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export default function Rooms() {
	const Item = styled(Paper)(({ theme }) => ({
		...theme.typography.body2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: 200,
		lineHeight: '60px',
	}));

	const darkTheme = createTheme({ palette: { mode: 'dark' } });
	const lightTheme = createTheme({ palette: { mode: 'light' } });

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography>Gmae Rooms</Typography>
				<Box
					sx={{
						height: 300,
						p: 1,
						bgcolor: 'background.default',
						display: 'grid',
						gridTemplateColumns: {
							sm: '1fr',
							md: '1fr 1fr',
							lg: '1fr 1fr 1fr',
							xl: ' 1fr 1fr 1fr 1fr',
						},
						gap: 2,
					}}>
					{[12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12].map((elevation) => (
						<Item
							key={elevation}
							elevation={elevation}
							sx={{
								'&:hover': {
									filter: 'brightness(1.1)',
								},
								borderRadius: 5,
							}}>
							{`elevation=${elevation}`}
						</Item>
					))}
				</Box>
			</Grid>
		</Grid>
	);
}
