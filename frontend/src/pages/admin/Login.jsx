import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { authLoginData } from '../../redux/slices/authSlice';
import { loginSchema } from '../../validations/authValidation';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      // console.log("Login Form Values:", values);
      const result = await dispatch(authLoginData(values));

      if (authLoginData.fulfilled.match(result)) {
        const { code, message, data } = result.payload;
        console.log("Login Result:", result.payload);
        if (code === 1) {
            console.log("Login successful, navigating to dashboard...");
            navigate('/admin/dashboard');
            toast.success(message || 'Login Successful');
         } else if (code === 2) {
          if (data && typeof data === 'object') {
            setErrors(data);
          }
          toast.error(message || 'Validation failed');
        } else {
          toast.error(message || 'Login Failed');
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
            <h2 className="fw-bold">Welcome Back</h2>
            <p className="text-muted">Login to Linked Out</p>
          </div>

          <form onSubmit={formik.handleSubmit}>
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

            {/* Password */}
            <div className="mb-4">
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

            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="btn btn-primary w-100"
            >
              {loading || formik.isSubmitting ? 'Signing In...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account?</span>
            <Link to="/signup" className="ms-2 text-decoration-none">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}