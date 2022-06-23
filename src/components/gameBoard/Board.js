/* eslint-disable react-hooks/exhaustive-deps */
import { AttachFileRounded, ExitToAppRounded, ReplayRounded } from '@mui/icons-material';
import { Button, IconButton, Paper, Stack, styled, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import React from 'react';
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
			// navigate('/game');
			window.location.reload();
		}, 200);
	};

	//----------HOLD----------//
	const handleHoldDice = (idx) => {
		// setStopGif(true);
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));
		setIsHold(newHold);
	};

	//----------SHAKE----------//

	const handleChangeDice = async () => {
		const lodingDice = await dices.map((dice, idx) => (isHold[idx] === false ? 'l' : dice));
		const newDice = await dices.map((dice, idx) =>
			isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
		);

		setDices(lodingDice);
		setTimeout(() => {
			setDices(newDice);
		}, [2000]);

		setLeft(left - 1);
	};

	return (
		<Paper
			elevation={0}
			sx={{
				height: '90vh',
				width: '100%',
				maxWidth: 1000,
			}}>
			<Stack
				direction='row'
				spacing={isMobile ? 1 : isTablet ? 1.5 : 2}
				justifyContent='center'
				alignItems='center'
				sx={{
					//border: '1px solid',
					borderColor: theme.palette.divider,
					p: isMobile ? 1.3 : 2,
					borderRadius: 5,
					//bgcolor: theme.palette.text.secondary,
					minheight: '20%',
					mt: isMobile ? '50%' : '20%',
					boxShadow:
						theme.palette.mode === 'dark'
							? ' inset 30px 30px 60px #080808,inset -30px -30px 60px #1a1a1a'
							: '	inset 12px 12px 18px #c3c3c4,inset -12px -12px 18px #ffffff',
				}}>
				{dices.map((dice, idx) => (
					<Item
						className={isHold[idx] ? 'holdDice' : 'dice'}
						onClick={() => left !== 3 && handleHoldDice(idx)}
						key={idx}
						value={dice}
						sx={{
							position: 'relative',
							//	bgcolor: theme.palette.text.secondary,
							backgroundImage: 'none',
							minHeight: '30%',
						}}>
						{isHold[idx] && (
							<AttachFileRounded
								sx={{
									position: 'absolute',
									zIndex: 1000,
									top: '-10%',
									left: '50%',
									transform:
										isTablet || isMobile
											? 'translate(-51%, -50%)'
											: 'translate(-55%, -50%)',
									fontSize: isMobile
										? '230%'
										: isTablet
										? '400%'
										: '450%',
									color: theme.palette.text.primary,
									opacity: 0.8,
									rotate: '-15deg',
									//filter: 'dropShadow(30px 30px 3px #111)',
								}}
							/>
						)}
						<img
							key={Date.now()}
							src={
								theme.palette.mode === 'dark'
									? dice === 'l'
										? `./images/dl.gif`
										: `./images/d${dice}.png`
									: dice === 'l'
									? `./images/ll.gif`
									: `./images/l${dice}.png`
							}
							alt={dice}
							style={{
								width: '145%',
								marginBottom: isMobile
									? '-58%'
									: isTablet
									? '-51%'
									: '-50%',
								transform: 'translate(-15.5%,-16%)',

								// filter: isHold[idx] ? 'invert(100%)' : 'none',
								filter: isHold[idx]
									? 'dropShadow(10px 4px 5px blue)'
									: 'none',
							}}
						/>
					</Item>
				))}
			</Stack>
			<Stack direction='column' justifyContent='center' alignItems='center'>
				{/* <Typography
					align='center'
					sx={{
						fontSize: 20,
						mt: 3,
						backdropFilter: isFine
							? 'none'
							: theme.palette.mode === 'dark'
							? 'brightness(2)'
							: 'brightness(0.95)',
						pt: 4.3,

						width: 100,
						height: 100,
						borderRadius: 30,
					}}>
					{!isFine && left + ' Left'}
				</Typography> */}
				<Button
					//className={left !== 0 && !isFine ? 'bg' : 'none'}
					variant={isFine ? 'text' : left === 0 ? 'text' : 'outlined'}
					color='inherit'
					onClick={left !== 0 && !isFine && handleChangeDice}
					sx={{
						height: 150,
						width: 150,
						mt: 10,
						fontSize: 20,
						borderRadius: 30,
						border: 'none',
						boxShadow:
							theme.palette.mode === 'dark'
								? ' 23px 23px 45px #0a0a0a,-23px -23px 45px #181818'
								: '31px 31px 62px #bcbcbd,-31px -31px 62px #ffffff',
					}}>
					{isFine ? [total, <br />, ' Point'] : [left, <br />, ' Left']}
				</Button>

				<Typography
					sx={{
						position: 'fixed',
						top: isMobile ? 18 : 22,
						fontSize: 15,
						zIndex: 1199,
						color: theme.palette.action.disabled,
					}}>
					Best Score : {bestScore}
				</Typography>
				<IconButton
					variant={isFine ? 'contained' : 'outlined'}
					color='inherit'
					onClick={isFine ? handleNewGame : handleQuitGame}
					sx={{ position: 'absolute', bottom: 40 }}>
					{isFine ? <ReplayRounded /> : <ExitToAppRounded />}
				</IconButton>
			</Stack>
		</Paper>
	);
}
