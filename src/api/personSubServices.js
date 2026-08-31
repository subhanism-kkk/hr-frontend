import axios from 'axios';

const API_BASE = '/api/v1';

// --- Address Info ---
export const addressApi = {
  create: (data) => axios.post(`${API_BASE}/person-addresses`, data),
  update: (id, data) => axios.put(`${API_BASE}/person-addresses/${id}`, data),
  getById: (id) => axios.get(`${API_BASE}/person-addresses/${id}`),
  getAll: (params) => axios.get(`${API_BASE}/person-addresses`, { params }),
  activate: (id) => axios.patch(`${API_BASE}/person-addresses/${id}/activate`),
  deactivate: (id) => axios.patch(`${API_BASE}/person-addresses/${id}/deactivate`),
  softDelete: (id) => axios.delete(`${API_BASE}/person-addresses/${id}`),
  restore: (id) => axios.patch(`${API_BASE}/person-addresses/${id}/restore`),
};

// --- Contact Info ---
export const contactApi = {
  create: (data) => axios.post(`${API_BASE}/person-contacts`, data),
  update: (id, data) => axios.put(`${API_BASE}/person-contacts/${id}`, data),
  getById: (id) => axios.get(`${API_BASE}/person-contacts/${id}`),
  getAll: (params) => axios.get(`${API_BASE}/person-contacts`, { params }),
  activate: (id) => axios.patch(`${API_BASE}/person-contacts/${id}/activate`),
  deactivate: (id) => axios.patch(`${API_BASE}/person-contacts/${id}/deactivate`),
  softDelete: (id) => axios.delete(`${API_BASE}/person-contacts/${id}`),
  restore: (id) => axios.patch(`${API_BASE}/person-contacts/${id}/restore`),
};

// --- Personal Info ---
export const personalInfoApi = {
  create: (data) => axios.post(`${API_BASE}/person-personal-info`, data),
  update: (id, data) => axios.put(`${API_BASE}/person-personal-info/${id}`, data),
  getById: (id) => axios.get(`${API_BASE}/person-personal-info/${id}`),
  getAll: (params) => axios.get(`${API_BASE}/person-personal-info`, { params }),
  activate: (id) => axios.patch(`${API_BASE}/person-personal-info/${id}/activate`),
  deactivate: (id) => axios.patch(`${API_BASE}/person-personal-info/${id}/deactivate`),
  softDelete: (id) => axios.delete(`${API_BASE}/person-personal-info/${id}`),
  restore: (id) => axios.patch(`${API_BASE}/person-personal-info/${id}/restore`),
};

// --- Photo Management ---
export const photoApi = {
  create: (data) => axios.post(`${API_BASE}/person-photos`, data),
  update: (id, data) => axios.put(`${API_BASE}/person-photos/${id}`, data),
  getById: (id) => axios.get(`${API_BASE}/person-photos/${id}`),
  getAll: (params) => axios.get(`${API_BASE}/person-photos`, { params }),
  getMainPhoto: (personId) => axios.get(`${API_BASE}/person-photos/person/${personId}/main`),
  setMainPhoto: (photoId) => axios.patch(`${API_BASE}/person-photos/${photoId}/set-main`),
  activate: (id) => axios.patch(`${API_BASE}/person-photos/${id}/activate`),
  deactivate: (id) => axios.patch(`${API_BASE}/person-photos/${id}/deactivate`),
};