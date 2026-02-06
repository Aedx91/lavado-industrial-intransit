import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

export const fetchMachines = () => api.get('/machines');
export const fetchDashboard = (date) => api.get('/dashboard', { params: { date } });
export const submitChecklist = (formData) => api.post('/submissions', formData);

export default api;
