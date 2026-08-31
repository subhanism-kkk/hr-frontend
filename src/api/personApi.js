import { serverTwo } from './axios';

export const fetchPersons = async (page = 0, size = 10) => {
  const response = await serverTwo.get(`/persons?page=${page}&size=${size}`);
  return response.data;
};

export const fetchPersonById = async (id) => {
  const response = await serverTwo.get(`/persons/${id}`);
  return response.data;
};

export const createPerson = async (data) => {
  const response = await serverTwo.post('/persons', data);
  return response.data;
};

export const updatePerson = async (id, data) => {
  const response = await serverTwo.put(`/persons/${id}`, data);
  return response.data;
};

export const activatePerson = async (id) => {
  const response = await serverTwo.patch(`/persons/${id}/activate`);
  return response.data;
};

export const deactivatePerson = async (id) => {
  const response = await serverTwo.patch(`/persons/${id}/deactivate`);
  return response.data;
};

export const softDeletePerson = async (id) => {
  await serverTwo.delete(`/persons/${id}`);
};

export const restorePerson = async (id) => {
  await serverTwo.patch(`/persons/${id}/restore`);
};