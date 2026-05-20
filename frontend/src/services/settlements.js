import api from './api';

export const getSettlementInfo = (settlement) => api.get(`/settlements/${settlement}`);