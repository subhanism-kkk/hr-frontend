import axios from 'axios';

// Main HR / Domain Server
export const serverOne = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

// Secondary / Operations Server
export const serverTwo = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
});

// Helper to attach token
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

serverOne.interceptors.request.use(attachToken);
serverTwo.interceptors.request.use(attachToken);