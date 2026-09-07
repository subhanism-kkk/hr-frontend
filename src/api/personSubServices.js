import { hrmsServer } from './axios';

export const addressApi = {
  create: (data) => hrmsServer.post('/person-addresses', data),
  update: (id, data) => hrmsServer.put(`/person-addresses/${id}`, data),
  getById: (id) => hrmsServer.get(`/person-addresses/${id}`),
  getAll: (params) => hrmsServer.get('/person-addresses', { params }),
  activate: (id) => hrmsServer.patch(`/person-addresses/${id}/activate`),
  deactivate: (id) => hrmsServer.patch(`/person-addresses/${id}/deactivate`),
  softDelete: (id) => hrmsServer.delete(`/person-addresses/${id}`),
  restore: (id) => hrmsServer.patch(`/person-addresses/${id}/restore`),
};

export const contactApi = {
  create: (data) => hrmsServer.post('/person-contacts', data),
  update: (id, data) => hrmsServer.put(`/person-contacts/${id}`, data),
  getById: (id) => hrmsServer.get(`/person-contacts/${id}`),
  getAll: (params) => hrmsServer.get('/person-contacts', { params }),
  activate: (id) => hrmsServer.patch(`/person-contacts/${id}/activate`),
  setPrimary: (id) => hrmsServer.patch(`/person-contacts/${id}/primary`),
  deactivate: (id) => hrmsServer.patch(`/person-contacts/${id}/deactivate`),
  softDelete: (id) => hrmsServer.delete(`/person-contacts/${id}`),
  restore: (id) => hrmsServer.patch(`/person-contacts/${id}/restore`),
};

export const personalInfoApi = {
  create: (data) => hrmsServer.post('/person-personal-info', data),
  update: (id, data) => hrmsServer.put(`/person-personal-info/${id}`, data),
  getById: (id) => hrmsServer.get(`/person-personal-info/${id}`),
  getAll: (params) => hrmsServer.get('/person-personal-info', { params }),
  activate: (id) => hrmsServer.patch(`/person-personal-info/${id}/activate`),
  deactivate: (id) => hrmsServer.patch(`/person-personal-info/${id}/deactivate`),
  softDelete: (id) => hrmsServer.delete(`/person-personal-info/${id}`),
  restore: (id) => hrmsServer.patch(`/person-personal-info/${id}/restore`),
};

export const photoApi = {
  create: (data) => hrmsServer.post('/person-photos', data),
  update: (id, data) => hrmsServer.put(`/person-photos/${id}`, data),
  getById: (id) => hrmsServer.get(`/person-photos/${id}`),
  getAll: (params) => hrmsServer.get('/person-photos', { params }),
  getMainPhoto: (personId) => hrmsServer.get(`/person-photos/person/${personId}/main`),
  setMainPhoto: (photoId) => hrmsServer.patch(`/person-photos/${photoId}/set-main`),
  activate: (id) => hrmsServer.patch(`/person-photos/${id}/activate`),
  deactivate: (id) => hrmsServer.patch(`/person-photos/${id}/deactivate`),
  softDelete: (id) => hrmsServer.delete(`/person-photos/${id}`),
  restore: (id) => hrmsServer.patch(`/person-photos/${id}/restore`),
};

export const contactTypeApi = {
  getAll: (params) => hrmsServer.get('/contact-types', { params }),
};
