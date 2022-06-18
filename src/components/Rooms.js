import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export default function Rooms() {
	const Item = styled(Paper)(({ theme }) => ({
		...theme.typography.body2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: 60,
		lineHeight: '60px',
	}));

	const darkTheme = createTheme({ palette: { mode: 'dark' } });
	const lightTheme = createTheme({ palette: { mode: 'light' } });

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Box
					sx={{
						p: 1,
						bgcolor: 'background.default',
						display: 'grid',
						gridTemplateColumns: {
							sm: '1fr',
							md: '1fr 1fr',
							lg: '1fr 1fr 1fr',
							xl: ' 1fr 1fr 1fr 1fr',
						},
						gap: 3,
					}}>
					{[12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12].map((elevation) => (
						<Item key={elevation} elevation={elevation}>
							{`elevation=${elevation}`}
						</Item>
					))}
				</Box>
			</Grid>
		</Grid>
	);
}
