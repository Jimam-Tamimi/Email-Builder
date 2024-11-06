import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import authReducer from './slices/authSlice';
import componentsReducer from './slices/componentsSlice';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web

/**
 * Redux store configuration using `redux-toolkit` with `redux-persist` integration.
 * This configuration includes multiple reducers, custom transforms, and persists specific parts 
 * of the Redux state across sessions using localStorage.
 * 
 * @module redux-store
 */

/**
 * Custom transform to control which fields of `componentsSlice` are persisted.
 * This transform ensures only certain fields (like `data`, `editableComponentKeysData`, 
 * and `componentsHistoryState`) are serialized and persisted.
 * 
 * The inbound transformation occurs when data is being persisted, and the outbound 
 * transformation occurs when data is rehydrated (loaded back from storage).
 * 
 * @constant
 * @type {Function}
 */
const componentsTransform = createTransform(
  // Transform state on its way to being serialized and persisted.
  (inboundState: any) => {
    return {
      data: inboundState.data,
      editableComponentKeysData: inboundState.editableComponentKeysData,
      // componentsHistoryState: inboundState.componentsHistoryState,
    };
  },
  
  // Transform state on its way back from being rehydrated.
  (outboundState: any) => {
    // Rehydrate state, setting default values for componentsHistoryState if they aren't present.
    return {
      ...outboundState,
      componentsHistoryState: {
        currentIndex: outboundState.componentsHistoryState?.currentIndex ?? 0,
        componentsHistory: outboundState.componentsHistoryState?.componentsHistory ?? [outboundState.data],
      },
    };
  }, 
  
  // Define which slice this transform applies to. In this case, it applies to the `components` slice.
  { whitelist: ["components"] }
);

/**
 * Redux Persist configuration. This configuration handles the persistence of the Redux state
 * by specifying which storage method to use (localStorage in this case), and applying the custom
 * transform to the `components` slice of the Redux store.
 * 
 * @constant
 * @type {Object}
 */
const persistConfig = {
  key: 'root', // Key used for storing the persisted data.
  storage, // Defines which storage method to use (localStorage by default).
  transforms: [componentsTransform], // Apply the custom transform to the `components` slice.
};

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
 * Type definition for the state produced by the `rootReducer`.
 * This type is inferred using `ReturnType<typeof rootReducer>`.
 * 
 * @type {RootReducerType}
 */
type RootReducerType = ReturnType<typeof rootReducer>;

/**
 * Persisted reducer combines `redux-persist`'s `persistReducer` with the root reducer,
 * enabling the state persistence functionality.
 * 
 * @constant
 * @type {Function}
 */
const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

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
  reducer: persistedReducer, // Apply the persisted reducer to the store.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable check to prevent issues with non-serializable values.
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
