import { createSlice, createAsyncThunk, ThunkAction } from "@reduxjs/toolkit";
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
  User,
  UserFormData,
  {
    rejectValue: String,
  }
>('auth/register', async (user, thunkAPI) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (response.status === 400) {
    return thunkAPI.rejectWithValue((await response.json()));
  }

  return (await response.json()) as User;
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
      })
  }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;