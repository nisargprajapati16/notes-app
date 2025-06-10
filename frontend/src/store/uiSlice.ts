import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  viewMode: "grid" | "list";
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  };
}

const initialState: UIState = {
  viewMode: "grid",
  snackbar: {
    open: false,
    message: "",
    severity: "info",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
    showSnackbar(state, action) {
      state.snackbar = { open: true, ...action.payload };
    },
    hideSnackbar(state) {
      state.snackbar.open = false;
    },
  },
});

export const { setViewMode, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
