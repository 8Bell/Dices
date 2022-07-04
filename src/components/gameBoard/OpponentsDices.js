import { AttachFileRounded } from '@mui/icons-material';
import { Paper, styled } from '@mui/material';
import { Box, useTheme } from '@mui/system';
import React from 'react';

export default function OpponentsDices({
	dices,
	left,
	handleHoldDice,
	isHold,
	isTablet,
	isMobile,
	D,
	dl,
	L,
	ll,
}) {
	const Item = styled(Paper)(({ theme }) => ({
		//	backgroundColor: theme.palette.background,
		// border: 'solid 1px',
		borderColor: theme.palette.divider,
		borderRadius: '10%',
		boxShadow: 'none',
		width: '20%',
		textAlign: 'center',
		color: theme.palette.text,
	}));

	const theme = useTheme();

	return (
		<>
			{dices.map((dice, idx) => (
				<Item
					onClick={() => left !== 3 && handleHoldDice(idx)}
					className={isHold[idx] ? 'holdDice' : 'dice'}
					key={idx}
					value={dice}
					sx={{
						position: 'relative',
						bgcolor: 'rgba(0, 0, 0, 0)',
						backgroundImage: 'none',
						minHeight: '30%',
					}}>
					{isHold[idx] && (
						<AttachFileRounded
							sx={{
								position: 'absolute',
								zIndex: 1000,
								top: '-10%',
								left: '50%',
								transform:
									isTablet || isMobile
										? 'translate(-50%, -50%)'
										: 'translate(-55%, -50%)',
								fontSize: isMobile
									? '230%'
									: isTablet
									? '400%'
									: '450%',
								color: theme.palette.text.primary,
								opacity: 0.8,
								rotate: '-15deg',
							}}
						/>
					)}

					<Box
						// src={theme.palette.mode === 'dark' ? dl : ll}
						// alt='preload'

						style={{
							display: 'block',
							paddingBottom: '100%',
							width: '100%',
							//backgroundColor: 'yellow',
							zIndex: 1100,
						}}
					/>
					<img
						src={
							theme.palette.mode === 'light'
								? dice === 'l'
									? dl
									: D[dice]
								: dice === 'l'
								? ll
								: L[dice]
						}
						alt={dice}
						style={{
							position: 'absolute',
							width: '145%',
							height: 'auto',
							top: 0,
							left: 0,
							marginBottom: isMobile
								? '-58%'
								: isTablet
								? '-51%'
								: '-50%',
							transform: isMobile
								? 'translate(-18.3%,-15%)'
								: isTablet
								? 'translate(-18.3%,-15%)'
								: 'translate(-18.3%,-15%)',
							lineHeight: 0,
							zIndex: 999,
						}}
					/>
				</Item>
			))}
		</>
	);
}
