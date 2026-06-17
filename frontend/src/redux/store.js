import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
// import jobReducer from '../redux/slices/jobSlice';
import appoinmentsSlice from '../redux/slices/appoinmentsSlice';
import serviceReducer from '../redux/slices/ServiceListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // jobs : jobReducer,
    appointments: appoinmentsSlice,
    services: serviceReducer,
  },
});
