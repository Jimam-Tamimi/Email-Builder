import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import authReducer from './slices/authSlice';
import componentsReducer from './slices/componentsSlice';
import { combineReducers } from 'redux';

 

 
/**
 * Root reducer that combines multiple slice reducers (`components` and `auth` slices).
 * `combineReducers` is used to combine the individual reducers into a single root reducer.
 * 
 * @constant
 * @type {Function}
 */
const rootReducer = combineReducers({
  components: componentsReducer,
  auth: authReducer,
});

 

/**
 * Redux store configuration. It creates the Redux store using `configureStore` from `@reduxjs/toolkit`,
 * which automatically sets up the Redux DevTools extension, enables the Redux Toolkit middleware,
 * and includes the persisted reducer.
 * 
 * The middleware disables the serializable check to allow non-serializable values (like `Date` objects) in the store.
 * 
 * @constant
 * @type {Object}
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
/**
 * Custom hook to dispatch actions with types.
 * This hook wraps the `useDispatch` hook from `react-redux` and ensures proper type safety.
 * 
 * @returns {AppDispatch} A typed version of the `dispatch` function from Redux.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Persistor instance created using `redux-persist`'s `persistStore`.
 * This is used to initialize persistence for the store and manage rehydration.
 * 
 * @constant
 * @type {Object}
 */
export const persistor = persistStore(store);

/**
 * Root state type of the Redux store, inferred from `store.getState`.
 * This type provides access to the full state of the Redux store for type-safe usage.
 * 
 * @type {RootState}
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Dispatch type for the Redux store, inferred from `store.dispatch`.
 * This type is used in the `useAppDispatch` hook to ensure proper type safety when dispatching actions.
 * 
 * @type {AppDispatch}
 */
export type AppDispatch = typeof store.dispatch;
