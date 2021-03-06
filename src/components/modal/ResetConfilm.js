import { ClearRounded, FiberManualRecordOutlined } from '@mui/icons-material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	//DialogTitle,
	IconButton,
	useTheme,
} from '@mui/material';
import React from 'react';
import SmallFlatSound from '../../static/sounds/smallFlat.mp3';
import effectSound from '../../util/effectSound';
import { dbService } from '../../fbase';

export default function ResetConfirm({
	resetModalOpen,
	setResetModalOpen,
	setDices,
	setIsHold,
	setIsFilled,
	setLeft,
	setIsFin,
	setIsStart,
	Eng,
	me,
	myUid,
	total,
}) {
	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setResetModalOpen(false);
	};
	const diceArr = [0, 0, 0, 0, 0];

	const handleNewGame = async () => {
		smallFlatSound.play();
		sessionStorage.removeItem('dices', 'isHold', 'isFilled', 'left');
		setDices(diceArr);
		setIsHold(new Array(5).fill(false));
		setIsFilled(new Array(15).fill(false));
		setLeft(3);
		setIsFin(false);
		setIsStart(true);

		await dbService
			.collection('users')
			.doc(myUid)
			.update({
				indivTotalScore: me.indivTotalScore + total,
				indivNumberOfGames: me.indivNumberOfGames + 1,
			});
	};

	return (
		<Dialog
			open={resetModalOpen}
			onClose={handleClose}
			sx={{
				backgroundColor:
					theme.palette.mode === 'dark'
						? 'rgba(17, 17, 17, 0.5)'
						: 'rgba(227, 227, 227, 0.4)',
				backdropFilter: 'blur(5px)',
				transitionDuration: '0.8s',
			}}>
			<DialogTitle
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					backdropFilter: 'opacity(0.3)',
					pt: 3,
					pb: 2,
					mb: 0,
					fontSize: 20,
					fontWight: 800,
				}}>
				{Eng ? 'New Game' : '새 게임'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 1, mt: 0 }}>
					{Eng ? (
						<>
							Reset the game?
							<br />
							{myUid
								? 'The data is reflected in the results.'
								: 'Current content will not be saved.'}
						</>
					) : (
						<>
							게임을 재시작할까요?
							<br />
							{myUid
								? '데이터는 결과에 반영됩니다.'
								: '게임 진행 상황은 저장되지 않습니다.'}
						</>
					)}
				</DialogContentText>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					pb: 5,
				}}>
				<IconButton
					onClick={() => {
						setResetModalOpen(false);
						smallFlatSound.play();
					}}
					sx={{
						color: theme.palette.text.primary,
						ml: 5,
						position: 'absolute',
						left: 0,
					}}>
					<ClearRounded />
				</IconButton>

				<IconButton
					onClick={handleNewGame}
					sx={{
						color: theme.palette.text.primary,
						mr: 5,
						position: 'absolute',
						right: 0,
					}}>
					<FiberManualRecordOutlined />
				</IconButton>
			</DialogActions>
		</Dialog>
	);
}
