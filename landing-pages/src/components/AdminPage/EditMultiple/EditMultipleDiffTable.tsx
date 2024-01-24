import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { EntityDiff } from './editMultipleTypes';

export type DiffTableRow = {
  name: string;
  oldValue: string;
  newValue: string;
};

type EditMultipleDiffTableProps = {
  entityDiff: EntityDiff;
};

export default function EditMultipleDiffTable({
  entityDiff,
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
          {Object.keys(entityDiff.oldEntity).map((key) => {
            const oldValue = entityDiff.oldEntity[key];
            const newValue = entityDiff.newEntity[key];
            const isDifferent = oldValue !== newValue;

            if (!isDifferent) {
              return null;
            }

            return (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell sx={{ color: 'gray' }}>{`${oldValue}`}</TableCell>
                <TableCell sx={{ color: isDifferent ? 'green' : 'black' }}>
                  {`${newValue}${
                    key === 'uuid' ? ' (entry will get a new uuid)' : ''
                  }`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
