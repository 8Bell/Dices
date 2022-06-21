/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { Grid, Snackbar } from '@mui/material';
import Score from '../components/scoreBoard/Score';
import SideScore from '../components/scoreBoard/SideScore';
import { useTheme } from '@emotion/react';
import Board from '../components/Board';
import MuiAlert from '@mui/material/Alert';

export default function Game({ drawerWidth, isMobile, isTablet, ColorModeContext }) {
	const theme = useTheme();

	const Main = styled('main', {
		shouldForwardProp: (prop) => prop !== 'open',
	})(({ theme, open }) => ({
		flexGrow: 1,
		padding: theme.spacing(1),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: isMobile ? '-200%' : -drawerWidth * 2,
		marginTop: isTablet ? '5%' : '0',

		...(open && {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: isMobile ? '-300%' : -drawerWidth * 2,
		}),
	}));

	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
	});

	//----------DICES------------//

	const diceArr = [0, 0, 0, 0, 0];
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

	//----------Fill-------------//

	const savedFilledArr = sessionStorage.getItem('isFilled')
		? JSON.parse(sessionStorage.getItem('isFilled'))
		: new Array(15).fill(false);

	const [isFilled, setIsFilled] = useState(savedFilledArr);

	useEffect(() => {
		sessionStorage.setItem('isFilled', JSON.stringify(isFilled));
	}, [isFilled]);

	const handleFill = (idx) => {
		// const arr = [
		// 	'Ace',
		// 	'Duce',
		// 	'Threes',
		// 	'Fours',
		// 	'Fives',
		// 	'Sixes',
		// 	'SubTotal',
		// 	'Bonus',
		// 	'Choice',
		// 	'4 of Kind',
		// 	'Full House',
		// 	'S. Straght',
		// 	'L. Straght',
		// 	'YACHU',
		// 	'Total',
		// ];
		// if (window.confirm(`Fill in item ${arr[idx]} ?`)) {
		const newFilled = isFilled.map((filled, index) => (idx === index ? true : filled));
		setIsFilled(newFilled);
		sessionStorage.removeItem('dices', 'isHold', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setLeft(3);

		setTimeout(() => {
			setSideScoreOpen(false);
		}, 500);
		// }
	};

	//----------LEFT----------//

	const savedLeft = sessionStorage.getItem('left')
		? JSON.parse(sessionStorage.getItem('left'))
		: 3;

	const [left, setLeft] = useState(savedLeft);

	useEffect(() => {
		sessionStorage.setItem('left', JSON.stringify(left));
		left === 0 &&
			isTablet &&
			setTimeout(() => {
				setSideScoreOpen(true);
			}, 1000);
	}, [left]);

	//----------FINE----------//
	// eslint-disable-next-line no-unused-vars
	const [isFine, setIsFine] = useState(false);

	useEffect(() => {
		let i = 0;
		isFilled.map((filled) => {
			filled && i++;
		});
		i === 12 && setSnackBarOpen(true);
		i === 12 && setIsFine(true);
		i === 12 && setDices([0, 0, 0, 0, 0]);
	}, [isFilled]);

	useEffect(() => {
		if (isFine) {
			localStorage.getItem('BestScore')
				? JSON.parse(localStorage.getItem('BestScore')) < total
					? localStorage.setItem('BestScore', JSON.stringify(total)) &&
					  setNewBestScore(true)
					: setNewBestScore(false)
				: localStorage.setItem('BestScore', JSON.stringify(total)) &&
				  setNewBestScore(true);
		}
	}, [isFine]);

	//----------Rules------------//

	const [ace, setAce] = useState(0); //isFilled 0
	const [duce, setDuce] = useState(0); //isFilled 1
	const [threes, setThrees] = useState(0); //isFilled 2
	const [fours, setFours] = useState(0); //isFilled 3
	const [fives, setFives] = useState(0); //isFilled 4
	const [sixes, setSixes] = useState(0); //isFilled 5
	const [subTotal, setSubTotal] = useState(0);
	const [bonus, setBonus] = useState(0);
	const [choice, setChoice] = useState(0); //isFilled 8
	const [fourOfKind, setFourOfKind] = useState(0); //isFilled 9
	const [fullHouse, setFullHouse] = useState(0); //isFilled 10
	const [sStraght, setSStraght] = useState(0); //isFilled 11
	const [lStraght, setLStraght] = useState(0); //isFilled 12
	const [yachu, setYachu] = useState(0); //isFilled 13
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
		setSubTotal(sum);
	}, [isFilled]);

	//+35 BONUS
	useEffect(() => {
		subTotal >= 63 ? setBonus(35) : setBonus(0);
	}, [isFilled, subTotal]);

	//CHOICE //isFilled 8
	useEffect(() => {
		if (!isFilled[8]) {
			let sum = 0;
			dices.map((dice) => (sum = sum + dice));
			!isNaN(sum) ? setChoice(sum) : setChoice(0);
		}
	}, [dices, isFilled]);

	//4 OF KIND //isFilled 9

	useEffect(() => {
		if (!isFilled[9]) {
			let i = 0;
			let j = 0;
			[1, 2, 3, 4, 5, 6].map((num) => {
				dices.includes(num) && i++;
				dices.indexOf(num) !== dices.lastIndexOf(num) && j++;
			});
			0 < i && i <= 2 && j !== 2
				? setFourOfKind(dices.reduce((dice, cv) => dice + cv))
				: setFourOfKind(0);
		}
	}, [dices, isFilled]);

	//FULL HOUSE //isFilled 10

	useEffect(() => {
		if (!isFilled[10]) {
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

	//S. STRAGHT //isFilled 11
	useEffect(() => {
		if (!isFilled[11]) {
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

	//L. STRAGHT //isFilled 12
	useEffect(() => {
		if (!isFilled[12]) {
			let i = 0;
			let j = 0;

			[1, 2, 3, 4, 5, 6].map((num, idx) => {
				dices.includes(num) && i++;
				dices.includes(num) && (j = j + idx);
			});
			i === 5 && (j === 10 || j === 15) ? setLStraght(30) : setLStraght(0);
		}
	}, [dices, isFilled]);

	//YACHU //isFilled 13
	useEffect(() => {
		if (!isFilled[13]) {
			let i = 0;
			[1, 2, 3, 4, 5, 6].map((num) => {
				dices.includes(num) && i++;
			});
			i === 1 ? setYachu(50) : setYachu(0);
		}
	}, [dices, isFilled]);

	//TOTAL
	useEffect(() => {
		let sum = 0;
		const totarArr = [
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
		isFilled.map((filled, idx) => {
			filled && (sum = sum + Number(totarArr[idx]));
		});
		setTotal(sum + Number(bonus));
	}, [isFilled]);

	console.log(yachu, total);

	const [open, setOpen] = useState(false);
	const [sideScoreOpen, setSideScoreOpen] = useState(false);

	const [snackBarOpen, setSnackBarOpen] = useState(false);
	const [newBestScore, setNewBestScore] = useState(false);

	const handleSnackBarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackBarOpen(false);
		setNewBestScore(false);
	};

	return (
		<Box sx={{ display: 'flex', overflowX: 'hidden' }}>
			<div
				class={
					theme.palette.mode === 'dark'
						? 'page-preloader-dark'
						: 'page-preloader-light'
				}
			/>
			<CssBaseline />
			<Navbar
				open={open}
				setOpen={setOpen}
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isMobile={isMobile}
				isTablet={isTablet}
			/>
			<SideMenu
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
			/>
			<SideScore
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isMobile={isMobile}
				isFilled={isFilled}
				handleFill={handleFill}
				ace={ace}
				duce={duce}
				threes={threes}
				fours={fours}
				fives={fives}
				sixes={sixes}
				choice={choice}
				fourOfKind={fourOfKind}
				fullHouse={fullHouse}
				sStraght={sStraght}
				lStraght={lStraght}
				yachu={yachu}
				subTotal={subTotal}
				bonus={bonus}
				total={total}
				left={left}
			/>
			<Main open={open}>
				<DrawerHeader />

				<Grid container>
					{!isTablet && (
						<Grid xs={4}>
							<Score
								isMobile={isMobile}
								isFilled={isFilled}
								handleFill={handleFill}
								ace={ace}
								duce={duce}
								threes={threes}
								fours={fours}
								fives={fives}
								sixes={sixes}
								choice={choice}
								fourOfKind={fourOfKind}
								fullHouse={fullHouse}
								sStraght={sStraght}
								lStraght={lStraght}
								yachu={yachu}
								subTotal={subTotal}
								bonus={bonus}
								total={total}
								left={left}
							/>
						</Grid>
					)}
					<Grid
						xs
						sx={{
							ml: isTablet ? 0 : 2,
							mr: isTablet ? 0 : 1,
							mt: isTablet ? -1 : 1,
						}}>
						<Board
							isMobile={isMobile}
							isTablet={isTablet}
							dices={dices}
							setDices={setDices}
							isHold={isHold}
							setIsHold={setIsHold}
							setIsFilled={setIsFilled}
							left={left}
							setLeft={setLeft}
							isFine={isFine}
							total={total}
						/>
					</Grid>
				</Grid>
				<Snackbar
					open={snackBarOpen}
					autoHideDuration={6000}
					onClose={handleSnackBarClose}>
					<Alert
						onClose={handleSnackBarClose}
						severity={newBestScore ? 'success' : 'info'}
						sx={{
							width: isTablet ? '95vw' : '97vw',
							position: 'fixed',
							bottom: '5%',
							mr: 10,
						}}>
						Great! Your Score is {total}
					</Alert>
				</Snackbar>
			</Main>
		</Box>
	);
}
