import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import DashboardTable from '../components/DashboardTable.jsx';
import { fetchDashboard } from '../services/api.js';

const DashboardPage = () => {
  const [date, setDate] = useState('');
  const [rows, setRows] = useState([]);

  const loadDashboard = async (targetDate) => {
    const response = await fetchDashboard(targetDate || undefined);
    setRows(response.data);
  };

  useEffect(() => {
    loadDashboard();
    const socket = io(import.meta.env.VITE_API_SOCKET || 'http://localhost:4000');
    socket.on('submission:created', () => loadDashboard(date));
    return () => socket.disconnect();
  }, [date]);

  return (
    <Card>
      <CardHeader title="Dashboard de Coordinación" subheader="Resumen de limpieza e incidentes" />
      <CardContent>
        <Stack spacing={2}>
          <TextField
            label="Filtrar por fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(event) => {
              const value = event.target.value;
              setDate(value);
              loadDashboard(value);
            }}
          />

          <Typography variant="subtitle2">Incidentes totales: {rows.reduce((sum, row) => sum + row.incidents, 0)}</Typography>

          <DashboardTable rows={rows} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
