import { hrmsServer } from './axios';

export const bonusTypeApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/bonus-types', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/bonus-types/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/bonus-types/${id}`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await hrmsServer.get('/bonus-types', { params });
    return response.data;
  },

  getActiveOptions: async () => {
    const response = await hrmsServer.get('/bonus-types/options');
    return response.data;
  },

  activate: async (id) => {
    await hrmsServer.patch(`/bonus-types/${id}/activate`);
  },

  deactivate: async (id) => {
    await hrmsServer.patch(`/bonus-types/${id}/deactivate`);
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/bonus-types/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/bonus-types/${id}/restore`);
  },
};