import { AuthType } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
  data: AuthType | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<AuthType>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    signOut(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { signInSuccess, signOut, setError, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
