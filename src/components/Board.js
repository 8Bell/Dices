import { Box, Button, Paper, Stack, styled, Typography } from '@mui/material';
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

	//----------DICES------------//

	const [dices, setDices] = useState([
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
		Math.floor(Math.random() * 6) + 1,
	]);

	const [isHold, setIsHold] = useState(new Array(5).fill(false));

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

	//----------Rules------------//

	const [ace, setAce] = useState(0); //isFilled 1
	const [duce, setDuce] = useState(0); //isFilled 2
	const [threes, setThrees] = useState(0); //isFilled 3
	const [fours, setFours] = useState(0); //isFilled 4
	const [fives, setFives] = useState(0); //isFilled 5
	const [sixes, setSixes] = useState(0); //isFilled 6
	const [subtotal, setSubtotal] = useState(ace + duce + fours + fives + sixes);
	const [bonus, setBonus] = useState(0);
	const [choice, setChoice] = useState(0); //isFilled 7
	const [fourOfKind, setFourOfKind] = useState(0); //isFilled 8
	const [fullHouse, setFullHouse] = useState(0); //isFilled 9
	const [sStraght, setSStraght] = useState(0); //isFilled 10
	const [lStraght, setLStraght] = useState(0); //isFilled 11
	const [yachu, setYachu] = useState(0); //isFilled 12
	const [total, setTotal] = useState(
		subtotal + bonus + choice + fourOfKind + fullHouse + sStraght + lStraght + yachu
	);

	const [isFilled, setIsFilled] = useState(new Array(12).fill(false));

	//ACE //isFilled 1
	useEffect(() => {
		let i = 0;
		!isFilled[1] && dices.map((dice) => dice === 1 && ++i);
		setAce(i * 1);
	}, [dices, isFilled]);

	//DUCES //isFilled 2
	useEffect(() => {
		let i = 0;
		!isFilled[2] && dices.map((dice) => dice === 2 && ++i);
		setDuce(i * 2);
	}, [dices, isFilled]);

	//THREES //isFilled 3
	useEffect(() => {
		let i = 0;
		!isFilled[3] && dices.map((dice) => dice === 3 && ++i);
		setThrees(i * 3);
	}, [dices, isFilled]);
	//FOURS //isFilled 4
	useEffect(() => {
		let i = 0;
		!isFilled[4] && dices.map((dice) => dice === 4 && ++i);
		setFours(i * 4);
	}, [dices, isFilled]);
	//FIVES //isFilled 5
	useEffect(() => {
		let i = 0;
		!isFilled[5] && dices.map((dice) => dice === 5 && ++i);
		setFives(i * 5);
	}, [dices, isFilled]);
	//SIXES //isFilled 6
	useEffect(() => {
		let i = 0;
		!isFilled[6] && dices.map((dice) => dice === 6 && ++i);
		setSixes(i * 6);
	}, [dices, isFilled]);

	//+35 BONUS
	useEffect(() => {
		subtotal >= 63 && setBonus(35);
	}, [isFilled]);
	//CHOICE //isFilled 7
	useEffect(() => {
		let sum = 0;
		!isFilled[6] && dices.map((dice) => (sum = sum + dice));
		setChoice(sum);
	}, [dices, isFilled]);
	//4 OF KIND //isFilled 8
	useEffect(() => {}, [dices, isFilled]);

	//FULL HOUSE //isFilled 9
	//S. STRAGHT //isFilled 10
	//L. STRAGHT //isFilled 11
	//YACHU //isFilled 12
	useEffect(() => {
		dices[0] === dices[1] &&
			dices[1] === dices[2] &&
			dices[2] === dices[3] &&
			dices[3] === dices[4] &&
			setYachu(50);
	}, [dices]);

	//TOTAL

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
					sx={{ height: 40, width: 100, mt: 5, mb: 3 }}>
					Shake
				</Button>
				<Typography sx={{ color: 'green', fontSize: 17 }}>ace : {ace}</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>duce : {duce}</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					threes : {threes}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					fours : {fours}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					fives : {fives}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					sixes : {sixes}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					subtotal : {subtotal}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					bonus : {bonus}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					choice : {choice}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					fourOfKind : {fourOfKind}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					fullHouse : {fullHouse}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					yachu : {yachu}
				</Typography>
				<Typography sx={{ color: 'green', fontSize: 17 }}>
					total : {total}
				</Typography>
			</Stack>
		</Paper>
	);
}
