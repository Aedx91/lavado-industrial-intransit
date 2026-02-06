import { Route, Routes, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import FormPage from './pages/FormPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Routes>
          <Route path="/formulario" element={<FormPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/formulario" replace />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;
