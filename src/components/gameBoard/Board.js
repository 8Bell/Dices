/* eslint-disable array-callback-return */
import { BugReportRounded, CasinoRounded, ClearRounded, HelpRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

import dl from '../../static/img/dl.gif';
import d0 from '../../static/img/d0.png';
import d1 from '../../static/img/d1.png';
import d2 from '../../static/img/d2.png';
import d3 from '../../static/img/d3.png';
import d4 from '../../static/img/d4.png';
import d5 from '../../static/img/d5.png';
import d6 from '../../static/img/d6.png';
import ll from '../../static/img/ll.gif';
import l0 from '../../static/img/l0.png';
import l1 from '../../static/img/l1.png';
import l2 from '../../static/img/l2.png';
import l3 from '../../static/img/l3.png';
import l4 from '../../static/img/l4.png';
import l5 from '../../static/img/l5.png';
import l6 from '../../static/img/l6.png';
import ResetConfirm from '../modal/ResetConfilm';
import effectSound from '../../hooks/effectSound';

import HoldSound from '../../static/sounds/hold.mp3';
import PutSound from '../../static/sounds/put.mp3';
import ShakeSound from '../../static/sounds/shake.mp3';
import BigButton from '../../static/sounds/bigButton.mp3';
import SmallButton from '../../static/sounds/smallButton.mp3';
import RefreshConfirm from '../modal/RefreshConfirm';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import MyDices from './MyDices';

export default function Board({
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
	isFin,
	setIsFin,
	total,
	isStart,
	setIsStart,
	setSnackBarOpen,
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
	yacht,
	Eng,
	me,
	myUid,
	opponentUid,
	opponent,
}) {
	const theme = useTheme();

	// const bestScore = isLoggedIn
	// 	? me[0] && me[0].bestScore
	// 	: localStorage.getItem('BestScore')
	// 	? JSON.parse(localStorage.getItem('BestScore'))
	// 	: 0;

	//-----------EFFECT SOUNDS-------------//

	const holdSound = effectSound(HoldSound, 1.0);

	const putSound = effectSound(PutSound, 0.1);
	const shakeSound = effectSound(ShakeSound, 0.4);
	const smallButton = effectSound(SmallButton, 1);
	const bigButton = effectSound(BigButton, 1);
	const smallFlatSound = effectSound(SmallFlatSound, 0.5);

	//--------------Regame--------------//

	const diceArr = [0, 0, 0, 0, 0];

	const handleReGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFin(false);
		setIsStart(true);
		setSnackBarOpen(false);

		setTimeout(() => {
			window.location.reload();
		}, [100]);
	};

	//----------New Game----------//

	const [resetModalOpen, setResetModalOpen] = useState(false);

	//----------Refresh Game----------//

	const [refreshModalOpen, setRefreshModalOpen] = useState(false);

	//----------HOLD----------//
	const handleHoldDice = (idx) => {
		// setStopGif(true);
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));

		setIsHold(newHold);
		isHold[idx] === false ? holdSound.play() : putSound.play();
	};

	//----------SHAKE----------//

	const handleChangeDice = async () => {
		if (dices.includes('l') === false) {
			const lodingDice = await dices.map((dice, idx) =>
				isHold[idx] === false ? 'l' : dice
			);
			const newDice = await dices.map((dice, idx) =>
				isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
			);

			shakeSound.play();
			setDices(lodingDice);

			setTimeout(() => {
				setDices(newDice);
			}, [2000]);

			setLeft(left - 1);
		}
	};

	const handleRechangeDice = async () => {
		if (dices.includes('l')) {
			const newDice = await dices.map((dice, idx) =>
				isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
			);

			shakeSound.play();
			setTimeout(() => {
				setDices(newDice);
			}, 1000);
		}
	};

	//--------IMG PRELOADER--------//

	const D = [d0, d1, d2, d3, d4, d5, d6, dl];
	const L = [l0, l1, l2, l3, l4, l5, l6, ll];

	const PreloadImg = () => {
		return (
			<>
				{theme.palette.mode === 'dark'
					? D.map((img, idx) => {
							<img src={img} alt={idx} style={{ height: 0 }} />;
					  })
					: L.map((img, idx) => {
							<img src={img} alt={idx} style={{ height: 0 }} />;
					  })}
			</>
		);
	};

	// --------------ROUND ------------------//
	const round = isFilled.reduce((round, filled) => round + (true === filled), 0);

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
		yacht,
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
				scoreArr[13] > 0 && !isFilled[13] && setAlert('Yacht');
			}
		});
		isFin && setAlert('TOTAL ' + total);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFilled]);

	//-------BUTTON DOTS ----------//

	const DotOn = () => {
		return (
			<Box
				fontSize='small'
				sx={{
					color: theme.palette.text.secondary,
					borderRadius: 10,
					background:
						theme.palette.mode === 'dark'
							? 'linear-gradient(145deg, #ddd, #222)'
							: 'linear-gradient(145deg, #555, #222)',

					height: 20,
					width: 20,
					p: -1,
					m: 0.5,
					boxShadow:
						theme.palette.mode === 'dark'
							? ' 5px 5px 10px #0a0a0a, -5px -5px 10px #282828'
							: ' 5px 5px 10px #969696, -5px -5px 10px #ffffff',
				}}
			/>
		);
	};

	const DotOff = () => {
		return (
			<Box
				fontSize='small'
				sx={{
					color: theme.palette.text.secondary,
					borderRadius: 10,
					background:
						theme.palette.mode === 'dark'
							? 'linear-gradient(145deg, #333, #222)'
							: 'linear-gradient(145deg, #999, #555)',
					height: 20,
					width: 20,
					p: -1,
					m: 0.5,
					boxShadow:
						theme.palette.mode === 'dark'
							? 'inset 5px 5px 16px #090909,inset -5px -5px 16px #252525'
							: ' inset 5px 5px 14px #adadad,	inset -5px -5px 14px #ffffff;',
				}}
			/>
		);
	};

	return (
		<Paper
			elevation={0}
			sx={{
				height: isMobile ? 'calc(100vh - 10px)' : 'calc(100vh - 50px)',
				maxHeight: isMobile || isTablet ? 'none' : '930px',

				width: '100%',
				maxWidth: 1000,
				p: isMobile ? -0 : 2,
				mt: -8,
				overflowX: 'hidden',
				position: 'relative',
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
					p: isMobile ? 1 : 2,
					borderRadius: isMobile ? 4 : 7,
					//bgcolor: theme.palette.text.secondary,
					//height: isMobile ? '11%' : isTablet ? '19%' : '25%',
					mt: isMobile ? '50%' : '20%',
					boxShadow:
						theme.palette.mode === 'dark'
							? 'inset 14px 14px 27px #0e0e0e, inset -14px -14px 27px #242424'
							: '	inset 9px 9px 17px #b6b6b6, inset -9px -9px 17px #ffffff',
				}}>
				<Typography
					sx={{
						opacity: 0.5,
						position: 'absolute',
						top: 0,
						mt: -5.5,
						pt: 0.5,
						pb: 0.5,
						pl: 2,
						pr: 2,
						borderRadius: 10,
						boxShadow:
							alert !== ''
								? theme.palette.mode === 'dark'
									? '17px 17px 23px #0b0b0b,-17px -17px 23px #272727'
									: '9px 9px 18px #c8c8c9,-9px -9px 18px #fefeff;'
								: 'none',
					}}>
					{alert}
				</Typography>
				<PreloadImg />
				<MyDices
					dices={dices}
					left={left}
					handleHoldDice={handleHoldDice}
					isHold={isHold}
					isTablet={isTablet}
					isMobile={isMobile}
					D={D}
					dl={dl}
					L={L}
					ll={ll}
				/>
			</Stack>
			<Stack direction='column' justifyContent='center' alignItems='center'>
				<Button
					//className={left !== 0 && !isFin ? 'bg' : 'none'}

					variant={isFin ? 'text' : left === 0 ? 'text' : 'outlined'}
					color='inherit'
					onClick={
						left !== 0 && !isFin
							? dices.includes('l')
								? () => {
										handleRechangeDice();
										bigButton.play();
								  }
								: () => {
										handleChangeDice();
										bigButton.play();
								  }
							: isFin
							? () => {
									handleReGame();
									bigButton.play();
							  }
							: () => bigButton.play()
					}
					sx={{
						'&:active': {
							boxShadow:
								theme.palette.mode === 'dark'
									? ' inset 25px 25px 50px #090909,	inset -25px -25px 50px #252525'
									: 'inset 25px 25px 50px #bcbcbd, inset -25px -25px 50px #ffffff',
						},
						height: 150,
						width: 150,
						mt: 10,
						fontSize: 20,
						borderRadius: 30,
						border: 'none',
						position: 'relative',
						background:
							theme.palette.mode === 'dark'
								? 'linear-gradient(145deg, #202020, #111)'
								: 'linear-gradient(145deg, #efefef, #d7d7d7)',
						boxShadow:
							theme.palette.mode === 'dark'
								? '25px 25px 50px #090909,	-25px -25px 50px #252525'
								: '25px 25px 50px #bcbcbd,-25px -25px 50px #ffffff',
					}}>
					{isFin
						? 'regame'
						: isStart && left === 3
						? 'START'
						: left === 3
						? [<DotOn />, <DotOn />, <DotOn />]
						: left === 2
						? [<DotOn />, <DotOn />, <DotOff />]
						: left === 1
						? [<DotOn />, <DotOff />, <DotOff />]
						: [<DotOff />, <DotOff />, <DotOff />]}
				</Button>

				<Typography
					sx={{
						position: 'fixed',
						top: isMobile ? 12 : 16,
						fontSize: 18,
						zIndex: 1199,
						color: theme.palette.text.secondary,
						fontWeight: 'bold',
						transform: 'translateX(5px)',
					}}>
					<CasinoRounded
						sx={{ transform: 'translate(-6px,5.5px)', fontSize: 23 }}
					/>
					{[12 - round]}
				</Typography>
				<IconButton
					color='inherit'
					onClick={() => {
						if (!isFin) {
							smallButton.play();
							setResetModalOpen(true);
						}
					}}
					sx={{
						'&:active': {
							boxShadow: isFin
								? 'none'
								: theme.palette.mode === 'dark'
								? 'inset 17px 17px 23px #0b0b0b, inset -17px -17px 23px #272727'
								: 'inset 9px 9px 18px #c8c8c9, inset -9px -9px 18px #fefeff;',
						},

						position: 'absolute',
						bottom: 20,
						boxShadow: isFin
							? 'none'
							: theme.palette.mode === 'dark'
							? '17px 17px 23px #0b0b0b,-17px -17px 23px #272727'
							: '9px 9px 18px #c8c8c9,-9px -9px 18px #fefeff;',
					}}>
					{!isFin && <ClearRounded />}
				</IconButton>
				<IconButton
					color='inherit'
					onClick={() => {
						smallFlatSound.play();
						setRefreshModalOpen(true);
					}}
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 15,
						color: theme.palette.action.disabled,
					}}>
					<BugReportRounded />
				</IconButton>
				<IconButton
					color='inherit'
					href={
						Eng
							? 'https://en.wikipedia.org/wiki/Yacht_(dice_game)'
							: 'https://namu.wiki/w/%EC%9A%94%ED%8A%B8(%EA%B2%8C%EC%9E%84)'
					}
					target='_blank'
					onClick={() => {
						smallFlatSound.play();
					}}
					sx={{
						position: 'absolute',
						bottom: 0,
						right: 15,
						color: theme.palette.action.disabled,
					}}>
					<HelpRounded />
				</IconButton>
			</Stack>
			<ResetConfirm
				resetModalOpen={resetModalOpen}
				setResetModalOpen={setResetModalOpen}
				setDices={setDices}
				setIsHold={setIsHold}
				setIsFilled={setIsFilled}
				setLeft={setLeft}
				setIsFin={setIsFin}
				setIsStart={setIsStart}
				Eng={Eng}
				me={me}
				myUid={myUid}
				total={total}
				opponentUid={opponentUid}
				opponent={opponent}
			/>
			<RefreshConfirm
				refreshModalOpen={refreshModalOpen}
				setRefreshModalOpen={setRefreshModalOpen}
				Eng={Eng}
			/>
		</Paper>
	);
}
