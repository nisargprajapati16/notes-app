import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { showSnackbar } from "./uiSlice";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  checkedSession: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  checkedSession: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      if (action.payload) {
        // @ts-ignore
        window.__REDUX_STORE__?.dispatch?.(
          showSnackbar({ message: action.payload, severity: "error" })
        );
      }
    },
    logout(state) {
      state.user = null;
    },
    setCheckedSession(state, action: PayloadAction<boolean>) {
      state.checkedSession = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, logout, setCheckedSession } =
  authSlice.actions;
export default authSlice.reducer;
