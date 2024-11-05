import api from "@/api/api";
import { setError, setLoading, signInSuccess } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/store";
import { AuthType, SignInFormDataType } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import NProgress from "nprogress";
import { toast } from "react-toastify";

/**
 * Custom hook to handle user sign-in using a mutation.
 *
 * This hook utilizes `useMutation` to perform the sign-in operation and dispatches
 * various actions based on the mutation's lifecycle events.
 *
 * @returns {MutationResult} The result of the mutation, including methods to trigger the mutation and its current state.
 *
 * @example
 * const { mutate: signIn, isLoading, isError, data } = useSignIn();
 *
 * signIn({ username: 'user', password: 'pass' });
 *
 * @remarks
 * - `onMutate`: Dispatches the `setLoading` action to indicate the loading state.
 * - `onSuccess`: Dispatches the `signInSuccess` action with the authentication data and shows a success toast.
 * - `onError`: Dispatches the `setError` action with the error message.
 * - `onSettled`: Dispatches the `setLoading` action to indicate the end of the loading state.
 *
 * @see {@link useAppDispatch} for dispatching actions.
 * @see {@link useMutation} for mutation handling.
 **/

const useSignIn = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: signIn,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (data: AuthType) => {
      dispatch(signInSuccess(data)); // Dispatch sign-in success
      toast.success("Sign In Successful!!");
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        // error shall  be improved
        switch (error.response.status) {
          case 400:
            toast.error("Please check your inputs.");
            break;
          case 401:
            toast.error(
              "Username/Email or Password is incorrect. Please check again."
            );
            break;
          case 403:
            toast.error(
              "Forbidden. You do not have permission to perform this action."
            );
            break;
          case 404:
            toast.error(
              "Not found. The requested resource could not be found."
            );
            break;
          default:
            toast.error("An unexpected error occurred.");
            break;
        }
      }
      dispatch(setError(error.message)); // Dispatch error
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export default useSignIn;

/**
 * Signs in a user with the provided data.
 *
 * This function starts a progress bar, sends a POST request to the "/auth/token/" endpoint
 * with the provided sign-in data, and returns the authentication data if successful.
 * If an error occurs, it logs the error and rethrows it. The progress bar is stopped
 * regardless of the outcome.
 *
 * @param {SignInFormDataType} data - The sign-in form data.
 * @returns {Promise<AuthType>} The authentication data.
 * @throws Will throw an error if the sign-in process fails.
 **/
const signIn = async (data: SignInFormDataType) => {
  NProgress.start();
  try {
    const response = await api.post("/auth/token/", data);
    return response.data as AuthType;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  } finally {
    NProgress.done();
  }
};
