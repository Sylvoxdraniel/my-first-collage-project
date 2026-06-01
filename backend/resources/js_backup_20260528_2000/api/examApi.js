import api from './axios';

export const examApi = {
  getAll: (params) => api.get('/exams', { params }),

  getById: (id) => api.get(`/exams/${id}`),

  create: (data) => api.post('/exams', data),

  update: (id, data) => api.put(`/exams/${id}`, data),

  delete: (id) => api.delete(`/exams/${id}`),
};

export default examApi;
