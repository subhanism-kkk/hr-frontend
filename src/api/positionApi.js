import { hrmsServer } from './axios';

export const positionApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/positions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/positions/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/positions/${id}`);
    return response.data;
  },

  getAll: async (params) => {
    const response = await hrmsServer.get('/positions', { params });
    return response.data;
  },

  activate: async (id) => {
    const response = await hrmsServer.patch(`/positions/${id}/activate`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await hrmsServer.patch(`/positions/${id}/deactivate`);
    return response.data;
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/positions/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/positions/${id}/restore`);
  },
};