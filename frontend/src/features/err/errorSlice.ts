import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ErrorState {
  message: string,
}

const initialState: ErrorState = {
  message: '',
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    removeError: (state) => {
      state.message = '';
    }
  }
});

export const { setError, removeError } = errorSlice.actions;
export const selectError = (state: RootState) => state.err.message;
export default errorSlice.reducer;