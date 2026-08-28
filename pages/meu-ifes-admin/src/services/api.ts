import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000', // Ex: http://localhost:3000
});

// Interceptor para injetar o Token em TODAS as requisições automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para capturar 401 globalmente e limpar a sessão se o token for inválido
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Opcional: redirecionar para login caso o token expire no uso
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);