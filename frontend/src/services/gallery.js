import api from './api';

export const getGallery = (settlement) => api.get(`/gallery?settlement=${settlement}`);
export const createGalleryItem = (data) => api.post('/gallery', data);
export const deleteGalleryItem = (id) => api.delete(`/gallery/${id}`);