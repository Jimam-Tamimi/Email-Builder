  /**
   * @module user-types
   * 
   * This module contains type definitions related to user authentication, including user data, authentication tokens, 
   * and form data structures for sign-in and sign-up processes.
   */

  /**
   * Represents the structure of a user object.
   * This type is used to store information about a user who has successfully authenticated.
   * 
   * @interface UserType
   * 
   * @property {number} id - The unique identifier for the user.
   * @property {string} username - The username chosen by the user.
   * @property {string} email - The email address associated with the user.
   */
  interface UserType {
    id: number;
    username: string;
    email: string;
  }
  /**
   * Represents the structure of a user object with additional fields.
   * This type is used to store comprehensive information about a user.
   * 
   * @interface UserType
   * 
   * @property {number} id - The unique identifier for the user.
   * @property {string} username - The username chosen by the user.
   * @property {string} email - The email address associated with the user.
   * @property {string} password - The password for the user's account.
   * @property {string} role - The role assigned to the user (e.g., ADMIN, MODERATOR, USER).
   * @property {boolean} is_active - Indicates whether the user's account is active.
   * @property {string} created_at - The timestamp when the user account was created.
   * @property {string} updated_at - The timestamp when the user account was last updated.
   */
  interface UserType {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }
  /**
   * Represents the authentication details for a user.
   * This type holds the tokens used for session management and the user data.
   * 
   * @type AuthType
   * 
   * @property {string | null} access - The access token used to authenticate the user for authorized requests. This can be null if the user is not logged in.
   * @property {string | null} refresh - The refresh token used to renew the access token. This can be null if the user is not logged in.
   * @property {UserType | null} user - The authenticated user's data. This is an object containing user details, or null if no user is logged in.
   */
  export type AuthType = {
    access: string | null;
    refresh: string | null;
    user: UserType | null;
  };

  /**
   * Represents the data structure for a user sign-in form.
   * This type is used to capture user input during the sign-in process.
   * 
   * @type SignInFormDataType
   * 
   * @property {string} usernameOrEmail - The username or email used by the user to log in.
   * @property {string} password - The password the user provides to authenticate.
   * @property {boolean} rememberMe - A flag indicating whether the user wants to be remembered (stay logged in).
   */
  export type SignInFormDataType = {
    usernameOrEmail: string;
    password: string;
    rememberMe: boolean;
  };

  /**
   * Represents the data structure for a user sign-up form.
   * This type is used to capture user input during the sign-up process.
   * 
   * @type SignUpFormDataType
   * 
   * @property {string} firstName - The user's first name.
   * @property {string} lastName - The user's last name.
   * @property {string} username - The username chosen by the user.
   * @property {string} email - The email address provided by the user.
   * @property {string} countryCode - The country code selected by the user for phone number formatting.
   * @property {string} phoneNumber - The user's phone number.
   * @property {string} password - The password the user chooses for their account.
   * @property {string} confirmPassword - A confirmation of the password the user enters to ensure accuracy.
   * @property {boolean} terms - A flag indicating whether the user agrees to the terms and conditions.
   */
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



export type Role = 'ADMIN' | 'MODERATOR' | 'USER';
