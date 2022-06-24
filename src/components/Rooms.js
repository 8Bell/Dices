import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';

export default function Rooms() {
	const theme = useTheme();
	const navigate = useNavigate();
	const Item = styled(Paper)(({ theme }) => ({
		...theme.typography.body2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		height: 100,
		lineHeight: '98px',
	}));

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography
					sx={{
						ml: 1,
						mb: 2,
					}}>
					Games
				</Typography>
				<Box
					sx={{
						height: 100,
						p: 0,

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
					{['Yachu'].map((game) => (
						<Item
							key={game}
							elevation='0'
							onClick={() => navigate('/game')}
							sx={{
								'&:hover': {
									filter:
										theme.palette.mode === 'dark'
											? 'brightness(1.1)'
											: 'brightness(0.95)',
								},

								borderRadius: 5,
								//	border: '2px solid',
								borderColor: theme.palette.divider,
								boxShadow:
									theme.palette.mode === 'dark'
										? ' 14px 14px 28px #090909,-14px -14px 28px #191919;'
										: '14px 14px 28px #a3a3a4,-14px -14px 28px #ffffff',
							}}>
							{game}
						</Item>
					))}
				</Box>
			</Grid>
		</Grid>
	);
}
