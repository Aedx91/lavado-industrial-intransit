import { useState } from 'react';
import { Box, Checkbox, FormControlLabel, Step, StepLabel, Stepper, Typography } from '@mui/material';

const steps = [
  {
    title: 'Pre-Limpieza',
    items: [
      'Usar EPP completo',
      'Preparar materiales y químicos',
      'Proteger equipos eléctricos',
      'Barrer sólidos visibles'
    ]
  },
  {
    title: 'Limpieza General',
    items: ['Remover sarro y residuos', 'Lavar superficies', 'Usar herramientas rojas para agua']
  },
  {
    title: 'Actividades Específicas',
    items: ['Limpiar tolvas y empaques', 'Limpiar techos y luminarias', 'Limpiar fregaderos y drenajes']
  },
  {
    title: 'Post-Limpieza',
    items: ['Verificación visual', 'Retirar plásticos', 'Desinfectar herramientas']
  }
];

const ChecklistStepper = ({ onChange }) => {
  const [values, setValues] = useState(steps.flatMap((step) => step.items.map(() => false)));

  const handleToggle = (index) => {
    const updated = [...values];
    updated[index] = !updated[index];
    setValues(updated);
    onChange(updated);
  };

  let offset = 0;

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="subtitle1">Checklist</Typography>
      <Stepper orientation="vertical" nonLinear>
        {steps.map((step) => {
          const startIndex = offset;
          offset += step.items.length;
          return (
            <Step key={step.title} active>
              <StepLabel>{step.title}</StepLabel>
              <Box sx={{ pl: 2, pb: 2 }}>
                {step.items.map((item, itemIndex) => {
                  const index = startIndex + itemIndex;
                  return (
                    <FormControlLabel
                      key={item}
                      control={<Checkbox checked={values[index]} onChange={() => handleToggle(index)} />}
                      label={item}
                    />
                  );
                })}
              </Box>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ChecklistStepper;
