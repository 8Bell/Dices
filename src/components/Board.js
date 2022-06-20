/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { Button, Paper, Stack, styled, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import React, { useEffect, useState } from 'react';

export default function Board({ isTablet }) {
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

	//----------New Game----------//

	const handleNewGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(12).fill(false));
	};

	//----------DICES------------//

	const diceArr = [
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
	];
	const savedDiceArr = sessionStorage.getItem('dices')
		? JSON.parse(sessionStorage.getItem('dices'))
		: diceArr;

	const [dices, setDices] = useState(savedDiceArr);

	const savedHoldArr = sessionStorage.getItem('isHold')
		? JSON.parse(sessionStorage.getItem('isHold'))
		: new Array(5).fill(false);

	const [isHold, setIsHold] = useState(savedHoldArr);

	useEffect(() => {
		sessionStorage.setItem('dices', JSON.stringify(dices));
	}, [dices]);

	useEffect(() => {
		sessionStorage.setItem('isHold', JSON.stringify(isHold));
	}, [isHold]);

	const handleChangeDice = () => {
		const newDice = dices.map((dice, idx) =>
			isHold[idx] === false ? Math.floor(Math.random() * 6) + 1 : dice
		);
		setDices(newDice);
	};
	const handleHoldDice = (idx) => {
		const newHold = isHold.map((hold, index) => (index === idx ? !hold : hold));
		setIsHold(newHold);
	};

	//----------Fill-------------//
	const savedFilledArr = sessionStorage.getItem('isFilled')
		? JSON.parse(sessionStorage.getItem('isFilled'))
		: new Array(12).fill(false);

	const [isFilled, setIsFilled] = useState(savedFilledArr);

	useEffect(() => {
		sessionStorage.setItem('isFilled', JSON.stringify(isFilled));
	}, [isFilled]);

	const handleFill = (idx) => {
		sessionStorage.removeItem('dices', 'isHold');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		const newFilled = isFilled.map((filled, index) => (idx === index ? !filled : filled));
		setIsFilled(newFilled);
	};

	//----------Rules------------//

	const [ace, setAce] = useState(0); //isFilled 0
	const [duce, setDuce] = useState(0); //isFilled 1
	const [threes, setThrees] = useState(0); //isFilled 2
	const [fours, setFours] = useState(0); //isFilled 3
	const [fives, setFives] = useState(0); //isFilled 4
	const [sixes, setSixes] = useState(0); //isFilled 5
	const [subtotal, setSubtotal] = useState(ace + duce + fours + fives + sixes);
	const [bonus, setBonus] = useState(0);
	const [choice, setChoice] = useState(0); //isFilled 6
	const [fourOfKind, setFourOfKind] = useState(0); //isFilled 7
	const [fullHouse, setFullHouse] = useState(0); //isFilled 8
	const [sStraght, setSStraght] = useState(0); //isFilled 9
	const [lStraght, setLStraght] = useState(0); //isFilled 10
	const [yachu, setYachu] = useState(0); //isFilled 11
	const [total, setTotal] = useState(0);

	//ACE //isFilled 0
	useEffect(() => {
		let i = 0;
		!isFilled[0] && dices.map((dice) => dice === 1 && ++i);
		!isFilled[0] && setAce(i * 1);
	}, [dices, isFilled]);

	//DUCES //isFilled 1
	useEffect(() => {
		let i = 0;
		!isFilled[1] && dices.map((dice) => dice === 2 && ++i);
		!isFilled[1] && setDuce(i * 2);
	}, [dices, isFilled]);

	//THREES //isFilled 2
	useEffect(() => {
		let i = 0;
		!isFilled[2] && dices.map((dice) => dice === 3 && ++i);
		!isFilled[2] && setThrees(i * 3);
	}, [dices, isFilled]);

	//FOURS //isFilled 3
	useEffect(() => {
		let i = 0;
		!isFilled[3] && dices.map((dice) => dice === 4 && ++i);
		!isFilled[3] && setFours(i * 4);
	}, [dices, isFilled]);

	//FIVES //isFilled 4
	useEffect(() => {
		let i = 0;
		!isFilled[4] && dices.map((dice) => dice === 5 && ++i);
		!isFilled[4] && setFives(i * 5);
	}, [dices, isFilled]);

	//SIXES //isFilled 5
	useEffect(() => {
		let i = 0;
		!isFilled[5] && dices.map((dice) => dice === 6 && ++i);
		!isFilled[5] && setSixes(i * 6);
	}, [dices, isFilled]);

	//SUBTOTAL
	let sum = 0;
	const arr = [ace, duce, threes, fours, fives, sixes];
	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		isFilled.slice(0, 6).map((filled, idx) => filled && (sum = sum + arr[idx]));
		setSubtotal(sum);
	}, [isFilled]);

	//+35 BONUS
	useEffect(() => {
		subtotal >= 63 ? setBonus(35) : setBonus(0);
	}, [isFilled, subtotal]);

	//CHOICE //isFilled 6
	useEffect(() => {
		let sum = 0;
		!isFilled[6] && dices.map((dice) => (sum = sum + dice));
		!isFilled[6] && setChoice(sum);
	}, [dices, isFilled]);

	//4 OF KIND //isFilled 7

	useEffect(() => {
		if (!isFilled[7]) {
			let i = 0;
			let j = 0;
			[1, 2, 3, 4, 5, 6].map((num) => {
				dices.includes(num) && i++;
				dices.indexOf(num) !== dices.lastIndexOf(num) && j++;
			});
			i <= 2 && j !== 2
				? setFourOfKind(dices.reduce((dice, cv) => dice + cv))
				: setFourOfKind(0);
		}
	}, [dices, isFilled]);

	//FULL HOUSE //isFilled 8

	useEffect(() => {
		if (!isFilled[8]) {
			let i = 0;
			let j = 0;
			[1, 2, 3, 4, 5, 6].map((num) => {
				dices.includes(num) && i++;
				dices.indexOf(num) !== dices.lastIndexOf(num) && j++;
			});
			i === 1 || (i === 2 && j === 2)
				? setFullHouse(dices.reduce((dice, cv) => dice + cv))
				: setFullHouse(0);
		}
	}, [dices, isFilled]);

	//S. STRAGHT //isFilled 9
	useEffect(() => {
		if (!isFilled[9]) {
			let i = 0;
			let j = 0;

			[1, 2, 3, 4, 5, 6].map((num, idx) => {
				dices.includes(num) && i++;
				dices.includes(num) && (j = j + idx);
			});

			(i === 4 && (j === 6 || j === 10 || j === 14)) ||
			(i === 5 && (j === 10 || j === 11 || j === 14 || j === 15))
				? setSStraght(15)
				: setSStraght(0);
		}
	}, [dices, isFilled]);

	//L. STRAGHT //isFilled 10
	useEffect(() => {
		if (!isFilled[10]) {
			let i = 0;
			let j = 0;

			[1, 2, 3, 4, 5, 6].map((num, idx) => {
				dices.includes(num) && i++;
				dices.includes(num) && (j = j + idx);
			});
			i === 5 && (j === 10 || j === 15) ? setLStraght(30) : setLStraght(0);
		}
	}, [dices, isFilled]);

	//YACHU //isFilled 11
	useEffect(() => {
		if (!isFilled[11]) {
			dices[0] === dices[1] &&
			dices[1] === dices[2] &&
			dices[2] === dices[3] &&
			dices[3] === dices[4]
				? setYachu(50)
				: setYachu(0);
		}
	}, [dices, isFilled]);

	//TOTAL
	useEffect(() => {
		let sum = 0;
		const arr = [
			ace,
			duce,
			threes,
			fours,
			fives,
			sixes,
			choice,
			fourOfKind,
			fullHouse,
			sStraght,
			lStraght,
			yachu,
		];
		isFilled.map((filled, idx) => {
			filled && (sum = sum + arr[idx]);
		});
		setTotal(sum + bonus);
	}, [isFilled]);

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
					variant='contained'
					color='inherit'
					onClick={handleChangeDice}
					sx={{ height: 40, width: 100, mt: 5 }}>
					Shake
				</Button>
				<Button
					variant='contained'
					color='inherit'
					onClick={handleNewGame}
					sx={{ height: 40, width: 100, mt: 2, mb: 3 }}>
					New Game
				</Button>
				<Typography
					onClick={() => handleFill(0)}
					sx={{ color: isFilled[0] ? 'orange' : 'green', fontSize: 17 }}>
					ace : {ace}
				</Typography>
				<Typography
					onClick={() => handleFill(1)}
					sx={{ color: isFilled[1] ? 'orange' : 'green', fontSize: 17 }}>
					duce : {duce}
				</Typography>
				<Typography
					onClick={() => handleFill(2)}
					sx={{ color: isFilled[2] ? 'orange' : 'green', fontSize: 17 }}>
					threes : {threes}
				</Typography>
				<Typography
					onClick={() => handleFill(3)}
					sx={{ color: isFilled[3] ? 'orange' : 'green', fontSize: 17 }}>
					fours : {fours}
				</Typography>
				<Typography
					onClick={() => handleFill(4)}
					sx={{ color: isFilled[4] ? 'orange' : 'green', fontSize: 17 }}>
					fives : {fives}
				</Typography>
				<Typography
					onClick={() => handleFill(5)}
					sx={{ color: isFilled[5] ? 'orange' : 'green', fontSize: 17 }}>
					sixes : {sixes}
				</Typography>
				<Typography sx={{ color: subtotal >= 63 ? 'red' : 'green', fontSize: 17 }}>
					subtotal : {subtotal}
				</Typography>
				<Typography sx={{ color: bonus > 0 ? 'red' : 'green', fontSize: 17 }}>
					bonus : {bonus}
				</Typography>
				<Typography
					onClick={() => handleFill(6)}
					sx={{ color: isFilled[6] ? 'orange' : 'green', fontSize: 17 }}>
					choice : {choice}
				</Typography>
				<Typography
					onClick={() => handleFill(7)}
					sx={{
						color: isFilled[7]
							? 'orange'
							: fourOfKind > 0
							? 'red'
							: 'green',
						fontSize: 17,
					}}>
					4 of Kind : {fourOfKind}
				</Typography>
				<Typography
					onClick={() => handleFill(8)}
					sx={{
						color: isFilled[8] ? 'orange' : fullHouse > 0 ? 'red' : 'green',
						fontSize: 17,
					}}>
					fullHouse : {fullHouse}
				</Typography>
				<Typography
					onClick={() => handleFill(9)}
					sx={{
						color: isFilled[9] ? 'orange' : sStraght > 0 ? 'red' : 'green',
						fontSize: 17,
					}}>
					S. Straght : {sStraght}
				</Typography>
				<Typography
					onClick={() => handleFill(10)}
					sx={{
						color: isFilled[10] ? 'orange' : lStraght > 0 ? 'red' : 'green',
						fontSize: 17,
					}}>
					L. Straght : {lStraght}
				</Typography>
				<Typography
					onClick={() => handleFill(11)}
					sx={{
						color: isFilled[11] ? 'orange' : yachu > 0 ? 'red' : 'green',
						fontSize: 17,
					}}>
					yachu : {yachu}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					total : {total}
				</Typography>
			</Stack>
		</Paper>
	);
}
