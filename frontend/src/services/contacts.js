import api from './api';

export const sendContactMessage = (data) => api.post('/contacts', data);
export const getContactMessages = () => api.get('/contacts'); // для админки