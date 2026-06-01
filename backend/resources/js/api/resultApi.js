import api from './axios';

export const resultApi = {
  getAll: (params) => api.get('/results', { params }),

  create: (data) => api.post('/results', data),

  getStudentResults: (studentId) => api.get(`/results/student/${studentId}`),

  getByExam: (examId) => api.get(`/results/exam/${examId}`),
};

export default resultApi;
