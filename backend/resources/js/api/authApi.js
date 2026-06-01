import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/login', credentials),

  register: (data) => api.post('/register', data),

  logout: () => api.post('/logout'),

  getUser: () => api.get('/user'),
};

export default authApi;
