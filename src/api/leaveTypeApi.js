import { hrmsServer } from './axios';

export const leaveTypeApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/leave-types', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/leave-types/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/leave-types/${id}`);
    return response.data;
  },

  getByCode: async (code) => {
    const response = await hrmsServer.get(`/leave-types/code/${code}`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await hrmsServer.get('/leave-types', { params });
    return response.data;
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/leave-types/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/leave-types/${id}/restore`);
  },
};