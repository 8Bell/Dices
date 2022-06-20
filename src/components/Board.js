import { Button, Paper, Stack, styled } from '@mui/material';
import { useTheme } from '@mui/system';
import React from 'react';
export default function Board({ isTablet, dices, setDices, isHold, setIsHold, setIsFilled }) {
	const theme = useTheme();

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.background,
		border: 'solid 1px',
		borderColor: theme.palette.divider,
		borderRadius: '10%',
		boxShadow: 'none',
		width: '20%',
		paddingTop: 'calc(9% - 13px)',
		paddingBottom: 'calc(9% - 12px)',
		textAlign: 'center',
		color: theme.palette.text,
	}));

	const diceArr = [
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
	];

	//----------New Game----------//

	const handleNewGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(13).fill(false));
	};

	//----------SHAKE----------//
	const handleChangeDice = () => {
		const newDice = dices.map((dice, idx) =>
			isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
		);
		setDices(newDice);
	};

	//----------HOLD----------//
	const handleHoldDice = (idx) => {
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));
		setIsHold(newHold);
	};

	return (
		<Paper
			elevation={0}
			sx={{
				height: '90vh',
				width: '100%',
			}}>
			<Stack
				direction='row'
				spacing={isTablet ? 1 : 2}
				justifyContent='center'
				alignItems='center'
				sx={{
					border: '1px solid',
					borderColor: theme.palette.divider,
					p: isTablet ? 1 : 2,
					borderRadius: isTablet ? 3 : 5,
				}}>
				{dices.map((dice, idx) => (
					<Item
						onClick={() => handleHoldDice(idx)}
						key={idx}
						value={dice}
						sx={{
							bgcolor: isHold[idx] ? 'orange' : 'default',
						}}>
						{dice}
					</Item>
				))}
			</Stack>
			<Stack direction='column' justifyContent='center' alignItems='center'>
				<Button
					variant='outlined'
					color='inherit'
					onClick={handleChangeDice}
					sx={{ height: 40, width: 300, mt: 3 }}>
					Shake
				</Button>
				<Button
					variant='outlined'
					color='inherit'
					onClick={handleNewGame}
					sx={{ height: 40, width: 300, mt: 3 }}>
					New Game
				</Button>
			</Stack>
		</Paper>
	);
}
