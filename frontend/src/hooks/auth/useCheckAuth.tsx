import { refreshAuth } from "@/api/api";
import { useRouter } from "@/i18n/routing";
import { signOut } from "@/redux/slices/authSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

/**
 * Checks the validity of a given JWT token.
 *
 * @param {string} token - The JWT token to be checked.
 * @returns {boolean} - Returns `true` if the token is valid (i.e., not expired), otherwise returns `false`.
 */
const checkTokenValidity = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    return expirationTime > Date.now();
  } catch {
    return false;
  }
};

/**
 * Custom hook to check the authentication status of the user.
 *
 * This hook performs the following actions:
 * - Retrieves the current authentication state from the Redux store.
 * - Checks the validity of the access token.
 * - Attempts to refresh the authentication token if the current one is invalid.
 * - Signs out the user if the token is invalid or cannot be refreshed.
 * - Manages a loading state to indicate whether the authentication check is in progress.
 *
 * @returns {boolean} isLoading - A boolean indicating whether the authentication check is still in progress.
 */
const useCheckAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector((state: RootState) => state.auth.data);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkToken = async () => {
      try {
        if (!auth?.access || !checkTokenValidity(auth?.access)) {
          const newAuth = await refreshAuth();
          if (!newAuth?.access || !checkTokenValidity(newAuth?.access)) {
            dispatch(signOut());
          }
        }
      } catch (error) {
        dispatch(signOut());
      } finally {
        setIsLoading(false); // Set loading to false after handling redirect
      }
    };

    checkToken();
  }, [router]);
  return isLoading;
};

export default useCheckAuth;