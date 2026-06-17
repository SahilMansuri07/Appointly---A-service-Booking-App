import * as Yup from 'yup';

export const addBookingSchema = Yup.object().shape({
  booking_name: Yup.string()
    .trim()
    .required('Booking name is required')
    .min(2, 'Booking name must be at least 2 characters'),

  user_email : Yup.string()
    .trim()
    .required('User Email is required')
    .min(2, 'Booking name must be at least 2 characters'),

  date : Yup.date()
    .required('Date is required')
    .nullable(),
});
