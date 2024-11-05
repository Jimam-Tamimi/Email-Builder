import api from "@/api/api";
import { setError, setLoading, signInSuccess } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/store";
import { AuthType, SignUpFormDataType } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import NProgress from "nprogress";
import { toast } from "react-toastify";

/**
 * Custom hook for handling user sign-up using a mutation.
 *
 * This hook utilizes the `useMutation` hook to manage the sign-up process,
 * including dispatching actions to update the application state and showing
 * notifications based on the mutation's lifecycle events.
 *
 * @returns {MutationResult} The result of the mutation, including methods to trigger the mutation and its current state.
 *
 * @example
 * const { mutate, isLoading, isError, data } = useSignUp();
 *
 * // Trigger the sign-up mutation
 * mutate(signUpData);
 *
 * @remarks
 * This hook dispatches actions to update the loading state, handle success and error scenarios,
 * and reset the loading state once the mutation is settled.
 *
 * @see {@link useMutation} for more details on the mutation hook.
 */

export const useSignUp = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: signUp,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: async (data: AuthType) => {
      dispatch(signInSuccess(data)); // Dispatch sign-in success and passing the response data for singing in
      toast.success("Successfully Created A New Account!");
    },
    onError: (error: AxiosError) => {
      dispatch(setError(error.message)); // Dispatch error
      toast.success("Failed to Created A New Account!");

    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });
};

export default useSignUp;



/**
 * Asynchronously signs up a new user with the provided data.
 * 
 * This function starts a progress indicator, sends a POST request to the 
 * "/auth/users/" endpoint with the provided sign-up data, and returns the 
 * response data. If an error occurs during the request, it logs the error 
 * and rethrows it. The progress indicator is stopped regardless of the 
 * request outcome.
 * 
 * @param {SignUpFormDataType} data - The sign-up form data to be sent in the request.
 * @returns {Promise<any>} The response data from the sign-up request.
 * @throws Will throw an error if the sign-up request fails.
 */
export const signUp = async (data: SignUpFormDataType) => {
  NProgress.start();
  try {
    const response = await api.post("/auth/users/", data);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  } finally {
    NProgress.done();
  }
};
