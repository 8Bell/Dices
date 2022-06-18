import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';

export default function Rooms() {
	const Item = styled(Paper)(({ theme }) => ({
		...theme.typography.body2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: 200,
		lineHeight: '60px',
	}));

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography
					sx={{
						ml: 1,
					}}>
					Gmae Rooms
				</Typography>
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
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((elevation) => (
						<Item
							key={elevation}
							elevation='6'
							onClick={() => Navigate('/game')}
							sx={{
								'&:hover': {
									filter: 'brightness(1.05)',
								},
								borderRadius: 5,
							}}>
							{`Room ${elevation}`}
						</Item>
					))}
				</Box>
			</Grid>
		</Grid>
	);
}
