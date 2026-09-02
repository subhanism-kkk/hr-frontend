import { hrmsServer } from './axios';

export const statusApi = {
  create: async (data) => {
    const response = await hrmsServer.post('/statuses', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await hrmsServer.put(`/statuses/${id}`, data);
    return response.data;
  },

  getById: async (id) => {
    const response = await hrmsServer.get(`/statuses/${id}`);
    return response.data;
  },

  getAll: async (pageNo = 0, pageSize = 10) => {
    const response = await hrmsServer.get('/statuses', {
      params: {
        pageNo,
        pageSize,
      },
    });

    return response.data;
  },

  softDelete: async (id) => {
    await hrmsServer.delete(`/statuses/${id}`);
  },

  restore: async (id) => {
    await hrmsServer.patch(`/statuses/${id}/restore`);
  },
};