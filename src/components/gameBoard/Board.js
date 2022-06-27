/* eslint-disable array-callback-return */
import { AttachFileRounded, ClearRounded } from '@mui/icons-material';
import { Button, IconButton, Paper, Stack, styled, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

import dl from '../../img/dl.gif';
import d0 from '../../img/d0.png';
import d1 from '../../img/d1.png';
import d2 from '../../img/d2.png';
import d3 from '../../img/d3.png';
import d4 from '../../img/d4.png';
import d5 from '../../img/d5.png';
import d6 from '../../img/d6.png';
import ll from '../../img/ll.gif';
import l0 from '../../img/l0.png';
import l1 from '../../img/l1.png';
import l2 from '../../img/l2.png';
import l3 from '../../img/l3.png';
import l4 from '../../img/l4.png';
import l5 from '../../img/l5.png';
import l6 from '../../img/l6.png';
import Confirm from '../modal/Confilm';
import effectSound from '../../hooks/effectSound';

import HoldSound from '../../sounds/hold.mp3';
import PutSound from '../../sounds/put.mp3';
import ShakeSound from '../../sounds/shake.mp3';

export default function Board({
	isLoggedIn,
	me,
	isMobile,
	isTablet,
	dices,
	setDices,
	isHold,
	setIsHold,
	isFilled,
	setIsFilled,
	left,
	setLeft,
	isFine,
	setIsFine,
	total,
	isStart,
	setIsStart,
	ace,
	duce,
	threes,
	fours,
	fives,
	sixes,
	subTotal,
	bonus,
	choice,
	fourOfKind,
	fullHouse,
	sStraght,
	lStraght,
	yachu,
}) {
	const theme = useTheme();
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

	const bestScore = isLoggedIn
		? me[0] && me[0].bestScore
		: localStorage.getItem('BestScore')
		? JSON.parse(localStorage.getItem('BestScore'))
		: 0;

	//-----------EFFECT SOUNDS-------------//

	const holdSound = effectSound(HoldSound, 0.5);
	const putSound = effectSound(PutSound, 0.5);
	const shakeSound = effectSound(ShakeSound, 0.5);

	//--------------Regame--------------//

	const diceArr = [0, 0, 0, 0, 0];

	const handleReGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFine(false);
		setIsStart(true);
	};

	//----------New Game----------//

	const [modalOpen, setModalOpen] = useState(false);

	//----------HOLD----------//
	const handleHoldDice = (idx) => {
		// setStopGif(true);
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));

		setIsHold(newHold);
		isHold[idx] === false ? holdSound.play() : putSound.play();
	};

	//----------SHAKE----------//

	const handleChangeDice = async () => {
		const lodingDice = await dices.map((dice, idx) => (isHold[idx] === false ? 'l' : dice));
		const newDice = await dices.map((dice, idx) =>
			isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
		);
		shakeSound.play();
		setDices(lodingDice);
		setTimeout(() => {
			setDices(newDice);
		}, [2000]);

		setLeft(left - 1);
	};
	//--------IMG PRELOADER--------//

	const D = [d0, d1, d2, d3, d4, d5, d6, dl];
	const L = [l0, l1, l2, l3, l4, l5, l6, ll];

	const PreloadImg = () => {
		return (
			<>
				{theme.palette.mode === 'dark'
					? D.map((img, idx) => {
							<img src={img} alt={idx} style={{ display: 'none' }} />;
					  })
					: L.map((img, idx) => {
							<img src={img} alt={idx} style={{ display: 'none' }} />;
					  })}
			</>
		);
	};

	//----------BG SHINE & ALERT------------//

	const scoreArr = [
		ace,
		duce,
		threes,
		fours,
		fives,
		sixes,
		subTotal,
		bonus,
		choice,
		fourOfKind,
		fullHouse,
		sStraght,
		lStraght,
		yachu,
		total,
	];

	const [bgShine, setBgShine] = useState(false);
	const [alert, setAlert] = useState('');

	useEffect(() => {
		scoreArr.map((score, idx) => {
			if (0 <= idx && idx <= 5) {
				score > (idx + 1) * 4 && !isFilled[idx] && setBgShine(true);
			} else if (idx === 8) {
				scoreArr[idx] >= 27 && !isFilled[idx] && setBgShine(true);
				scoreArr[8] >= 27 && !isFilled[8] && setAlert('High Choice');
			} else if (9 <= idx && idx < 14) {
				scoreArr[idx] > 0 && !isFilled[idx] && setBgShine(true);
				scoreArr[9] > 0 && !isFilled[9] && setAlert('4 of a Kind');
				scoreArr[10] > 0 && !isFilled[10] && setAlert('Full House');
				scoreArr[11] > 0 && !isFilled[11] && setAlert('Small Straght');
				scoreArr[12] > 0 && !isFilled[12] && setAlert('Large Straght');
				scoreArr[13] > 0 && !isFilled[13] && setAlert('YACHU');
			}
		});
		isFine && setAlert('TOTAL ' + total);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFilled]);

	return (
		<Paper
			elevation={0}
			sx={{
				height: '90vh',
				width: '100%',
				maxWidth: 1000,
				p: isMobile ? 0 : 2,
			}}>
			<Stack
				className={bgShine ? 'bg' : 'none'}
				direction='row'
				spacing={isMobile ? 1 : isTablet ? 1.5 : 2}
				justifyContent='center'
				alignItems='center'
				sx={{
					//border: '1px solid',
					position: 'relative',
					borderColor: theme.palette.divider,
					p: isMobile ? 1.3 : 2,
					borderRadius: 5,
					//bgcolor: theme.palette.text.secondary,
					minheight: '20%',
					mt: isMobile ? '50%' : '20%',
					boxShadow:
						theme.palette.mode === 'dark'
							? 'inset 7px 7px 10px #0c0c0c, inset -7px -7px 10px #161616'
							: '	inset 9px 9px 17px #b6b6b6, inset -9px -9px 17px #ffffff;;',
				}}>
				<Typography
					//className={alert !== '' ? 'bg' : 'none'}
					sx={{
						opacity: 0.5,
						position: 'absolute',
						top: 0,
						mt: -10,

						pt: 0.5,
						pb: 0.5,
						pl: 2,
						pr: 2,
						borderRadius: 10,
						boxShadow:
							alert !== ''
								? theme.palette.mode === 'dark'
									? ' 9px 9px 18px #0a0a0a,-9px -9px 18px #181818'
									: '9px 9px 18px #c8c8c9,-9px -9px 18px #fefeff;'
								: 'none',
					}}>
					{alert}
				</Typography>
				<PreloadImg />
				{dices.map((dice, idx) => (
					<Item
						className={isHold[idx] ? 'holdDice' : 'dice'}
						onClick={() => left !== 3 && handleHoldDice(idx)}
						key={idx}
						value={dice}
						sx={{
							position: 'relative',
							bgcolor: 'rgba(0, 0, 0, 0)',
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
											? 'translate(-50%, -50%)'
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
						<img src={dl} alt='preload' style={{ display: 'none' }} />
						<img
							src={
								theme.palette.mode === 'dark'
									? dice === 'l'
										? dl
										: D[dice]
									: dice === 'l'
									? ll
									: L[dice]
							}
							alt={dice}
							style={{
								width: '145%',
								marginBottom: isMobile
									? '-58%'
									: isTablet
									? '-51%'
									: '-50%',
								transform: 'translate(-18.3%,-16%)',

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
				<Button
					//className={left !== 0 && !isFine ? 'bg' : 'none'}

					variant={isFine ? 'text' : left === 0 ? 'text' : 'outlined'}
					color='inherit'
					onClick={left !== 0 && !isFine ? handleChangeDice : handleReGame}
					sx={{
						height: 150,
						width: 150,
						mt: 10,
						fontSize: 20,
						borderRadius: 30,
						border: 'none',
						position: 'relative',
						boxShadow:
							theme.palette.mode === 'dark'
								? ' 23px 23px 45px #0a0a0a,-23px -23px 45px #181818'
								: '31px 31px 62px #bcbcbd,-31px -31px 62px #ffffff',
					}}>
					{isFine
						? 'regame'
						: isStart && left === 3
						? 'START'
						: [left, <br />, ' Left']}
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
					onClick={() => setModalOpen(true)}
					sx={{
						position: 'absolute',
						bottom: 40,
						boxShadow:
							theme.palette.mode === 'dark'
								? ' 9px 9px 18px #0a0a0a,-9px -9px 18px #181818'
								: '9px 9px 18px #c8c8c9,-9px -9px 18px #fefeff;',
					}}>
					<ClearRounded />
				</IconButton>
			</Stack>
			<Confirm
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				setDices={setDices}
				setIsHold={setIsHold}
				setIsFilled={setIsFilled}
				setLeft={setLeft}
				setIsFine={setIsFine}
				setIsStart={setIsStart}
			/>
		</Paper>
	);
}
