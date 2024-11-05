/**
 * Represents a user in the authentication system.
 *
 * @interface UserType
 * @property {number} id - The unique identifier for the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 */
interface UserType {
  id: number;
  username: string;
  email: string;
}

export type AuthType = {
  access: string | null;
  refresh: string | null;
  user: UserType | null;
};

export type SignInFormDataType = {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpFormDataType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};
