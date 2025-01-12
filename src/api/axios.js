import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  const response = await api.post('/api/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/api/users/logout');
  return response.data;
};

export default api;