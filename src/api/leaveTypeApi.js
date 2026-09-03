import { hrmsServer } from './axios';

const getData = (res) => (res && res.data !== undefined ? res.data : res);

export const leaveTypeApi = {
  create: async (data) => {
    const res = await hrmsServer.post('/leave-types', data);
    return getData(res);
  },

  update: async (id, data) => {
    const res = await hrmsServer.put(`/leave-types/${id}`, data);
    return getData(res);
  },

  getById: async (id) => {
    const res = await hrmsServer.get(`/leave-types/${id}`);
    return getData(res);
  },

  getByCode: async (code) => {
    const res = await hrmsServer.get(`/leave-types/code/${code}`);
    return getData(res);
  },

  getAll: async (params = {}) => {
    const res = await hrmsServer.get('/leave-types', { params });
    return getData(res);
  },

  getActiveOptions: async () => {
    const res = await hrmsServer.get('/leave-types', {
      params: { page: 0, size: 1000, status: 'ACTIVE' },
    });
    const data = getData(res);
    
    const list = data?.content || data?.data?.content || data?.data || (Array.isArray(data) ? data : []);
    
    // Safety check for active status
    return list.filter((item) => {
      if (!item) return false;
      const statusCode = typeof item.status === 'object' ? item.status?.code : item.status;
      return !statusCode || statusCode === 'ACTIVE';
    });
  },

  softDelete: async (id) => {
    const res = await hrmsServer.delete(`/leave-types/${id}`);
    return getData(res);
  },

  restore: async (id) => {
    const res = await hrmsServer.patch(`/leave-types/${id}/restore`);
    return getData(res);
  },

  activate: async (id) => {
    const res = await hrmsServer.patch(`/leave-types/${id}/activate`);
    return getData(res);
  },

  deactivate: async (id) => {
    const res = await hrmsServer.patch(`/leave-types/${id}/deactivate`);
    return getData(res);
  },
};