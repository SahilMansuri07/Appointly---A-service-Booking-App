import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { myAppointmentsApi, updateAppointmentStatusApi } from "../../api/serviceBookingApi";



export const fetchMyAppointments = createAsyncThunk('jobs/fetchMyAppointments', async (data, { rejectWithValue }) => {
  try {
    // console.log('Fetching appointments with params:', data);
    const res = await myAppointmentsApi(data);
    console.log(res.data)
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch appointments');
  }
});


export const updateAppointmentStatus = createAsyncThunk('appointments/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        // console.log(`Updating appointment ${id} to status: ${status}`);
        const res = await updateAppointmentStatusApi(id, status);
        console.log('Status update response:', res);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update appointment status');
    }
});

const appoinmentsSlice = createSlice({
    name: 'appointments',
    initialState : {
    appointmentsList: [],
    pagination: { page: 1, total: 10, totalPages: 1 },
    loading: false,
    // error: null,
    // updateId : null,
    // updateLoading: false,
    },
    reducers: {
        clearApplyError: (state) => {
            state.applyError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                // console.log(action.payload, "payload")
                state.loading = false;
                state.appointmentsList = action.payload?.appointments || [];
                const pg = action.payload?.pagination || {};
                state.pagination = { page: pg.page || 1, total: pg.total || 0, totalPages: pg.total_pages || 1 };
            })
            .addCase(fetchMyAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAppointmentStatus.pending, (state, action) => {
                state.updateLoading = true;
                state.error = action.payload;
            })
            .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
                // console.log('Status update fulfilled:', action.payload);
                state.updateId = action.payload || null;
                state.updateLoading = false;
            })
            .addCase(updateAppointmentStatus.rejected, (state, action) => {
                state.updateId = null;
                state.updateLoading = false;
                state.error = action.payload;
            });
    }  
})

export const { clearApplyError } = appoinmentsSlice.actions;
export default appoinmentsSlice.reducer;