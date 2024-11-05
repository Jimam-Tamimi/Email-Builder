import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistStore, persistReducer, createTransform  } from 'redux-persist';
import authReducer from './slices/authSlice';
import componentsReducer from "./slices/componentsSlice";
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // Default is localStorage for web
 

// Transform for persisting only certain fields in componentsSlice
const componentsTransform = createTransform(
  // Transform state on its way to being serialized and persisted.
  (inboundState: any) => {
    return {
      data: inboundState.data,
      editableComponentKeysData: inboundState.editableComponentKeysData,
      componentsHistoryState: inboundState.componentsHistoryState,
    };
  },
  // Transform state on its way back from being rehydrated.
  (outboundState: any) => {
    // Rehydrate state, setting default values for componentsHistoryState if they aren't present
    return {
      ...outboundState,
      componentsHistoryState: {
        currentIndex: outboundState.componentsHistoryState?.currentIndex ?? 0,
        componentsHistory: outboundState.componentsHistoryState?.componentsHistory ?? [outboundState.data],
      },
    };
  },  // Define which slice this transform applies to.
  { whitelist: ["components"] }
);

const persistConfig = {
  key: 'root',
  storage,
  transforms: [componentsTransform], // Use the custom transform here

};

const rootReducer = combineReducers({
  components: componentsReducer,
  auth: authReducer,
});

type RootReducerType = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootReducerType>(persistConfig, rootReducer);

 
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable to prevent issues with non-serializable values
    }),
});
 

// Custom hook to dispatch actions with types
export const useAppDispatch = () => useDispatch<AppDispatch>();


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
