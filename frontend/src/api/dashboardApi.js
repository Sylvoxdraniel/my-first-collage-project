import api from './axios';

export const dashboardApi = {
  getDashboardStats: () => api.get('/dashboard'),
};

export default dashboardApi;
