import * as React from 'react';
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
		fontSize: 16,
		borderBottom: '1px solid',
		borderBottomColor: theme.palette.divider,
		height: '10px',
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

const rows = [
	createData('Ace', 159, 6.0),
	createData('Duces', 237, 9.0),
	createData('Threes', 262, 16.0),
	createData('Fours', 305, 3.7),
	createData('Fives', 356, 16.0),
	createData('Sixes', 356, 16.0),
	createData('Subtotal', 356, 16.0),
	createData('+ 35 Bonus', 356, 16.0),
	createData('Choice ', 356, 16.0),
	createData('4 of a Kind', 356, 16.0),
	createData('Full House', 356, 16.0),
	createData('S. Straight', 356, 16.0),
	createData('L. Straight', 356, 16.0),
	createData('YACHU', 356, 16.0),
	createData('Total', 356, 16.0),
];

export default function Score({ isMobile }) {
	const theme = useTheme();
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
					{rows.map((row) => (
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
								}}>
								{row.cat}
							</StyledTableCell>
							<StyledTableCell align='center'>
								{row.dog}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
