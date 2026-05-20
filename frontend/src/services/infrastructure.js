import api from './api';

export const getInfrastructure = (settlement) => api.get(`/infrastructure?settlement=${settlement}`);
export const createInfrastructure = (data) => api.post('/infrastructure', data);
export const updateInfrastructure = (id, data) => api.put(`/infrastructure/${id}`, data);
export const deleteInfrastructure = (id) => api.delete(`/infrastructure/${id}`);