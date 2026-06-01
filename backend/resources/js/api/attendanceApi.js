import api from './axios';

export const attendanceApi = {
  getAll: (params) => api.get('/attendance', { params }),

  markAttendance: (data) => api.post('/attendance', data),

  getByDate: (date, courseId) => api.get('/attendance/by-date', { params: { date, course_id: courseId } }),

  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
};

export default attendanceApi;
