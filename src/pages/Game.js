/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect, useMemo, useState } from 'react';
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
import { authService, dbService, rtService } from '../fbase';
import effectSound from '../hooks/effectSound';
import FilledSound from '../static/sounds/filled.mp3';

import BattleConFilm from '../components/modal/BattleConfirm';
import { useNavigate } from 'react-router-dom';

export default function Game({
	isLoggedIn,
	setIsLoggedIn,
	drawerWidth,
	isMobile,
	isTablet,
	ColorModeContext,
}) {
	const theme = useTheme();
	const navigate = useNavigate();

	const [battleModalOpen, setBattleModalOpen] = useState(false);

	const [scoreArr, setScoreArr] = useState([]);
	const [filledArr, setFilledArr] = useState([]);
	const [dicesArr, setDicesArr] = useState([]);
	const [holdArr, setHoldArr] = useState([]);
	const [fbLeft, setFbLeft] = useState(0);

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
		sessionStorage.setItem('myUid', myUid);
	}, [myUid]);

	useMemo(() => myUid, [myUid]);

	//--------------Language----------------//

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
	const savedDiceArr = myUid
		? dicesArr
		: sessionStorage.getItem('dices')
		? JSON.parse(sessionStorage.getItem('dices'))
		: diceArr;

	const [dices, setDices] = useState(savedDiceArr);

	// HOLD

	const savedHoldArr = myUid
		? holdArr
		: sessionStorage.getItem('isHold')
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

	const savedFilledArr = myUid
		? filledArr
		: sessionStorage.getItem('isFilled')
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

	const savedLeft = myUid
		? fbLeft
		: sessionStorage.getItem('left')
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

	const savedScoreArr = myUid
		? scoreArr
		: sessionStorage.getItem('score')
		? JSON.parse(sessionStorage.getItem('score'))
		: 0;

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

	// const scoreData = [
	// 	ace,
	// 	duce,
	// 	threes,
	// 	fours,
	// 	fives,
	// 	sixes,
	// 	subTotal,
	// 	bonus,
	// 	choice,
	// 	fourOfKind,
	// 	fullHouse,
	// 	sStraght,
	// 	lStraght,
	// 	yacht,
	// 	total,
	// ];

	//----------BRING FB DATA----------//

	// useEffect(() => {
	// 	myUid
	// 		? dbService
	// 				.collection('singleGames')
	// 				.doc(myUid)
	// 				.onSnapshot((snapshot) => {
	// 					const dbData = snapshot.data();
	// 					setScoreArr(dbData.scoreData);
	// 					setFilledArr(dbData.isFilled);
	// 					setDicesArr(dbData.dices);
	// 					setHoldArr(dbData.isHold);
	// 					setFbLeft(dbData.left);
	// 				})
	// 		: console.log('err');
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	//----------SAVING DATA-----------//

	// useEffect(() => {
	// 	myUid &&
	// 		rtService.collection('singleGames').doc(myUid).update({
	// 			myUid,
	// 			dices,
	// 			left,
	// 			isFilled,
	// 			isHold,
	// 			scoreData,
	// 		});

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dices, left, isFilled, isHold, scoreData]);

	useEffect(() => {
		sessionStorage.setItem(
			'score',
			JSON.stringify([
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
			])
		);
	}, [
		ace,
		bonus,
		choice,
		duce,
		fives,
		fourOfKind,
		fours,
		fullHouse,
		lStraght,
		sStraght,
		sixes,
		subTotal,
		threes,
		total,
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

	//---------------------END GAME--------------------//

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
		if (isFin && !myUid) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFin, total]);

	useEffect(() => {
		async function endGame() {
			if (isFin) {
				if (me && me.indivBestScore < total) {
					await dbService.collection('users').doc(myUid).update({
						indivBestScore: total,
					});
					setNewBestScore(true);
				}
				await dbService
					.collection('users')
					.doc(myUid)
					.update({
						indivTotalScore: me.indivTotalScore + total,
						indivNumberOfGames: me.indivNumberOfGames + 1,
					});
			}
		}
		endGame();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFin]);

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
		setMembers(users.filter((user) => user.id !== myUid));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [users]);

	//--------BATTLE ACCECPTANCE------//

	const opponentUid = JSON.parse(sessionStorage.getItem('opponentUid'));

	const [rejected, setRejected] = useState(false);

	useEffect(() => {
		myUid &&
			dbService
				.collection('users')
				.doc(myUid)
				.onSnapshot((snapshot) => {
					setMe(snapshot.data());
					if (snapshot.data().pvp === 'accept') {
						rtService.ref('games/' + myUid).set({
							myUid: myUid,
							dices: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 },
							left: 3,
							isFilled: {
								0: false,
								1: false,
								2: false,
								3: false,
								4: false,
								5: false,
								6: false,
								7: false,
								8: false,
								9: false,
								10: false,
								11: false,
								12: false,
								13: false,
								14: false,
							},
							isHold: {
								0: false,
								1: false,
								2: false,
								3: false,
								4: false,
							},
							scoreData: {
								0: 0,
								1: 0,
								2: 0,
								3: 0,
								4: 0,
								5: 0,
								6: 0,
								7: 0,
								8: 0,
								9: 0,
								10: 0,
								11: 0,
								12: 0,
								13: 0,
								14: 0,
							},
							myTurn: false,
							opponentUid: JSON.parse(
								sessionStorage.getItem('opponentUid')
							),
						});
						sessionStorage.removeItem(
							'dices',
							'isHold',
							'isFilled',
							'left',
							'score'
						);

						setTimeout(() => {
							dbService.collection('users').doc(myUid).update({
								pvp: '',
							});

							setBattleModalOpen(false);

							navigate('/pvp');
						}, [300]);
					} else if (snapshot.data().pvp === 'rejected') {
						setRejected(true);
					} else if (snapshot.data().pvp === 'end') {
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
						myUid && rtService.ref('games/' + myUid).delete();
						opponentUid && rtService.ref('games/' + opponentUid).delete();
					} else {
						snapshot.data().pvp !== ''
							? setBattleModalOpen(true)
							: setBattleModalOpen(false);
					}
				});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [myUid, opponentUid]);

	//--------DELETE DATA---------//

	const handleDeleteGame = () => {
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFin(false);
		setIsStart(true);
		setSnackBarOpen(false);
		// myUid && dbService.collection('singleGames').doc(myUid).delete();
	};

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
				isMobile={isMobile}
				isTablet={isTablet}
				open={open}
				setOpen={setOpen}
				drawerWidth={drawerWidth}
				ColorModeContext={ColorModeContext}
				me={me}
				members={members}
				Eng={Eng}
				setEng={setEng}
				myUid={myUid}
				handleDeleteGame={() => handleDeleteGame()}
				pvp={false}
				rejected={rejected}
				setRejected={setRejected}
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
								me={me}
								myUid={myUid}
							/>
						</Stack>
					</Grid>
				</Grid>
				<Snackbar
					open={snackBarOpen}
					autoHideDuration={4000}
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
						{Eng
							? newBestScore
								? 'Excellent! New Best Score ' + total
								: 'Great! Your Score is ' + total
							: newBestScore
							? '최고 기록 경신! ' + total + ' 점'
							: '훌륭해요! ' + total + ' 점'}
					</Alert>
				</Snackbar>
			</Main>
			<BattleConFilm
				battleModalOpen={battleModalOpen}
				setBattleModalOpen={setBattleModalOpen}
				Eng={Eng}
				myUid={myUid}
			/>
		</Box>
	);
}
