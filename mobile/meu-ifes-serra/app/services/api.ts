import { create } from 'axios';

// Substitua pelo IP real do seu PC no wifi
const API_URL = 'http://10.0.2.2:5000'; 

const api = create({
  baseURL: API_URL,
  timeout: 8000,
});

export default api;