import axios from 'axios';

export const authServer = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const hrmsServer = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

const attachToken = (config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

authServer.interceptors.request.use(attachToken);
hrmsServer.interceptors.request.use(attachToken);

export const getApiErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (error?.response?.status === 403) {
    return "You don't have permission to perform this action.";
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
};