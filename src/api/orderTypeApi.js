import { hrmsServer } from './axios';

export const orderTypeApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/order-types', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/order-types/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/order-types/${id}`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await hrmsServer.get('/order-types', { params });
    return response.data;
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/order-types/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/order-types/${id}/restore`);
  },
};