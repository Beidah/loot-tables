import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

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
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  message: string
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
    rejectValue: string,
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
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let message = '';
      if (error.response && error.response.data) {
        message = (error.response.data as Error).message;
      } else {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(`Error: ${message}`);
    }

    console.error('unexepected error: ', error);
    return thunkAPI.rejectWithValue('An unexpected error occured');
  }
});

export const login = createAsyncThunk<
  UserResponse,
  UserFormData,
  {
    rejectValue: string,
  }
>('auth/login', async (user, thunkAPI) => {
  try {
    const { data, status } = await axios.post<User>(
      API_URL + 'login',
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    );

    if (status === 400) {
      return thunkAPI.rejectWithValue(`Error: ${data}`)
    }
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let message = '';
      if (error.response && error.response.data) {
        message = (error.response.data as Error).message;
      } else {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(`Error: ${message}`);
    }

    console.error('unexepected error: ', error);
    return thunkAPI.rejectWithValue('An unexpected error occured');
  }
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
    },
    logout: (state) => {
      state.user = null;
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
        state.isError = true;
        state.message = action.payload || '';
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action);
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || '';
        state.user = null;
      })
  }
})

export const { reset, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;