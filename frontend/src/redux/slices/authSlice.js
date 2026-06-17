import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../../api/serviceBookingApi';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');



export const authLoginData = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    // console.log("authLoginData Thunk called with data:", data);
    const res = await loginApi(data);
    console.log(res)
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to Login Details');
  }
});

export const authSignUpData = createAsyncThunk('auth/signup', async (data, { rejectWithValue }) => {
  try {
    const res = await registerApi(data);
    return res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to Register Details');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user : user , token : token,  isAuthenticated: !!token },
  reducers: { 
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          },
        },
  extraReducers: (builder) => {
    builder
    .addCase(authLoginData.pending, (state) => {
      state.loading = true;
      state.error = null;
    }
    )
    .addCase(authLoginData.fulfilled, (state, action) => {
      console.log("authSlice Reducers" ,action.payload);
        // console.log("authSlice", action.payload);
        state.loading = false;
        state.user = action.payload.data?.userData;
        state.token = action.payload.data?.token;
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(action.payload.data?.userData));
        localStorage.setItem('token', action.payload.data?.token);
      }
    )
    .addCase(authLoginData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    )
    .addCase(authSignUpData.pending, (state) => {
      state.loading = true;
      state.error = null;
    },
    )
    .addCase(authSignUpData.fulfilled, (state, action) => {
      // console.log("authSignUpData fulfilled", action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data?.user;
        state.token = action.payload.data?.token;
        localStorage.setItem('user', JSON.stringify(action.payload.data?.user));
        localStorage.setItem('token', action.payload.data?.token);
      }
    )
    .addCase(authSignUpData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
