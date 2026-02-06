import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import HourglassBottom from '@mui/icons-material/HourglassBottom';

const StatusChip = ({ status }) => (
  <Chip
    label={status || 'En proceso'}
    color={status === 'Completed' ? 'success' : 'warning'}
    size="small"
    icon={status === 'Completed' ? <CheckCircleOutline /> : <HourglassBottom />}
  />
);

const DashboardTable = ({ rows }) => (
  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Máquina</TableCell>
          <TableCell>Turno E1</TableCell>
          <TableCell>Turno E2</TableCell>
          <TableCell>Turno E3</TableCell>
          <TableCell>Turno E4</TableCell>
          <TableCell>Incidentes</TableCell>
          <TableCell>Última finalización</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.machine}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 174, 239, 0.06)'
              }
            }}
          >
            <TableCell>{row.machine}</TableCell>
            <TableCell>
              <StatusChip status={row.shifts.E1} />
            </TableCell>
            <TableCell>
              <StatusChip status={row.shifts.E2} />
            </TableCell>
            <TableCell>
              <StatusChip status={row.shifts.E3} />
            </TableCell>
            <TableCell>
              <StatusChip status={row.shifts.E4} />
            </TableCell>
            <TableCell>{row.incidents}</TableCell>
            <TableCell>{row.lastCompletedAt ? new Date(row.lastCompletedAt).toLocaleString() : '—'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DashboardTable;
