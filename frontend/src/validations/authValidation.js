import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export const registerSchema = Yup.object({
  name: Yup.string().min(2, 'Min 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  country_code: Yup.string().required('Country code is required'),
  mobile_number: Yup.string().matches(/^(|[0-9]{10})$/, 'Enter a valid 10-digit phone number').nullable(),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password required'),
  newPassword: Yup.string().min(6, 'Min 6 characters').required('New password required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm password'),
});
