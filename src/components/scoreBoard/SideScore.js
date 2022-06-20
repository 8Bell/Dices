import React from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { ChevronRight } from '@mui/icons-material';
import Score from './Score';

export default function SideScore({
	sideScoreOpen,
	setSideScoreOpen,
	drawerWidth,
	isMobile,
	dices,
	setDices,
	setIsHold,
	isFilled,
	setIsFilled,
	handleFill,
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
}) {
	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	const handleDrawerClose = () => {
		setSideScoreOpen(false);
	};

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					width: drawerWidth,
					boxSizing: 'border-box',
				},
			}}
			variant='persistent'
			anchor='right'
			open={sideScoreOpen}>
			<DrawerHeader>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'absolute',
						left: 2,
						ml: 2,
					}}>
					Score
				</Typography>
				<IconButton onClick={handleDrawerClose}>
					<ChevronRight />
				</IconButton>
			</DrawerHeader>
			<Divider />

			<Score
				isMobile={isMobile}
				dices={dices}
				setDices={setDices}
				setIsHold={setDices}
				isFilled={isFilled}
				setIsFilled={setIsFilled}
				handleFill={handleFill}
				ace={ace}
				duce={duce}
				threes={threes}
				fours={fours}
				fives={fives}
				sixes={sixes}
				subTotal={subTotal}
				bonus={bonus}
				choice={choice}
				fourOfKind={fourOfKind}
				fullHouse={fullHouse}
				sStraght={sStraght}
				lStraght={lStraght}
				yachu={yachu}
				total={total}
			/>
			<Divider />
		</Drawer>
	);
}
