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
} from "./authentication";

export default app;
export {
  confirmEmail,
  getAllUsers,
  getLocationForAddress,
  handleOAuthRedirects,
  handlePasswordReset,
  hasLoggedInUser,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  logoutUser,
  registerNewEmailUser,
  searchNearAddress,
  sendPasswordResetEmail,
  useStitchAuth,
};
