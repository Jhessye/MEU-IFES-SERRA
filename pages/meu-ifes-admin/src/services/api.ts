import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.2.2:5000', // Ajuste para a URL da sua API Flask
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});