import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminServiceListApi, createServiceApi, updateServiceApi } from "../../api/serviceBookingApi";


export const fetchMyService = createAsyncThunk('jobs/fetchMyService', async (data, { rejectWithValue }) => {
  try {
    console.log('Fetching services with params:', data);
    const res = await adminServiceListApi(data);
    console.log(res.data)
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch services');
  }
});

export const createService = createAsyncThunk('jobs/createService', async (data, { rejectWithValue }) => {
  try {
    const res = await createServiceApi(data);
    console.log(res);
    if (res?.code === 1) return res;
    return rejectWithValue(res?.message || 'Failed to create service');
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create service  ');
  }
});

export const updateService = createAsyncThunk('jobs/updateService', async (data, { rejectWithValue }) => {
  try {
    const res = await updateServiceApi(data);
    console.log(res);
    if (res?.code === 1) return res;
    return rejectWithValue(res?.message || 'Failed to update service    ');
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update service');
  }
});


const serviceSlice = createSlice({
    name: 'services',
    initialState : {
    serviceList: [],
    pagination: { page: 1, total: 10, totalPages: 1 },
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    serviceId : null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyService.fulfilled, (state, action) => {
                console.log("Fetched services: ", action.payload);
                state.loading = false;
                state.serviceList = action.payload?.servicesWithWorkingHours || action.payload?.services || [];
                const pg = action.payload?.pagination || {};
                state.pagination = { 
                    page: pg.current_page || 1, 
                    total: pg.total || state.serviceList.length, 
                    totalPages: pg.total_pages || Math.ceil((pg.total || state.serviceList.length) / (pg.per_page || 10)) || 1 
                };
            })
            .addCase(fetchMyService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createService.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createService.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createService.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })
            .addCase(updateService.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateService.fulfilled, (state) => {
                state.updateLoading = false;
            })
            .addCase(updateService.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })
    }   
})


export default serviceSlice.reducer;