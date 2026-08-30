import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5141/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête sortante
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : si 401 (token expiré ou invalide), rediriger vers le login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper pour extraire les messages d'erreur clairs depuis les réponses de l'API
export const getErrorMessage = (err, defaultMsg = 'Une erreur est survenue.') => {
  if (!err) return defaultMsg;
  if (err.message === 'Network Error' || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
    return 'Impossible de contacter le serveur API backend (http://localhost:5141). Assurez-vous que "dotnet run" est bien lancé dans le dossier GestionCompteurs.API.';
  }
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data.message) return data.message;
    if (data.detail) return data.detail;
    if (data.errors && typeof data.errors === 'object') {
      const errorList = Object.values(data.errors).flat().join('\n');
      if (errorList) return `${data.title || 'Erreur de validation'}:\n${errorList}`;
    }
    if (data.title) return data.title;
  }
  return err.message || defaultMsg;
};

export default api;
