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
import effectSound from '../../hooks/effectSound';
import { dbService } from '../../fbase';

export default function SurrenderConfirm({
	surrenderModalOpen,
	setSurrenderModalOpen,
	setDices,
	setIsHold,
	setIsFilled,
	setLeft,
	setIsFin,
	setIsStart,
	Eng,
	myUid,
	opponentUid,
	me,
	total,
	setIsWin,
	setSnackBarOpen,
}) {
	//-----------EFFECT SOUNDS-------------//

	const smallFlatSound = effectSound(SmallFlatSound, 1);

	const theme = useTheme();

	const handleClose = () => {
		setSurrenderModalOpen(false);
	};

	//-------SURRENDER DATA -------------//

	//opponentUserData
	// const [opponentData, setOpponentData] = useState({});

	// useEffect(() => {
	// 	dbService
	// 		.collection('users')
	// 		.doc(opponentUid)
	// 		.onSnapshot((snapshot) => {
	// 			setOpponentData(snapshot.data());
	// 		});
	// }, [opponentUid]);

	const handleSurrender = async () => {
		smallFlatSound.play();
		await dbService.collection('users').doc(myUid).update({
			pvp: 'surrender',
		});
		setIsWin(false);
		setIsFin(true);
		setSnackBarOpen(true);
	};

	return (
		<Dialog
			open={surrenderModalOpen}
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
				{Eng ? 'Surrender?' : '항복할까요?'}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.secondary,
				}}>
				<DialogContentText sx={{ mb: 1, mt: 0 }}>
					{Eng
						? [
								// 'Reset the game?',
								// <br />,
								'The data is reflected in the results.',
						  ]
						: [
								// '게임을 재시작할까요?',
								// <br />,
								'데이터는 결과에 반영됩니다.',
						  ]}
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
						setSurrenderModalOpen(false);
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
					onClick={handleSurrender}
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
