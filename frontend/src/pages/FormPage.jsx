import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
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

  useEffect(() => {
    fetchMachines().then((response) => setMachines(response.data));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage('');

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
      setStatusMessage('No se pudo enviar el checklist. Verifique los campos.');
    }
  };

  return (
    <Card>
      <CardHeader title="Checklist de Lavado Industrial" subheader="Registro en tiempo real" />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Máquina</InputLabel>
            <Select value={machineId} label="Máquina" onChange={(event) => setMachineId(event.target.value)}>
              {machines.map((machine) => (
                <MenuItem key={machine._id} value={machine._id}>
                  {machine.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nombre del trabajador"
            value={workerName}
            onChange={(event) => setWorkerName(event.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Turno</InputLabel>
            <Select value={shift} label="Turno" onChange={(event) => setShift(event.target.value)}>
              {shifts.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Inicio"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={startedAt}
            onChange={(event) => setStartedAt(event.target.value)}
            fullWidth
          />

          <TextField
            label="Fin"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={finishedAt}
            onChange={(event) => setFinishedAt(event.target.value)}
            fullWidth
          />

          <ChecklistStepper onChange={setChecklist} />

          <Typography variant="subtitle1">Evidencia fotográfica</Typography>
          <TextField type="file" inputProps={{ accept: 'image/*' }} onChange={(event) => setBeforePhoto(event.target.files[0])} />
          <TextField type="file" inputProps={{ accept: 'image/*' }} onChange={(event) => setAfterPhoto(event.target.files[0])} />

          <FormControlLabel
            control={<Switch checked={hasIncident} onChange={(event) => setHasIncident(event.target.checked)} />}
            label="¿Incidente?"
          />
          {hasIncident && (
            <>
              <TextField
                label="Descripción del incidente"
                value={incidentDescription}
                onChange={(event) => setIncidentDescription(event.target.value)}
                fullWidth
              />
              <TextField
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={(event) => setIncidentPhoto(event.target.files[0])}
              />
            </>
          )}

          <Button type="submit" variant="contained">
            Enviar checklist
          </Button>

          {statusMessage && <Typography>{statusMessage}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormPage;
