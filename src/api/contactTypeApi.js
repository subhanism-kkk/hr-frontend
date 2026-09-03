import { hrmsServer } from './axios';

export const contactTypeApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/contact-types', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/contact-types/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/contact-types/${id}`);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await hrmsServer.get('/contact-types', { params });
    return response.data;
  },

  activate: async (id) => {
    const response = await hrmsServer.patch(`/contact-types/${id}/activate`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await hrmsServer.patch(`/contact-types/${id}/deactivate`);
    return response.data;
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/contact-types/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/contact-types/${id}/restore`);
  },
};