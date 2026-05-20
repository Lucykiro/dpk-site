import api from './api';

export const getPlots = (settlement, filters = {}) => {
  const params = new URLSearchParams({ settlement, ...filters }).toString();
  return api.get(`/plots?${params}`);
};
export const getPlot = (id) => api.get(`/plots/${id}`);
export const createPlot = (data) => api.post('/plots', data);
export const updatePlot = (id, data) => api.put(`/plots/${id}`, data);
export const deletePlot = (id) => api.delete(`/plots/${id}`);