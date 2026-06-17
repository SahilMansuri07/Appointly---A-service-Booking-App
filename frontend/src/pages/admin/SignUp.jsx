import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

import  { authSignUpData } from '../../redux/slices/authSlice';
import { registerSchema } from '../../validations/authValidation';


const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91 (India)' },
  { code: '+1', label: '🇺🇸 +1 (USA)' },
  { code: '+44', label: '🇬🇧 +44 (UK)' },
  { code: '+61', label: '🇦🇺 +61 (Australia)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      country_code: '+91',
      mobile_number: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const { confirm_password, ...payload } = values;
      console.log("Payload for SignUp", payload);

      const result = await dispatch(authSignUpData(payload));

      if (authSignUpData.fulfilled.match(result)) {
        const { code, message, data } = result.payload;

        if (code === 1) {
          toast.success(message || 'Registration Successful');
          navigate('/admin/dashboard');
        } else if (code === 2) {
          if (data && typeof data === 'object') {
            setErrors(data);
          }
          toast.error(message || 'Validation failed');
        } else {
          toast.error(message || 'Registration Failed');
        }
      } else {
        toast.error(result.payload?.message || 'Something went wrong. Please try again.');
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="theme-auth-bg">
      <div
        className="card shadow-sm"
        style={{
          width: '100%',
          maxWidth: '450px',
        }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Create Account</h2>
            <p className="text-muted">Sign up for Linked Out</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            {/* Mobile Number with Country Code */}
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <div className="row g-2">
                <div className="col-4">
                  <select
                    name="country_code"
                    className={`form-select ${formik.touched.country_code && formik.errors.country_code ? 'is-invalid' : ''}`}
                    value={formik.values.country_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {formik.touched.country_code && formik.errors.country_code && (
                    <div className="invalid-feedback">{formik.errors.country_code}</div>
                  )}
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    name="mobile_number"
                    className={`form-control ${formik.touched.mobile_number && formik.errors.mobile_number ? 'is-invalid' : ''}`}
                    placeholder="Enter Mobile Number"
                    value={formik.values.mobile_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.mobile_number && formik.errors.mobile_number && (
                    <div className="invalid-feedback">{formik.errors.mobile_number}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                className={`form-control ${formik.touched.confirm_password && formik.errors.confirm_password ? 'is-invalid' : ''}`}
                placeholder="Confirm Password"
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirm_password && formik.errors.confirm_password && (
                <div className="invalid-feedback">{formik.errors.confirm_password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="btn btn-primary w-100"
            >
              {loading || formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Already have an account?</span>
            <Link to="/login" className="ms-2 text-decoration-none">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}