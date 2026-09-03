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

  getActiveOptions: async () => {
    const response = await hrmsServer.get('/order-types/options');
    return response.data;
  },

  activate: async (id) => {
    await hrmsServer.patch(`/order-types/${id}/activate`);
  },

  deactivate: async (id) => {
    await hrmsServer.patch(`/order-types/${id}/deactivate`);
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/order-types/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/order-types/${id}/restore`);
  },
};

// Named export compatibility helper for form drop-downs
export const getOrderTypes = (params) => orderTypeApi.getAll(params);

export default orderTypeApi;