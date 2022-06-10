import { createSlice, createAsyncThunk, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BlobOptions } from "buffer";

const API_URL = '/api/users/';

const user = JSON.parse(localStorage.getItem('user') || '') as User;

export interface UserFormData  {
  name?: String,
  email: String,
  password: String,
}

export interface User {
  _id: String,
  name: String,
  email: String,
}

type UserResponse = User | null;

interface AuthState {
  user?: User | null,
  isLoading: Boolean,
  isSuccess: Boolean,
  isError: Boolean,
  message: String
}

const initialState: AuthState = {
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
}

export const register = createAsyncThunk<
  UserResponse,
  UserFormData,
  {
    rejectValue: String,
  }
>('auth/register', async (user, thunkAPI) => {
  try {
    const { data } = await axios.post<User>(
      API_URL,
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );
    
    if (data) {
      return data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      thunkAPI.rejectWithValue(error.message);
    } else {
      console.error('unexepected error: ', error);
      thunkAPI.rejectWithValue('An unexpected error occured');
    }
  }

  return null;
});

export const login = createAsyncThunk<
  UserResponse,
  UserFormData,
  {
    rejectValue: String,
  }
>('auth/login', async (user, thunkAPI) => {
  try {
    const { data } = await axios.post<User>(
      API_URL + 'login',
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );
    
    if (data) {
      return data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      thunkAPI.rejectWithValue(error.message);
    } else {
      console.error('unexepected error: ', error);
      thunkAPI.rejectWithValue('An unexpected error occured');
    }
  }

  return null;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload || '';
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload || '';
        state.user = null;
      })
  }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;