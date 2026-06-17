import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { createService, updateService } from '../../redux/slices/ServiceListSlice';
import { serviceSchema } from '../../validations/serviceValidation';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function AddServiceModal({ serviceToEdit, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(serviceToEdit);

  // Build initial working_hours as a map keyed by day for easy lookup
  const buildInitialWorkingHours = () => {
    // console.log("serviceToEdit:", JSON.stringify(serviceToEdit, null, 2));
    // console.log("working_hours raw:", serviceToEdit?.working_hours);
    return DAYS.map(day => {
      // console.log(`Service to Edit Working Hours:`, serviceToEdit?.working_hours);
      const existing = serviceToEdit?.working_hours?.find(wh => wh.day === day);
      // console.log(`Building working hours for ${day}:`, existing);
      return {
        day,
        enabled: Boolean(existing),
        start_time: existing?.start_time?.slice(0, 5) || '09:00',
        end_time: existing?.end_time?.slice(0, 5) || '17:00',
      };
    });
  };


  const formik = useFormik({
    initialValues: {
      service_name: serviceToEdit?.service_name || '',
      description: serviceToEdit?.description || '',
      duration_minutes: serviceToEdit?.duration_minutes || '',
      price: serviceToEdit?.price || '',
      working_hours: buildInitialWorkingHours(),
    },
    validationSchema: serviceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payloadValues = {
          ...values,
          // Only send enabled days
          working_hours: values.working_hours
            .filter(wh => wh.enabled)
            .map(wh => ({
              day: wh.day,
              start_time: wh.start_time.length === 5 ? `${wh.start_time}:00` : wh.start_time,
              end_time: wh.end_time.length === 5 ? `${wh.end_time}:00` : wh.end_time,
            })),
        };

        let result;
        if (isEditMode) {
          result = await dispatch(updateService({ ...payloadValues, service_id: serviceToEdit.id }));
        } else {
          result = await dispatch(createService(payloadValues));
        }

        if (isEditMode ? updateService.fulfilled.match(result) : createService.fulfilled.match(result)) {
          toast.success(isEditMode ? 'Service updated successfully' : 'Service created successfully');
          onSuccess?.();
          onClose();
        } else {
          toast.error(result.payload || (isEditMode ? 'Failed to update service' : 'Failed to create service'));
        }
      } catch (e) {
        toast.error(e?.message || 'Unexpected error');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={`form-control ${formik.touched[name] && formik.errors[name] ? 'is-invalid' : ''}`}
        {...formik.getFieldProps(name)}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback">{formik.errors[name]}</div>
      )}
    </div>
  );

  const toggleDay = (index) => {
    formik.setFieldValue(`working_hours[${index}].enabled`, !formik.values.working_hours[index].enabled);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title fw-bold">{isEditMode ? 'Edit Service' : 'Add New Service'}</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={formik.isSubmitting} />
          </div>

          <div className="modal-body">
            <form onSubmit={formik.handleSubmit} id="addServiceForm">
              {field('service_name', 'Service Name', 'text', 'e.g. Haircut')}
              {field('price', 'Price', 'number', 'e.g. 450.00')}
              {field('duration_minutes', 'Duration (Minutes)', 'number', 'e.g. 60')}

              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the service..."
                  className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                  {...formik.getFieldProps('description')}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="invalid-feedback">{formik.errors.description}</div>
                )}
              </div>

              <label className="form-label fw-semibold mb-2">Working Hours</label>

              {typeof formik.errors.working_hours === 'string' && (
                <div className="text-danger small mb-2">{formik.errors.working_hours}</div>
              )}

              {formik.values.working_hours.map((slot, index) => (
                <div key={slot.day} className="row g-2 mb-2 align-items-center">
                  {/* Checkbox + Day label */}
                  <div className="col-4 d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      id={`day-check-${index}`}
                      checked={slot.enabled}
                      onChange={() => toggleDay(index)}
                    />
                    <label
                      htmlFor={`day-check-${index}`}
                      className="mb-0 text-capitalize"
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)}
                    </label>
                  </div>

                  {/* Start time */}
                  <div className="col-4">
                    <input
                      type="time"
                      disabled={!slot.enabled}
                      className={`form-control ${
                        formik.touched.working_hours?.[index]?.start_time &&
                        formik.errors.working_hours?.[index]?.start_time ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps(`working_hours[${index}].start_time`)}
                    />
                  </div>

                  {/* End time */}
                  <div className="col-4">
                    <input
                      type="time"
                      disabled={!slot.enabled}
                      className={`form-control ${
                        formik.touched.working_hours?.[index]?.end_time &&
                        formik.errors.working_hours?.[index]?.end_time ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps(`working_hours[${index}].end_time`)}
                    />
                  </div>
                </div>
              ))}
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={formik.isSubmitting}>
              Cancel
            </button>
            <button type="submit" form="addServiceForm" className="btn btn-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  {isEditMode ? 'Saving…' : 'Creating…'}
                </>
              ) : (
                isEditMode ? 'Save Changes' : 'Create Service'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}


