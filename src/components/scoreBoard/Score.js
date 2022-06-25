/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { IconButton } from '@mui/material';
import { HelpRounded } from '@mui/icons-material';

export default function Score({
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
	yachu,
	total,
	left,
}) {
	const theme = useTheme();

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.background.default,
			color: theme.palette.text,
			fontSize: 16,
			borderBottom: '1px solid',
			borderBottomColor: theme.palette.divider,
			lineHeight: isMobile ? '3.9vh' : '2vh',
		},
		[`&.${tableCellClasses.body}`]: {
			borderBottom: '1px solid',
			borderBottomColor: theme.palette.divider,
			fontSize: 16,
			lineHeight: isMobile ? '3.9vh' : '2vh',
		},
	}));

	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(7)': {
			backdropFilter: 'brightness(0.93)',
		},
		'&:nth-of-type(8)': {
			backdropFilter: 'brightness(0.93)',
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			backdropFilter: 'brightness(0.9)',
		},
	}));

	// function createData(Categories, Me, User) {
	// 	return { Categories, Me, User };
	// }

	function createData(Categories, Me) {
		return { Categories, Me };
	}

	const onClick = (idx) => {
		switch (idx) {
			case 0:
				handleFill(0);
				break;
			case 1:
				handleFill(1);
				break;
			case 2:
				handleFill(2);
				break;
			case 3:
				handleFill(3);
				break;
			case 4:
				handleFill(4);
				break;
			case 5:
				handleFill(5);
				break;
			case 8:
				handleFill(8);
				break;
			case 9:
				handleFill(9);
				break;
			case 10:
				handleFill(10);
				break;
			case 11:
				handleFill(11);
				break;
			case 12:
				handleFill(12);
				break;
			case 13:
				handleFill(13);
				break;
			default:
				break;
		}
	};

	const scoreArr = [
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

	const rows = [
		createData('Ace', ace, ''),
		createData('Duces', duce, ''),
		createData('Threes', threes, ''),
		createData('Fours', fours, ''),
		createData('Fives', fives, ''),
		createData('Sixes', sixes, ''),
		createData('SubTotal', `${subTotal} / 63`, '0 / 63'),
		createData('+ 35 Bonus', bonus, '0'),
		createData('Choice ', choice, ''),
		createData('4 of a Kind', fourOfKind, ''),
		createData('Full House', fullHouse, ''),
		createData('S. Straight', sStraght, ''),
		createData('L. Straight', lStraght, ''),
		createData('YACHU', yachu, ''),
		createData('Total', total, '0'),
	];

	return (
		<TableContainer
			component={Paper}
			sx={{
				borderRight: '0.5px solid',
				borderRadius: 0,
				borderColor: theme.palette.divider,
				maxWidth: isMobile ? 'none' : 340,
			}}>
			<Table
				sx={{ minWidth: 300, borderRadius: 0, border: 0 }}
				size={isMobile ? 'small' : 'medium'}>
				<TableHead>
					<TableRow>
						<StyledTableCell>Categories</StyledTableCell>
						<StyledTableCell align='center' sx={{ position: 'relative' }}>
							Score
							<IconButton
								href='https://namu.wiki/w/%EC%9A%94%ED%8A%B8(%EA%B2%8C%EC%9E%84)'
								sx={{
									position: 'absolute',
									right: isMobile ? 30 : 25,
									bottom: isMobile ? 0.4 : 6,
								}}>
								<HelpRounded />
							</IconButton>
						</StyledTableCell>
						{/* <StyledTableCell align='center'>User</StyledTableCell> */}
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, idx) =>
						0 <= idx && idx <= 5 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell
									component='th'
									scope='row'
									sx={{
										bgcolor: theme.palette.background
											.default,
									}}>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
									className={
										scoreArr[idx] >= (idx + 1) * 4 &&
										!isFilled[idx]
											? 'bg'
											: 'none'
									}
									onClick={() =>
										!isFilled[idx] &&
										!dices.includes('l') &&
										left !== 3 &&
										onClick(idx)
									}
									align='center'
									sx={{
										'&:hover': {
											backdropFilter:
												theme.palette.mode ===
												'dark'
													? 'brightness(1.5)'
													: 'brightness(1.05)',
										},
										backdropFilter:
											theme.palette.mode === 'dark'
												? 'brightness(1.3)'
												: 'brightness(0.97)',
										fontWeight: isFilled[idx] ? 800 : 200,

										color: isFilled[idx]
											? theme.palette.text.secondary
											: scoreArr[idx] >= (idx + 1) * 4
											? grey[50]
											: theme.palette.action.active,

										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] >= (idx + 1) * 4
											? theme.palette.mode === 'dark'
												? grey[600]
												: grey[400]
											: theme.palette.background,
										width: '50%',
									}}>
									{row.Me}
								</StyledTableCell>
								{/* <StyledTableCell align='center'>
									{row.User}
								</StyledTableCell> */}
							</StyledTableRow>
						) : idx === 8 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell
									component='th'
									scope='row'
									sx={{
										bgcolor: theme.palette.background
											.default,
									}}>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
									className={
										scoreArr[idx] >= 25 && !isFilled[idx]
											? 'bg'
											: 'none'
									}
									onClick={() =>
										!isFilled[idx] &&
										left !== 3 &&
										onClick(idx)
									}
									align='center'
									sx={{
										'&:hover': {
											backdropFilter:
												theme.palette.mode ===
												'dark'
													? 'brightness(1.5)'
													: 'brightness(1.05)',
										},
										backdropFilter:
											theme.palette.mode === 'dark'
												? 'brightness(1.3)'
												: 'brightness(0.97)',
										fontWeight: isFilled[idx] ? 800 : 200,
										color: isFilled[idx]
											? theme.palette.text.secondary
											: scoreArr[idx] >= 25
											? grey[50]
											: theme.palette.action.active,

										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] >= 25
											? theme.palette.mode === 'dark'
												? grey[600]
												: grey[400]
											: theme.palette.background,
									}}>
									{row.Me}
								</StyledTableCell>
								{/* <StyledTableCell align='center'>
									{row.User}
								</StyledTableCell> */}
							</StyledTableRow>
						) : 9 <= idx && idx < 14 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell
									component='th'
									scope='row'
									sx={{
										bgcolor: theme.palette.background
											.default,
									}}>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
									onClick={() =>
										!isFilled[idx] &&
										left !== 3 &&
										onClick(idx)
									}
									align='center'
									className={
										scoreArr[idx] > 0 && !isFilled[idx]
											? 'bg'
											: 'none'
									}
									sx={{
										'&:hover': {
											backdropFilter:
												theme.palette.mode ===
												'dark'
													? 'brightness(1.5)'
													: 'brightness(1.05)',
										},
										backdropFilter:
											theme.palette.mode === 'dark'
												? 'brightness(1.3)'
												: 'brightness(0.97)',
										color: isFilled[idx]
											? theme.palette.text.secondary
											: scoreArr[idx] > 0
											? grey[50]
											: theme.palette.action.active,
										fontWeight: isFilled[idx] ? 800 : 200,
										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] > 0
											? theme.palette.mode === 'dark'
												? grey[600]
												: grey[300]
											: theme.palette.background,
									}}>
									{row.Me}
								</StyledTableCell>
								{/* <StyledTableCell align='center'>
									{row.User}
								</StyledTableCell> */}
							</StyledTableRow>
						) : idx === 14 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell component='th' scope='row'>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
									align='center'
									sx={{
										backdropFilter:
											theme.palette.mode === 'dark'
												? 'brightness(1.3)'
												: 'brightness(0.97)',
										fontWeight:
											scoreArr[idx] > 200 ? 700 : 500,
										color:
											scoreArr[idx] > 150
												? grey[700]
												: 'default',
									}}>
									{row.Me}
								</StyledTableCell>
								{/* <StyledTableCell align='center'>
									{row.User}
								</StyledTableCell> */}
							</StyledTableRow>
						) : (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell component='th' scope='row'>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
									align='center'
									sx={{
										backdropFilter:
											theme.palette.mode === 'dark'
												? scoreArr[7] > 0
													? 'brightness(1.5)'
													: 'brightness(1.3)'
												: scoreArr[7] > 0
												? 'brightness(0.93)'
												: 'brightness(0.97)',
										fontWeight: 500,
										color:
											scoreArr[7] > 0
												? grey[700]
												: 'default',
									}}>
									{row.Me}
								</StyledTableCell>
								{/* <StyledTableCell align='center'>
									{row.User}
								</StyledTableCell> */}
							</StyledTableRow>
						)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
