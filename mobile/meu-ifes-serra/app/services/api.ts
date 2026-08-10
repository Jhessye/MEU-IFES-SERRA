import axios from 'axios';

// Substitua pelo IP real do seu PC no wifi
const API_URL = 'http://10.0.2.2:5000'; 

const api = axios.create({
  baseURL: API_URL,
});

export default api;