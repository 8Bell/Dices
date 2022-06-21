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

function createData(Categories, cat, dog) {
	return { Categories, cat, dog };
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

	const rows = [
		createData('Ace', ace, ''),
		createData('Duces', duce, ''),
		createData('Threes', threes, ''),
		createData('Fours', fours, ''),
		createData('Fives', fives, ''),
		createData('Sixes', sixes, ''),
		createData('SubTotal', subTotal, '0'),
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
						<StyledTableCell align='center'>Cat</StyledTableCell>
						<StyledTableCell align='center'>Dog</StyledTableCell>
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
										color: isFilled[idx]
											? theme.palette.text.secondary
											: theme.palette.action.active,
										fontWeight: isFilled[idx] ? 700 : 400,
									}}>
									{row.cat}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.dog}
								</StyledTableCell>
							</StyledTableRow>
						) : 8 <= idx && idx <= 13 ? (
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
											? theme.palette.text.secondary
											: theme.palette.action.active,
										fontWeight: isFilled[idx] ? 700 : 400,
									}}>
									{row.cat}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.dog}
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
									}}>
									{row.cat}
								</StyledTableCell>
								<StyledTableCell align='center'>
									{row.dog}
								</StyledTableCell>
							</StyledTableRow>
						)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
