import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { RootState } from "../../app/store";

const API_URL = '/api/users/';


let user: User | null = null;

// check token validity
const userStored = localStorage.getItem('user');
if (userStored) {
  const { token } = JSON.parse(userStored) as User;
  // check if jwt token is expired
  let { exp } = jwtDecode<JwtPayload>(token);
  if (exp) {
    // exp is in seconds since epoch, while Date wants milliseconds so x1000
    let expired = new Date(exp * 1000);
    let today = new Date();
    if (expired.getTime() < today.getTime()) {
      // token is expired, remove user from localstorage
      localStorage.removeItem('user');
    } else {
      // token is valid.
      user = JSON.parse(userStored) as User;
    }
  }
}

export interface UserFormData  {
  name?: string,
  email: string,
  password: string,
}

export interface User {
  _id: string,
  name: string,
  email: string,
  token: string,
}

type UserResponse = User | null;

interface AuthState {
  user: User | null,
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

    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
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

    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
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
      localStorage.removeItem('user');
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
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserToken = (state: RootState) => state.auth.user?.token;
export default authSlice.reducer;