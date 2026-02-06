import { useEffect, useState } from 'react';
import {
  Box,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import ChecklistStepper from '../components/ChecklistStepper.jsx';
import { fetchMachines, submitChecklist } from '../services/api.js';

const shifts = ['E1', 'E2', 'E3', 'E4'];

const FormPage = () => {
  const [machines, setMachines] = useState([]);
  const [machineId, setMachineId] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [shift, setShift] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [hasIncident, setHasIncident] = useState(false);
  const [incidentDescription, setIncidentDescription] = useState('');
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [incidentPhoto, setIncidentPhoto] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    fetchMachines().then((response) => setMachines(response.data));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');
    setErrorMessages([]);

    const formData = new FormData();
    formData.append('machineId', machineId);
    formData.append('workerName', workerName);
    formData.append('shift', shift);
    formData.append('startedAt', startedAt);
    formData.append('finishedAt', finishedAt);
    formData.append('hasIncident', hasIncident);
    formData.append('incidentDescription', incidentDescription);
    checklist.forEach((value, index) => formData.append(`checklist[${index}]`, value));
    if (beforePhoto) formData.append('beforePhoto', beforePhoto);
    if (afterPhoto) formData.append('afterPhoto', afterPhoto);
    if (incidentPhoto) formData.append('incidentPhoto', incidentPhoto);

    try {
      await submitChecklist(formData);
      setStatusMessage('Checklist enviado correctamente.');
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length) {
        setErrorMessages(apiErrors);
      } else {
        setStatusMessage('No se pudo enviar el checklist. Verifique los campos.');
      }
    }
  };

  return (
    <Card>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderBottom: '1px solid rgba(0, 51, 102, 0.1)',
          background: 'linear-gradient(120deg, rgba(0, 51, 102, 0.1), rgba(0, 174, 239, 0.18))'
        }}
      >
        <Stack spacing={1}>
          <Chip label="Lavado Industrial" color="primary" size="small" sx={{ width: 'fit-content' }} />
          <Typography variant="h4">Checklist operativo</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registro en tiempo real para trazabilidad y auditoria.
          </Typography>
        </Stack>
      </Box>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Máquina</InputLabel>
                <Select value={machineId} label="Máquina" onChange={(event) => setMachineId(event.target.value)}>
                  {machines.map((machine) => (
                    <MenuItem key={machine._id} value={machine._id}>
                      {machine.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{machines.length ? 'Selecciona la máquina asignada.' : 'Cargando máquinas...'}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Nombre del trabajador"
                value={workerName}
                onChange={(event) => setWorkerName(event.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Turno</InputLabel>
                <Select value={shift} label="Turno" onChange={(event) => setShift(event.target.value)}>
                  {shifts.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Inicio"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={startedAt}
                onChange={(event) => setStartedAt(event.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fin"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={finishedAt}
                onChange={(event) => setFinishedAt(event.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <ChecklistStepper onChange={setChecklist} />

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle1">Evidencia fotográfica</Typography>
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(event) => setBeforePhoto(event.target.files[0])}
              required
              helperText="Foto obligatoria antes de iniciar"
            />
            <TextField
              type="file"
              inputProps={{ accept: 'image/*' }}
              onChange={(event) => setAfterPhoto(event.target.files[0])}
              helperText="Foto opcional al finalizar"
            />
          </Stack>

          <FormControlLabel
            control={<Switch checked={hasIncident} onChange={(event) => setHasIncident(event.target.checked)} />}
            label="¿Incidente?"
          />
          {hasIncident && (
            <Stack spacing={2}>
              <TextField
                label="Descripción del incidente"
                value={incidentDescription}
                onChange={(event) => setIncidentDescription(event.target.value)}
                fullWidth
                required
              />
              <TextField
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={(event) => setIncidentPhoto(event.target.files[0])}
                required
              />
            </Stack>
          )}

          <Button type="submit" variant="contained" size="large">
            Enviar checklist
          </Button>

          {errorMessages.length > 0 && (
            <Alert severity="error">
              {errorMessages.map((message) => (
                <div key={message}>{message}</div>
              ))}
            </Alert>
          )}
          {statusMessage && <Typography color="secondary">{statusMessage}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormPage;
