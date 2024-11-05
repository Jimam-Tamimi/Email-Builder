"use client";

// Import necessary dependencies
import axios from "axios";
import { store } from "@/redux/store";
import { signInSuccess, signOut } from "@/redux/slices/authSlice";
import { AuthType } from "@/types/auth";

// Initialize an Axios instance to interact with the API
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // Base URL for all API requests, set through environment variable
  headers: {
    "Content-Type": "application/json", // Default header for JSON requests
    Accept: "application/json", // Accepts JSON responses
  },
});

/**
 * Request Interceptor: Adds Authorization header to requests.
 *
 * This interceptor is triggered for every API request and attaches the JWT token
 * dynamically from the Redux store if the user is authenticated.
 *
 * @param {object} config - The Axios request configuration.
 * @returns {object} The updated request configuration with the Authorization header, if a valid token exists.
 * @throws {object} Returns the error if an issue occurs during the request.
 */
api.interceptors.request.use(
  async (config) => {
    // Access the current state from the Redux store
    const state = store.getState();
    const auth = state.auth.data; // Extract the auth data from Redux state

    // If access token exists in the auth data, attach it to the request headers
    if (auth?.access) {
      config.headers.Authorization = `JWT ${auth.access}`; // JWT token attached as Authorization header
    }

    return config; // Return the updated request config
  },
  (error) => Promise.reject(error) // Reject the promise with the error if the request fails
);

/**
 * Response Interceptor: Handles token expiration and automatic token refresh.
 *
 * This interceptor is triggered when a response is received. If the response status is 401 (Unauthorized),
 * it attempts to refresh the access token and retry the original request. If the token refresh fails,
 * it dispatches a sign-out action and removes the user from the Redux state.
 *
 * @param {object} response - The Axios response object.
 * @returns {object} The response if the request was successful.
 * @throws {object} Rejects the promise if the response contains an error or the token refresh fails.
 */
api.interceptors.response.use(
  (response) => response, // Return the response if it is successful
  async (error) => {
    const originalRequest = error.config; // The original request that caused the error

    // Check if the error is due to an expired token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to prevent an infinite loop

      // Attempt to refresh the token
      const newAuth = await refreshAuth();
      if (newAuth?.access) {
        // If a new access token is received, update Redux state and retry the original request
        store.dispatch(signInSuccess(newAuth)); // Dispatch sign-in action to update Redux state

        // Attach the new access token to the original request and resend it
        originalRequest.headers["Authorization"] = `JWT ${newAuth.access}`;
        return api(originalRequest); // Retry the request with the new token
      } else {
        // If the token refresh fails, log the user out and clear authentication data
        store.dispatch(signOut()); // Dispatch sign-out action in Redux to clear auth data
      }
    }

    return Promise.reject(error); // Reject the error if the token refresh was unsuccessful
  }
);

/**
 * refreshAuth: Attempts to refresh the authentication tokens using the refresh token.
 *
 * This function makes a request to the API's token refresh endpoint. If the refresh is successful,
 * the new access token is returned and the Redux state is updated. If the refresh fails, the user is signed out.
 *
 * @returns {Promise<AuthType | null>} The new authentication data, or null if the refresh failed.
 */
export const refreshAuth = async (): Promise<AuthType | null> => {
  // Access the current auth data from Redux state
  const state = store.getState();
  const auth = state.auth; // Extract the auth data from Redux state

  // If there is no access token or refresh token, return null (refresh not possible)
  if (!auth?.data?.access) return null;

  try {
    // Attempt to refresh the token by making a POST request to the API's token refresh endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/account/token/refresh/`,
      { refresh: auth?.data?.refresh } // Send the refresh token to the server for a new access token
    );

    const newAuth: AuthType = response.data; // Extract the new authentication data

    // Update Redux state with the new authentication data (access and refresh tokens)
    store.dispatch(signInSuccess(newAuth));

    return newAuth; // Return the new authentication data
  } catch (error) {
    // If the refresh token request fails, sign out the user and clear the Redux state
    store.dispatch(signOut()); // Dispatch the sign-out action to clear user authentication
    return null; // Return null as refresh failed
  }
};

// Export the configured Axios instance for use in other parts of the application
export default api;
