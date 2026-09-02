import { authServer } from './axios';

export const loginRequest = async (credentials) => {
  const response = await authServer.post('/auth/login', credentials);
  return response.data;
};

export const checkAccess = async ({ url, method }) => {
  const response = await authServer.post('/auth/check-access', {
    url,
    method,
  });
  return response.data;
};

export const changeRole = async (userGroupId) => {
  const response = await authServer.post('/auth/change-role', {
    userGroupId,
  });
  return response.data;
};
