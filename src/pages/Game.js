/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { Grid, Snackbar, Stack } from '@mui/material';
import Score from '../components/scoreBoard/Score';
import SideScore from '../components/scoreBoard/SideScore';
import { useTheme } from '@emotion/react';
import Board from '../components/gameBoard/Board';
import MuiAlert from '@mui/material/Alert';
import { authService, dbService } from '../fbase';
import effectSound from '../hooks/effectSound';
import FilledSound from '../static/sounds/filled.mp3';

export default function Game({
	isLoggedIn,
	setIsLoggedIn,
	drawerWidth,
	isMobile,
	isTablet,
	ColorModeContext,
}) {
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

	//-----------------PVP-----------------//
	//const [isPVPMode, setIsPVPMode] = useState(false);

	//--------------Language---------------//

	const savedEng = localStorage.getItem('Eng')
		? JSON.parse(localStorage.getItem('Eng'))
		: false;
	const [Eng, setEng] = useState(savedEng);

	useEffect(() => {
		localStorage.setItem('Eng', JSON.stringify(Eng));
	}, [Eng]);

	//-----------EFFECT SOUNDS-------------//

	const filledSound = effectSound(FilledSound, 1);

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
		const newFilled = isFilled.map((filled, index) => (idx === index ? true : filled));
		setIsFilled(newFilled);
		filledSound.play();
		sessionStorage.removeItem('dices', 'isHold', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setLeft(3);
		setIsStart(false);

		setTimeout(() => {
			setSideScoreOpen(false);
		}, 300);
	};

	//----------LEFT----------//

	const savedLeft = sessionStorage.getItem('left')
		? JSON.parse(sessionStorage.getItem('left'))
		: 3;

	const [left, setLeft] = useState(savedLeft);

	useEffect(() => {
		sessionStorage.setItem('left', JSON.stringify(left));
		left === 0 &&
			(isTablet || isMobile) &&
			setTimeout(() => {
				setSideScoreOpen(true);
			}, 3500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [left]);

	//----------------------------Rules-----------------------------//

	const savedScoreArr = [
		sessionStorage.getItem('ace') ? JSON.parse(sessionStorage.getItem('ace')) : 0,
		sessionStorage.getItem('duce') ? JSON.parse(sessionStorage.getItem('duce')) : 0,
		sessionStorage.getItem('threes') ? JSON.parse(sessionStorage.getItem('threes')) : 0,
		sessionStorage.getItem('fours') ? JSON.parse(sessionStorage.getItem('fours')) : 0,
		sessionStorage.getItem('fives') ? JSON.parse(sessionStorage.getItem('fives')) : 0,
		sessionStorage.getItem('sixes') ? JSON.parse(sessionStorage.getItem('sixes')) : 0,
		sessionStorage.getItem('choice') ? JSON.parse(sessionStorage.getItem('choice')) : 0,
		sessionStorage.getItem('fourOfKind')
			? JSON.parse(sessionStorage.getItem('fourOfKind'))
			: 0,
		sessionStorage.getItem('fullHouse')
			? JSON.parse(sessionStorage.getItem('fullHouse'))
			: 0,
		sessionStorage.getItem('sStraght') ? JSON.parse(sessionStorage.getItem('sStraght')) : 0,
		sessionStorage.getItem('lStraght') ? JSON.parse(sessionStorage.getItem('lStraght')) : 0,
		sessionStorage.getItem('yatch') ? JSON.parse(sessionStorage.getItem('yatch')) : 0,
	];

	const [ace, setAce] = useState(savedScoreArr[0]); //isFilled 0
	const [duce, setDuce] = useState(savedScoreArr[1]); //isFilled 1
	const [threes, setThrees] = useState(savedScoreArr[2]); //isFilled 2
	const [fours, setFours] = useState(savedScoreArr[3]); //isFilled 3
	const [fives, setFives] = useState(savedScoreArr[4]); //isFilled 4
	const [sixes, setSixes] = useState(savedScoreArr[5]); //isFilled 5
	const [subTotal, setSubTotal] = useState(0);
	const [bonus, setBonus] = useState(0);
	const [choice, setChoice] = useState(savedScoreArr[6]); //isFilled 8
	const [fourOfKind, setFourOfKind] = useState(savedScoreArr[7]); //isFilled 9
	const [fullHouse, setFullHouse] = useState(savedScoreArr[8]); //isFilled 10
	const [sStraght, setSStraght] = useState(savedScoreArr[9]); //isFilled 11
	const [lStraght, setLStraght] = useState(savedScoreArr[10]); //isFilled 12
	const [yacht, setYacht] = useState(savedScoreArr[11]); //isFilled 13
	const [total, setTotal] = useState(0);

	useEffect(() => {
		sessionStorage.setItem('ace', JSON.stringify(ace));
		sessionStorage.setItem('duce', JSON.stringify(duce));
		sessionStorage.setItem('threes', JSON.stringify(threes));
		sessionStorage.setItem('fours', JSON.stringify(fours));
		sessionStorage.setItem('fives', JSON.stringify(fives));
		sessionStorage.setItem('sixes', JSON.stringify(sixes));
		sessionStorage.setItem('choice', JSON.stringify(choice));
		sessionStorage.setItem('fourOfKind', JSON.stringify(fourOfKind));
		sessionStorage.setItem('fullHouse', JSON.stringify(fullHouse));
		sessionStorage.setItem('sStraght', JSON.stringify(sStraght));
		sessionStorage.setItem('lStraght', JSON.stringify(lStraght));
		sessionStorage.setItem('yacht', JSON.stringify(yacht));
	}, [
		ace,
		choice,
		duce,
		fives,
		fourOfKind,
		fours,
		fullHouse,
		lStraght,
		sStraght,
		sixes,
		threes,
		yacht,
	]);

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
			0 < i && i <= 2 && j !== 2 && !dices.includes('l')
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
			(i === 1 || (i === 2 && j === 2)) && !dices.includes('l')
				? setFullHouse(dices.reduce((dice, cv) => dice + cv))
				: setFullHouse(0);
		}
	}, [dices, isFilled]);

	//S. STRAGHT //isFilled 11
	useEffect(() => {
		if (!isFilled[11]) {
			let i = 0;
			let j = 0;
			let k = 0;

			[1, 2, 3, 4].map((num, idx) => {
				dices.includes(num) && i++;
			});
			[2, 3, 4, 5].map((num, idx) => {
				dices.includes(num) && j++;
			});
			[3, 4, 5, 6].map((num, idx) => {
				dices.includes(num) && k++;
			});
			i === 4 || (j === 4) | (k === 4) ? setSStraght(15) : setSStraght(0);
			console.log('j', j);
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

	//Yacht //isFilled 13
	useEffect(() => {
		if (!isFilled[13]) {
			let i = 0;
			[1, 2, 3, 4, 5, 6, 'l'].map((num) => {
				dices.includes(num) && i++;
				dices.includes('l') && i--;
			});
			i === 1 ? setYacht(50) : setYacht(0);
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
			yacht,
			total,
		];
		isFilled.map((filled, idx) => {
			filled && (sum = sum + Number(totarArr[idx]));
		});
		setTotal(sum + Number(bonus));
	}, [
		ace,
		bonus,
		choice,
		duce,
		fives,
		fourOfKind,
		fours,
		fullHouse,
		isFilled,
		lStraght,
		sStraght,
		sixes,
		subTotal,
		threes,
		total,
		yacht,
	]);

	//---------------------FINE--------------------//
	// eslint-disable-next-line no-unused-vars
	const [isFine, setIsFine] = useState(false);

	useEffect(() => {
		let i = 0;
		isFilled.map((filled) => {
			filled && i++;
		});
		if (i === 12) {
			setIsFine(true);
			setDices([0, 0, 0, 0, 0]);
			setTimeout(() => {
				setSnackBarOpen(true);
			}, [100]);
		}
	}, [isFilled]);

	useEffect(() => {
		if (isFine) {
			if (localStorage.getItem('BestScore')) {
				if (JSON.parse(localStorage.getItem('BestScore')) < total) {
					localStorage.setItem('BestScore', JSON.stringify(total));
					setNewBestScore(true);
				} else {
					setNewBestScore(false);
				}
			} else {
				localStorage.setItem('BestScore', JSON.stringify(total));
				setNewBestScore(false);
			}
		}
	}, [isFine, total]);

	useEffect(() => {
		if (isFine) {
			if (me[0] && me[0].bestScore < total) {
				dbService.collection('users').doc(myUid).update({
					bestScore: total,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFine, total]);

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

	//---------------START ----------------------//
	const [isStart, setIsStart] = useState(true);

	//--------------CURRENT USER ---------------//

	const [myUid, setMyUid] = useState('');

	useEffect(() => {
		authService.currentUser !== null && setMyUid(authService.currentUser.uid);
	}, []);

	//-----------------USERS------------------//

	const [users, setUsers] = useState([]);
	const [members, setMembers] = useState([]);

	useEffect(() => {
		dbService
			.collection('users')
			.orderBy('Rank')
			.onSnapshot((snapshot) => {
				const dbUsers = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
					checked: false,
				}));
				setUsers(dbUsers);
			});
	}, []);

	const [me, setMe] = useState([]);

	useEffect(() => {
		setMe(users.filter((user) => user.id === myUid));
		setMembers(users.filter((user) => user.id !== myUid));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	console.log('me', me);
	console.log('members', members);
	console.log('myUid', myUid);

	return (
		<Box
			sx={{
				display: 'flex',
				overflowX: 'hidden',
				overflowY: 'hidden',
				maxHeight: isMobile || isTablet ? 'none' : '100vh',
			}}>
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
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				isTablet={isTablet}
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
				me={me}
				members={members}
				Eng={Eng}
				setEng={setEng}
			/>
			<SideScore
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				drawerWidth={drawerWidth}
				isMobile={isMobile}
				isTablet={isTablet}
				isFilled={isFilled}
				handleFill={handleFill}
				dices={dices}
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
				yacht={yacht}
				subTotal={subTotal}
				bonus={bonus}
				total={total}
				left={left}
				Eng={Eng}
			/>
			<Main open={open}>
				<DrawerHeader />

				<Grid
					container
					sx={{
						maxHeight: isMobile ? 'none' : isTablet ? 'none' : '930px',
						borderBottom: isMobile || isTablet ? 'none' : '1px solid',
						borderColor: theme.palette.divider,
					}}>
					{!isTablet && !isMobile && (
						<Grid xs={3} sx={{ minWidth: 340, ml: -1, mt: -1 }}>
							<Score
								isMobile={isMobile}
								isFilled={isFilled}
								handleFill={handleFill}
								dices={dices}
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
								yacht={yacht}
								subTotal={subTotal}
								bonus={bonus}
								total={total}
								left={left}
								Eng={Eng}
							/>
						</Grid>
					)}
					<Grid
						xs
						sx={{
							ml: isTablet || isMobile ? 0 : 2,
							mr: isTablet || isMobile ? 0 : 1,
							mt: isTablet || isMobile ? -1 : 1,
						}}>
						<Stack
							direction='row'
							justifyContent='center'
							alignItems='center'>
							<Board
								isLoggedIn={isLoggedIn}
								me={me}
								isMobile={isMobile}
								isTablet={isTablet}
								dices={dices}
								setDices={setDices}
								isHold={isHold}
								setIsHold={setIsHold}
								isFilled={isFilled}
								setIsFilled={setIsFilled}
								left={left}
								setLeft={setLeft}
								isFine={isFine}
								setIsFine={setIsFine}
								total={total}
								isStart={isStart}
								setIsStart={setIsStart}
								setSnackBarOpen={setSnackBarOpen}
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
								yacht={yacht}
								subTotal={subTotal}
								bonus={bonus}
								Eng={Eng}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Snackbar
					open={snackBarOpen}
					autoHideDuration={6000}
					onClose={handleSnackBarClose}>
					<Alert
						onClose={handleSnackBarClose}
						sx={{
							width: isTablet ? '95vw' : '97vw',
							position: 'fixed',
							bottom: '5%',
							mr: 10,
							backgroundColor: newBestScore
								? theme.palette.text.primary
								: theme.palette.action.active,
							color: newBestScore
								? theme.palette.background.default
								: 'default',
						}}>
						{newBestScore
							? 'Excellent! New Best Score ' + total
							: 'Great! Your Score is ' + total}
					</Alert>
				</Snackbar>
			</Main>
		</Box>
	);
}
