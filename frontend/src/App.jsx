import { Route, Routes, Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import FormPage from './pages/FormPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const App = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/formulario" element={<FormPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/formulario" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
