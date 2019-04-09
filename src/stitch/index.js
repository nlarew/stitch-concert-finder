import app from "./app";
import { getLocationForAddress, searchNearAddress } from "./functions";
import {
  confirmEmail,
  getAllUsers,
  handleOAuthRedirects,
  handlePasswordReset,
  hasLoggedInUser,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  logoutUser,
  registerNewEmailUser,
  sendPasswordResetEmail,
  useStitchAuth,
  linkEmailPasswordUser,
  linkFacebookUser,
  linkGoogleUser,
  getCurrentUser,
  loginGuestUser
} from "./authentication";

export default app;
export {
  confirmEmail,
  getAllUsers,
  getCurrentUser,
  getLocationForAddress,
  handleOAuthRedirects,
  handlePasswordReset,
  hasLoggedInUser,
  loginEmailPasswordUser,
  linkEmailPasswordUser,
  loginGuestUser,
  loginFacebookUser,
  linkFacebookUser,
  loginGoogleUser,
  linkGoogleUser,
  logoutUser,
  registerNewEmailUser,
  searchNearAddress,
  sendPasswordResetEmail,
  useStitchAuth,
};
