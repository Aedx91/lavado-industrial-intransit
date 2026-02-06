import { useEffect, useState } from 'react';
import { Card, CardContent, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
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

  const totalIncidents = rows.reduce((sum, row) => sum + row.incidents, 0);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Chip label="Coordinacion" color="secondary" size="small" sx={{ width: 'fit-content' }} />
            <Typography variant="h4">Dashboard de control</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Estado por turno, incidentes y ultimas finalizaciones.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Incidentes totales
                </Typography>
                <Typography variant="h5">{totalIncidents}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha activa
                </Typography>
                <Typography variant="h6">{date || 'Hoy'}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registros visibles
                </Typography>
                <Typography variant="h6">{rows.length}</Typography>
              </Card>
            </Grid>
          </Grid>

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
            sx={{ maxWidth: 260 }}
          />

          <DashboardTable rows={rows} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
