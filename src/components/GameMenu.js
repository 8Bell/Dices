import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';

export default function GameMenu({ isLoggedIn, isMobile, isTablet }) {
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
			<Grid item xs={12} sx={{ display: 'grid', placeItems: 'center' }}>
				{/* <Typography
					align='center'
					sx={{
						ml: 1,
						mb: 1,
						mt: 10,
					}}>
					Yacht Dice
				</Typography> */}
				<Box
					sx={{
						height: 200,

						p: 1,
						width: '100%',
						maxWidth: 'sm',
						bgcolor: 'background.default',
						display: 'grid',

						gridTemplateColumns: {
							sm: '1fr',
							md: '1fr',
							lg: '1fr',
							xl: '1fr',
						},
						gap: 4,
						lineHeight: 0,
					}}>
					{['NOMAL', 'RANK'].map((game, idx) => (
						<Item
							key={idx}
							elevation='0'
							onClick={() => navigate('/game')}
							sx={{
								'&:hover': {
									filter:
										theme.palette.mode === 'dark'
											? 'brightness(1.1)'
											: 'brightness(0.95)',
								},
								fontSize: 20,

								borderRadius: 30,
								//	border: '2px solid',
								borderColor: theme.palette.divider,
								boxShadow:
									theme.palette.mode === 'dark'
										? ' 14px 14px 28px #090909,-14px -14px 28px #191919;'
										: '14px 14px 28px #c8c8c9,-14px -14px 28px #fefeff',
							}}>
							{game}
						</Item>
					))}
				</Box>
			</Grid>
		</Grid>
	);
}
