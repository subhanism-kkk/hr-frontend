import { hrmsServer } from './axios';

export const fetchPersons = async ({
  page = 0,
  size = 10,
  search = '',
  status = '',
  createdFrom = '',
  createdTo = '',
  sort = 'id,asc',
} = {}) => {
  const response = await hrmsServer.get('/persons', {
    params: {
      page,
      size,
      sort,
      ...(search && { search }),
      ...(status && { status }),
      ...(createdFrom && { createdFrom }),
      ...(createdTo && { createdTo }),
    },
  });

  return response.data;
};

export const fetchPersonById = async (id) => {
  const response = await hrmsServer.get(`/persons/${id}`);
  return response.data;
};

export const createPerson = async (data) => {
  const response = await hrmsServer.post('/persons', data);
  return response.data;
};

export const updatePerson = async (id, data) => {
  const response = await hrmsServer.put(`/persons/${id}`, data);
  return response.data;
};

export const activatePerson = async (id) => {
  const response = await hrmsServer.patch(`/persons/${id}/activate`);
  return response.data;
};

export const deactivatePerson = async (id) => {
  const response = await hrmsServer.patch(`/persons/${id}/deactivate`);
  return response.data;
};

export const softDeletePerson = async (id) => {
  await hrmsServer.delete(`/persons/${id}`);
};

export const restorePerson = async (id) => {
  await hrmsServer.patch(`/persons/${id}/restore`);
};
