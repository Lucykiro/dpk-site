import api from './api';

export const getDocuments = (settlement) => api.get(`/documents?settlement=${settlement}`);
export const createDocument = (data) => api.post('/documents', data);
export const updateDocument = (id, data) => api.put(`/documents/${id}`, data);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);