/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper, Stack, styled, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useTheme } from '@mui/system';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Board({
	isMobile,
	isTablet,
	dices,
	setDices,
	isHold,
	setIsHold,
	setIsFilled,
	left,
	setLeft,
	isFine,
	total,
}) {
	const theme = useTheme();
	const navigate = useNavigate();

	const Item = styled(Paper)(({ theme }) => ({
		//	backgroundColor: theme.palette.background,
		// border: 'solid 1px',
		borderColor: theme.palette.divider,
		borderRadius: '10%',
		boxShadow: 'none',
		width: '20%',
		textAlign: 'center',
		color: theme.palette.text,
	}));

	const bestScore = localStorage.getItem('BestScore')
		? JSON.parse(localStorage.getItem('BestScore'))
		: 0;

	const diceArr = [0, 0, 0, 0, 0];

	//----------Quit Game----------//

	const handleQuitGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setTimeout(() => {
			navigate('/');
		}, 200);
	};

	//----------New Game----------//

	const handleNewGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);

		setTimeout(() => {
			navigate('/game');
		}, 200);
	};

	//----------HOLD----------//
	const handleHoldDice = (idx) => {
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));
		setIsHold(newHold);
	};

	//----------SHAKE----------//
	const handleChangeDice = () => {
		const newDice = dices.map((dice, idx) =>
			isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
		);
		setDices(newDice);
		setLeft(left - 1);
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
					bgcolor: theme.palette.text.secondary,
				}}>
				{dices.map((dice, idx) => (
					<Item
						onClick={() => left !== 3 && handleHoldDice(idx)}
						key={idx}
						value={dice}
						sx={{
							// bgcolor: isHold[idx]
							// 	? theme.palette.mode === 'dark'
							// 		? blueGrey[900]
							// 		: blueGrey[100]
							// 	: 'default',
							bgcolor: theme.palette.text.secondary,
							backgroundImage: 'none',
							height: 'auto',
						}}>
						<img
							src={
								theme.palette.mode === 'dark'
									? !isHold[idx]
										? `./images/dl${idx}.gif`
										: `./images/d${dice}.png`
									: !isHold[idx]
									? `./images/ll.gif`
									: `./images/l${dice}.png`
							}
							alt={dice}
							style={{
								width: !isHold[idx] ? '145%' : '100%',
								marginBottom: !isHold[idx]
									? isMobile
										? '-55%'
										: '-50%'
									: isMobile
									? '-10%'
									: '-5%',
								transform: !isHold[idx]
									? 'translate(-15%, -15%)'
									: 'none',
								// boxShadow: `0 0 10px rgba(1,1,1,0.1)`,
							}}
						/>
					</Item>
				))}
			</Stack>
			<Stack direction='column' justifyContent='center' alignItems='center'>
				<Typography sx={{ fontSize: 20, mt: 3 }}>
					{!isFine && left + 'Left'}
				</Typography>
				<Button
					variant={isFine ? 'text' : left === 0 ? 'text' : 'outlined'}
					color={isFine ? 'info' : 'inherit'}
					onClick={left !== 0 && handleChangeDice}
					sx={{ height: 40, width: 300, mt: 3 }}>
					{isFine
						? `Your score : ${total}`
						: left === 0
						? '0 Shake Left'
						: 'Shake'}
				</Button>
				<Button
					variant={isFine ? 'contained' : 'outlined'}
					color={isFine ? 'info' : 'inherit'}
					onClick={isFine ? handleNewGame : handleQuitGame}
					sx={{ height: 40, width: 300, mt: 3 }}>
					{isFine ? 'New Game' : 'Quit Game'}
				</Button>
				<Typography
					sx={{
						position: 'fixed',
						top: isMobile ? 17 : 22,
						fontSize: 15,
						zIndex: 1199,
						color: theme.palette.action.active,
					}}>
					Best Score : {bestScore}
				</Typography>
			</Stack>
		</Paper>
	);
}
