import * as Yup from 'yup';

export const serviceSchema = Yup.object().shape({
  service_name: Yup.string()
    .trim()
    .required('Service name is required')
    .min(2, 'Service name must be at least 2 characters'),

  description: Yup.string()
    .trim()
    .optional(),

  duration_minutes: Yup.number()
    .typeError('Duration must be a number')
    .positive('Duration must be a positive number')
    .integer('Duration must be an integer')
    .required('Duration is required'),

  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be a positive number')
    .required('Price is required'),
    
  working_hours: Yup.array().of(
    Yup.object().shape({
        day: Yup.string().required('Day is required'),
        start_time: Yup.string().required('Start time is required'),
        end_time: Yup.string().required('End time is required')
    })
  ).min(1, 'At least one working hour is required')
});
