import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export type DiffTableRow = {
  name: string;
  oldValue: string;
  newValue: string;
};

type EditMultipleDiffTableProps = {
  rows: DiffTableRow[];
};

export default function EditMultipleDiffTable({
  rows,
}: EditMultipleDiffTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="table of differences">
        <TableHead>
          <TableRow>
            <TableCell>Field</TableCell>
            <TableCell>Old value</TableCell>
            <TableCell>New value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ name, newValue, oldValue }) => (
            <TableRow key={name}>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell sx={{ color: 'gray' }}>{oldValue}</TableCell>
              <TableCell sx={{ color: 'green' }}>{newValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
