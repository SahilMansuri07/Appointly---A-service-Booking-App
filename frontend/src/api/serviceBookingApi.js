import api from './axios';


//services API
export const serviceListApi = () => api.get('/user/service-list');
export const adminServiceListApi = (params) => api.get('/admin/list-services', { params });
export const createServiceApi = (data) => api.post('/admin/create-service', data);
export const updateServiceApi = (data) => api.patch('/admin/edit-service', data);

//bookAppoinment API
export const bookAppointmentApi = (data) => api.post('/user/book-appointment', data);
export const getAvailableSlotsApi = (data) => api.post('/user/get-available-slots', data);

//appointment API
export const myAppointmentsApi = (params) => api.get('/admin/list-appointments', { params });
export const updateAppointmentStatusApi = (data) => api.patch('/admin/update-appointment-status', data);

//admin API 
export const adminDashboardApi = () => api.get('/admin/dashboard'); 
export const loginApi = (data) => api.post('/auth/login', data);
export const registerApi = (data) => api.post('/auth/sign-up', data);
export const getAdminProfileApi = () => api.get('/auth/profile');
export const updateProfileApi = (data) => api.put('/auth/edit-profile', data);
