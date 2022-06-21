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
import { blueGrey, lightBlue } from '@mui/material/colors';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.action.disabledBackground,
		color: theme.palette.text,
		fontSize: 18,
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.divider,
	},
	[`&.${tableCellClasses.body}`]: {
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.divider,
		fontSize: 18,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(7)': {
		backgroundColor: theme.palette.action.disabledBackground,
	},
	'&:nth-of-type(8)': {
		backgroundColor: theme.palette.action.disabledBackground,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		backgroundColor: theme.palette.action.disabledBackground,
	},
}));

function createData(Categories, Me, User) {
	return { Categories, Me, User };
}

export default function Score({
	isMobile,
	isFilled,
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
	left,
}) {
	const theme = useTheme();

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
			sx={{ border: '1px solid', borderColor: theme.palette.divider }}>
			<Table sx={{ minWidth: 300 }} size={isMobile ? 'small' : 'medium'}>
				<TableHead>
					<TableRow>
						<StyledTableCell>Categories</StyledTableCell>
						<StyledTableCell align='center'>Me</StyledTableCell>
						<StyledTableCell align='center'>User</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row, idx) =>
						0 <= idx && idx <= 5 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell component='th' scope='row'>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
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
										fontWeight: isFilled[idx] ? 800 : 100,

										color: isFilled[idx]
											? blueGrey[400]
											: scoreArr[idx] >= (idx + 1) * 4
											? blueGrey[50]
											: theme.palette.action.active,

										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] >= (idx + 1) * 4
											? theme.palette.mode === 'dark'
												? blueGrey[800]
												: blueGrey[200]
											: theme.palette.background,
									}}>
									{row.Me}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.User}
								</StyledTableCell>
							</StyledTableRow>
						) : idx === 8 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell component='th' scope='row'>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
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
										fontWeight: isFilled[idx] ? 800 : 100,
										color: isFilled[idx]
											? blueGrey[400]
											: scoreArr[idx] >= 25
											? blueGrey[50]
											: theme.palette.action.active,

										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] >= 25
											? theme.palette.mode === 'dark'
												? blueGrey[800]
												: blueGrey[200]
											: theme.palette.background,

										fontWeight: isFilled[idx] ? 800 : 100,
									}}>
									{row.Me}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.User}
								</StyledTableCell>
							</StyledTableRow>
						) : 9 <= idx && idx < 14 ? (
							<StyledTableRow key={row.Categories}>
								<StyledTableCell component='th' scope='row'>
									{row.Categories}
								</StyledTableCell>
								<StyledTableCell
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
										color: isFilled[idx]
											? blueGrey[400]
											: scoreArr[idx] > 0
											? blueGrey[50]
											: theme.palette.action.active,
										fontWeight: isFilled[idx] ? 800 : 100,
										backgroundColor: isFilled[idx]
											? theme.palette.background
											: scoreArr[idx] > 0
											? theme.palette.mode === 'dark'
												? blueGrey[800]
												: blueGrey[200]
											: theme.palette.background,
									}}>
									{row.Me}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.User}
								</StyledTableCell>
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
												? lightBlue[700]
												: 'default',
									}}>
									{row.Me}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.User}
								</StyledTableCell>
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
												? 'brightness(1.3)'
												: 'brightness(0.97)',
										fontWeight: 500,
										color:
											scoreArr[7] > 0
												? lightBlue[700]
												: 'default',
									}}>
									{row.Me}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.User}
								</StyledTableCell>
							</StyledTableRow>
						)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
