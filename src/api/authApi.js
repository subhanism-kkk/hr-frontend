import { serverOne } from './axios';

export const loginRequest = async (credentials) => {
  const response = await serverOne.post('/auth/login', credentials);
  return response.data; // Returns token or user details
};