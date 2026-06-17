import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { bookAppointmentApi, getAvailableSlotsApi } from '../../api/serviceBookingApi';
import { addBookingSchema } from '../../validations/bookingValidation';

export default function BookService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const formik = useFormik({
    initialValues: {
      booking_name: '',
      user_email: '',
      date: '',
    },
    validationSchema: addBookingSchema,
    onSubmit: async (values) => {
      if (!selectedSlot) {
        toast.error('Please select a time slot');
        return;
      }

      setBooking(true);
      try {
        const res = await bookAppointmentApi({
          service_id: id,
          appointment_date: values.date,
          start_time: selectedSlot.start,
          end_time: selectedSlot.end,
          user_name: values.booking_name,
          email: values.user_email,
        });

        if (res?.code === 1) {
          toast.success('Appointment booked successfully');
          setAvailableSlots([]);
          setSelectedSlot(null);
          navigate('/list');
        } else {
          toast.error(res?.message || 'Failed to book appointment');
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
        toast.error(error?.message || 'Failed to book appointment');
      } finally {
        setBooking(false);
      }
    },
  });

  useEffect(() => {
    const date = formik.values.date;
    if (!date) {
      setAvailableSlots([]);
      setSelectedSlot(null);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await getAvailableSlotsApi({ service_id: id, date });
        if (res?.code === 1) {
          setAvailableSlots(Array.isArray(res.data) ? res.data : []);
          setSelectedSlot(null);
        } else {
          setAvailableSlots([]);
          toast.error(res?.message || 'Failed to load available slots');
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
        toast.error('Failed to load available slots');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formik.values.date, id]);

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-3">Book Service</h2>
      <p className="text-muted">Service ID: {id}</p>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${formik.touched.booking_name && formik.errors.booking_name ? 'is-invalid' : ''}`}
            name="booking_name"
            value={formik.values.booking_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your name"
          />
          {formik.touched.booking_name && formik.errors.booking_name && (
            <div className="invalid-feedback">{formik.errors.booking_name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${formik.touched.user_email && formik.errors.user_email ? 'is-invalid' : ''}`}
            name="user_email"
            value={formik.values.user_email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
          />
          {formik.touched.user_email && formik.errors.user_email && (
            <div className="invalid-feedback">{formik.errors.user_email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Select date</label>
          <input
            type="date"
            className={`form-control ${formik.touched.date && formik.errors.date ? 'is-invalid' : ''}`}
            name="date"
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date && (
            <div className="invalid-feedback">{formik.errors.date}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Available slots</label>
          {loadingSlots ? (
            <div className="text-muted">Loading slots...</div>
          ) : availableSlots.length === 0 ? (
            <div className="text-muted">No available slots for the selected date.</div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {availableSlots.map((slot, index) => {
                const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                return (
                  <button
                    type="button"
                    key={`${slot.start}-${slot.end}-${index}`}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.start} - {slot.end}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-success" disabled={booking}>
          {booking ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}