import { signOut } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/store";

/**
 * Custom hook that provides a sign-out function.
 *
 * This hook dispatches the sign-out action and redirects the user to the sign-in page.
 *
 * @returns {Function} A function that, when called, signs the user out and redirects to the sign-in page.
 */
const useSignOut = () => {
  const dispatch = useAppDispatch();
  const signOutFn = async () => {
    dispatch(signOut()); // Dispatch sign-out
    window.location.href = "/auth/sign-in"; // Redirect to sign-in page after logout
  };
  return signOutFn;
};

export  default useSignOut