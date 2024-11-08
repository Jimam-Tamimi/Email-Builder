"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

/**
 * `ReduxProvider` is a React component that wraps the application with both the Redux store and 
 * the Redux Persist gate. This component ensures that the Redux state is properly provided 
 * to the app and persisted across page reloads.
 * 
 * It uses the `Provider` component from the `react-redux` library to make the Redux store available 
 * to the rest of the application. Additionally, it uses `PersistGate` from the `redux-persist` library 
 * to manage the persistence of the Redux store's state across browser sessions.
 * 
 * **Important Notes:**
 * - The `Provider` makes the Redux store accessible to all components in the component tree.
 * - The `PersistGate` ensures that the persisted state from local storage or session storage 
 *   is rehydrated before rendering the application, preventing any issues related to the initial loading 
 *   state when using persisted data.
 * 
 * @component
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will be rendered within the `ReduxProvider`.
 * 
 * @returns {React.ReactNode} The `Provider` and `PersistGate` wrapping the children components.
 * 
 * @example
 * // Wrapping the entire application with Redux and Redux Persist.
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 */
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
