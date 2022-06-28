import React from 'react';
import { styled, useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { ChevronRightRounded } from '@mui/icons-material';
import Score from './Score';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../hooks/effectSound';
import { Drawer } from '@mui/material';

export default function SideScore({
	sideScoreOpen,
	setSideScoreOpen,
	drawerWidth,
	isMobile,
	isTablet,
	isFilled,
	handleFill,
	dices,
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
	left,
	Eng,
}) {
	const DrawerHeader = styled('div')(({ theme }) => ({
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	}));

	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 0.5);

	const theme = useTheme();
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
			open={sideScoreOpen}
			disableSwipeToOpen={false}>
			<DrawerHeader
				sx={{
					borderTop: isTablet ? '1px solid' : 'none',
					//borderBottom: 'none',
					borderColor: theme.palette.divider,
				}}>
				<Typography
					variant='h6'
					noWrap
					component='div'
					sx={{
						position: 'absolute',
						left: 2,
						ml: 2,
						fontWeight: 'bold',
					}}>
					{Eng ? 'Score Board' : '점수표'}
				</Typography>
				<IconButton
					onClick={() => {
						handleDrawerClose();
						smallFlatSound.play();
					}}>
					<ChevronRightRounded fontSize='large' />
				</IconButton>
			</DrawerHeader>

			<Divider />
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
				subTotal={subTotal}
				bonus={bonus}
				choice={choice}
				fourOfKind={fourOfKind}
				fullHouse={fullHouse}
				sStraght={sStraght}
				lStraght={lStraght}
				yacht={yacht}
				total={total}
				left={left}
				Eng={Eng}
			/>
		</Drawer>
	);
}
