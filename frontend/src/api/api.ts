"use client";

import axios from "axios";
import { store } from "@/redux/store";
import { signInSuccess, signOut } from "@/redux/slices/authSlice";
import { AuthType } from "@/types/auth";


const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // Set this in your environment variables
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to attach token dynamically from Redux state
api.interceptors.request.use(
  async (config) => {
    const state = store.getState(); // Access current Redux state
    const auth = state.auth.data; // Get the auth data from Redux

    if (auth?.access) {
      config.headers.Authorization = `JWT ${auth.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if token is expired or request is unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try refreshing the token
      const newAuth = await refreshAuth();
      if (newAuth?.access) {
        // Update Redux state with new tokens
        store.dispatch(signInSuccess(newAuth));

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `JWT ${newAuth.access}`;
        return api(originalRequest);
      } else {
        // Sign out the user and remove tokens if refresh fails
        store.dispatch(signOut());
      }
    }
    return Promise.reject(error);
  }
);

export const refreshAuth = async (): Promise<AuthType | null> => {
  const state = store.getState(); // Access Redux state
  const auth = state.auth; // Get the auth data from Redux

  if (!auth?.data?.access) return null; // If no refresh token, return null

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/account/token/refresh/`,
      { refresh: auth?.data?.refresh }
    );

    const newAuth: AuthType = response.data;

    // Update Redux store with new tokens
    store.dispatch(signInSuccess(newAuth));

    return newAuth; // Return the new authentication data
  } catch (error) {
    // If refresh fails, sign the user out and clear data
    store.dispatch(signOut()); // Dispatch signOut action in Redux
    return null;
  }
};

export default api;
