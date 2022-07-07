/* eslint-disable array-callback-return */
import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../components/NavBar';
import SideMenu from '../components/SideMenu';
import { Grid, Snackbar, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import MuiAlert from '@mui/material/Alert';
import { authService, dbService } from '../fbase';
import effectSound from '../hooks/effectSound';
import FilledSound from '../static/sounds/filled.mp3';
import PVPSideScore from '../components/PVP/PVPSideScore';
import PVPBoard from '../components/PVP/PVPBoard';
import PVPScore from '../components/PVP/PVPScore';

export default function PVPGame({
	isLoggedIn,
	setIsLoggedIn,
	drawerWidth,
	pvpScoreDrawerWidth,
	isMobile,
	isTablet,
	ColorModeContext,
}) {
	const theme = useTheme();
	const navigate = useNavigate();

	//-------FB DATA --------//

	const savedMyData = localStorage.getItem('myData')
		? JSON.parse(localStorage.getItem('myData'))
		: {
				scoreData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				isFilled: [
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
				],
				dices: [0, 0, 0, 0, 0],
				isHold: [false, false, false, false, false],
				left: 3,
		  };

	const [myData, setMyData] = useState(savedMyData);
	const scoreArr = myData.scoreData;
	const filledArr = myData.isFilled;
	const dicesArr = myData.dices;
	const holdArr = myData.isHold;
	const fbLeft = myData.left;
	//const myTurn = myData.myTurn;

	const [opponentUid, setOpponentUid] = useState(
		JSON.parse(sessionStorage.getItem('opponentUid'))
	);

	const [myTurn, setMyTurn] = useState(
		sessionStorage.getItem('myTurn') ? JSON.parse(sessionStorage.getItem('myTurn')) : true
	);

	//---------STYLE---------//

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

	//--------------CURRENT USER ---------------//

	const [myUid, setMyUid] = useState('');

	useEffect(() => {
		authService.currentUser !== null && setMyUid(authService.currentUser.uid);
	}, []);

	useMemo(() => myUid, [myUid]);

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

	const [dices, setDices] = useState(dicesArr);

	// HOLD

	const [isHold, setIsHold] = useState(holdArr);

	//----------Fill-------------//

	const [isFilled, setIsFilled] = useState(filledArr);

	console.log('opponentUid', opponentUid);

	const handleFill = (idx) => {
		dbService.collection('games').doc(opponentUid).update({
			myTurn: true,
		});
		myUid &&
			dbService.collection('games').doc(myUid).update({
				myTurn: false,
			});

		const newFilled = isFilled.map((filled, index) => (idx === index ? true : filled));
		setIsFilled(newFilled);
		filledSound.play();
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setLeft(3);
		setIsStart(false);

		setTimeout(() => {
			setSideScoreOpen(false);
		}, 300);
	};

	//----------LEFT----------//

	const [left, setLeft] = useState(fbLeft);

	useEffect(() => {
		left === 0 &&
			(isTablet || isMobile) &&
			setTimeout(() => {
				setSideScoreOpen(true);
			}, 3500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [left]);

	//----------------------------Rules-----------------------------//

	const savedScoreArr = scoreArr;

	const [ace, setAce] = useState(savedScoreArr[0]); //isFilled 0
	const [duce, setDuce] = useState(savedScoreArr[1]); //isFilled 1
	const [threes, setThrees] = useState(savedScoreArr[2]); //isFilled 2
	const [fours, setFours] = useState(savedScoreArr[3]); //isFilled 3
	const [fives, setFives] = useState(savedScoreArr[4]); //isFilled 4
	const [sixes, setSixes] = useState(savedScoreArr[5]); //isFilled 5
	const [subTotal, setSubTotal] = useState(0);
	const [bonus, setBonus] = useState(0);
	const [choice, setChoice] = useState(savedScoreArr[8]); //isFilled 8
	const [fourOfKind, setFourOfKind] = useState(savedScoreArr[9]); //isFilled 9
	const [fullHouse, setFullHouse] = useState(savedScoreArr[10]); //isFilled 10
	const [sStraght, setSStraght] = useState(savedScoreArr[11]); //isFilled 11
	const [lStraght, setLStraght] = useState(savedScoreArr[12]); //isFilled 12
	const [yacht, setYacht] = useState(savedScoreArr[13]); //isFilled 13
	const [total, setTotal] = useState(0);

	const scoreData = [
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

	//----------UPLOAD TO FB DATA-----------//

	useEffect(() => {
		myUid &&
			dbService.collection('games').doc(myUid).update({
				myUid,
				dices,
				left,
				isFilled,
				isHold,
				scoreData,
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dices, left, isFilled, isHold, scoreData]);

	//----------BRING FROM FB DATA----------//

	useEffect(() => {
		function getMyData() {
			myUid
				? dbService
						.collection('games')
						.doc(myUid)
						.onSnapshot((snapshot) => {
							const dbData = snapshot.data();
							const dbMyTurn = snapshot.data().myTurn;

							console.log('dbData', dbData);

							setMyData(dbData);
							localStorage.setItem('myData', JSON.stringify(dbData));

							sessionStorage.setItem('myTurn', dbMyTurn);
							setMyTurn(snapshot.data().myTurn);
						})
				: console.log('err');
		}
		getMyData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUid, isHold, dices, isFilled, left]);

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

	//---------------------FIN--------------------//
	// eslint-disable-next-line no-unused-vars
	const [isFin, setIsFin] = useState(false);

	useEffect(() => {
		let i = 0;
		isFilled.map((filled) => {
			filled && i++;
		});
		if (i === 12) {
			setIsFin(true);
			setDices([0, 0, 0, 0, 0]);
			setTimeout(() => {
				setSnackBarOpen(true);
			}, [100]);
		}
	}, [isFilled]);

	useEffect(() => {
		if (isFin) {
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
	}, [isFin, total]);

	useEffect(() => {
		if (isFin) {
			if (me[0] && me[0].indivbestScore < total) {
				dbService.collection('users').doc(myUid).update({
					indivbestScore: total,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFin, total]);

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

	useEffect(() => {
		myUid &&
			dbService
				.collection('games')
				.doc(myUid)
				.onSnapshot((snapshot) => {
					const dbOpponentUid = snapshot.data().opponentUid;
					console.log('dbOpponentUid', dbOpponentUid);
					setOpponentUid(dbOpponentUid);
					// const dbMyTurn = snapshot.data().myTurn;
					// setMyTurn(dbMyTurn);
					console.log('opponentUid', opponentUid);
				});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUid]);

	//-------------OPPONENTS---------------//
	const [opponent, setOpponent] = useState({
		dices,
		isFilled,
		isHold,
		scoreData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	});

	useEffect(() => {
		opponentUid &&
			dbService
				.collection('games')
				.doc(opponentUid)
				.onSnapshot((snapshot) => {
					const dbOpponent = snapshot.data();
					console.log('dbOpponent', dbOpponent);
					setOpponent(dbOpponent);
					//dbOpponent.myTurn === false && setMyTurn(true);
				});
	}, [opponentUid]);

	//--------DELETE DATA---------//

	const handleDeleteGame = () => {
		localStorage.setItem(
			'myData',
			JSON.stringify({
				scoreData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				isFilled: [
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
					false,
				],
				dices: [0, 0, 0, 0, 0],
				isHold: [false, false, false, false, false],
				left: 3,
			})
		);
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFin(false);
		setIsStart(true);
		setSnackBarOpen(false);

		setTimeout(() => {
			myUid &&
				dbService.collection('users').doc(myUid).update({
					pvp: 'end',
				});
			navigate('/');
		}, [300]);
	};

	useEffect(() => {
		opponentUid &&
			dbService
				.collection('users')
				.doc(opponentUid)
				.onSnapshot((snapshot) => {
					if (snapshot.data().pvp === 'end') {
						localStorage.setItem(
							'myData',
							JSON.stringify({
								scoreData: [
									0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								],
								isFilled: [
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
									false,
								],
								dices: [0, 0, 0, 0, 0],
								isHold: [false, false, false, false, false],
								left: 3,
							})
						);
						setDices(diceArr);
						setIsHold(new Array(5).fill(false));
						setIsFilled(new Array(15).fill(false));
						setLeft(3);
						setIsFin(false);
						setIsStart(true);
						setTimeout(() => {
							navigate('/');
						}, [200]);
					}
				});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				handleDeleteGame={() => handleDeleteGame()}
				pvp={true}
			/>
			<PVPSideScore
				sideScoreOpen={sideScoreOpen}
				setSideScoreOpen={setSideScoreOpen}
				pvpScoreDrawerWidth={pvpScoreDrawerWidth}
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
				isHold={isHold}
				Eng={Eng}
				myUid={myUid}
				opponentUid={opponentUid}
				myTurn={myTurn}
				opponent={opponent}
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
						<Grid xs={3} sx={{ minWidth: 450, ml: -15, mt: -1 }}>
							<PVPScore
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
								isHold={isHold}
								Eng={Eng}
								myUid={myUid}
								opponentUid={opponentUid}
								myTurn={myTurn}
								opponent={opponent}
							/>
						</Grid>
					)}
					<Grid
						xs
						sx={{
							ml: isMobile ? 0 : isTablet ? -7 : 2,
							mr: isTablet || isMobile ? 0 : 1,
							mt: isTablet || isMobile ? -1 : 1,
						}}>
						<Stack
							direction='row'
							justifyContent='center'
							alignItems='center'>
							<PVPBoard
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
								isFin={isFin}
								setIsFin={setIsFin}
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
								myTurn={myTurn}
								opponent={opponent}
								myUid={myUid}
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
