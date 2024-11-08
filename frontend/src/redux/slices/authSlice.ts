import { AuthType } from "@/types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import cookieStorage from "../../storage/cookieStorage";

/**
 * Redux slice for managing authentication state in the application.
 * This slice manages the authentication state including user data, loading status, and error messages.
 * It provides actions for signing in, signing out, setting loading state, and handling errors.
 * 
 * @module authSlice
 * 
 * @typedef {Object} AuthState
 * @property {AuthType | null} data - The authentication data (user details and tokens) or null if not authenticated.
 * @property {boolean} loading - A flag indicating whether an authentication request is in progress.
 * @property {string | null} error - Any error message related to authentication, or null if no error.
 * 
 * @example
 * // Example usage in a Redux reducer:
 * const authReducer = authSlice.reducer;
 * 
 * // Dispatching actions
 * dispatch(signInSuccess({ access: 'token', refresh: 'token', user: { id: 1, username: 'user', email: 'user@example.com' } }));
 * dispatch(signOut());
 * 
 * @see {@link https://redux-toolkit.js.org/tutorials/quick-start}
 */

/**
 * Initial state for the `authSlice` reducer. Defines the default values for the authentication state.
 * 
 * @type {AuthState}
 */


/**
 * Represents the authentication state in the Redux store.
 * 
 * @interface AuthState
 * @property {AuthType | null} data - The authentication data, or null if not authenticated.
 * @property {boolean} loading - Indicates whether an authentication request is in progress.
 * @property {string | null} error - The error message, or null if there is no error.
 */
interface AuthState {
  data: AuthType | null;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  data: null, // No user is authenticated initially
  loading: false, // No authentication process is in progress initially
  error: null, // No error initially
};

/**
 * `authSlice` is a Redux slice that contains actions and reducers related to authentication.
 * It manages the authentication state of the app.
 * 
 * Actions provided by this slice:
 * - `signInSuccess`: Handles successful sign-in, storing user data and clearing any error state.
 * - `signOut`: Clears the authentication data, loading state, and error state when the user signs out.
 * - `setError`: Sets an error message and updates the loading state when an error occurs during authentication.
 * - `setLoading`: Sets the loading flag to indicate that an authentication process is ongoing.
 * 
 * The reducer updates the authentication state based on the actions dispatched.
 * 
 * @see {@link https://redux-toolkit.js.org/api/createSlice}
 */
const authSlice = createSlice({
  name: "auth", // The name of the slice, used in actions and reducer
  initialState, // The initial state for the slice
  reducers: {
    /**
     * Action to handle successful sign-in.
     * Updates the state with the authenticated user's data and clears any errors.
     * 
     * @param {AuthState} state - The current state of authentication.
     * @param {PayloadAction<AuthType>} action - The payload containing authentication data.
     * 
     * @example
     * dispatch(signInSuccess({ access: 'token', refresh: 'token', user: { id: 1, username: 'user', email: 'user@example.com' } }));
     */
    signInSuccess(state, action: PayloadAction<AuthType>) {
      state.data = action.payload; // Set user data
      state.loading = false; // Authentication process is complete
      state.error = null; // Clear any previous errors
    },

    /**
     * Action to handle sign-out.
     * Clears the authentication data, loading state, and error state.
     * 
     * @param {AuthState} state - The current state of authentication.
     * 
     * @example
     * dispatch(signOut());
     */
    signOut(state) {
      state.data = null; // Clear user data
      state.loading = false; // Authentication process is complete
      state.error = null; // Clear any previous errors
    },

    /**
     * Action to set an error message when authentication fails.
     * This updates the state with the error message and stops the loading process.
     * 
     * @param {AuthState} state - The current state of authentication.
     * @param {PayloadAction<string>} action - The payload containing the error message.
     * 
     * @example
     * dispatch(setError('Invalid credentials'));
     */
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload; // Set the error message
      state.loading = false; // Authentication process has failed
    },

    /**
     * Action to set the loading state during an authentication process.
     * 
     * @param {AuthState} state - The current state of authentication.
     * @param {PayloadAction<boolean>} action - The payload indicating whether authentication is in progress.
     * 
     * @example
     * dispatch(setLoading(true)); // Indicate that authentication is in progress
     * dispatch(setLoading(false)); // Indicate that authentication is complete
     */
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload; // Set the loading flag based on the action payload
    },
  },
});

// Export actions so they can be used in components or thunks
export const { signInSuccess, signOut, setError, setLoading } = authSlice.actions;

// Export the reducer to be included in the store





 
const authPersistConfig = {
  key: 'auth',
  storage: cookieStorage,
};

export default persistReducer(authPersistConfig, authSlice.reducer);