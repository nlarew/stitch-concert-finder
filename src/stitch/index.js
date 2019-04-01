import app from "./app";
import { getLocationForAddress, searchNearAddress } from "./functions";
import {
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  handleOAuthRedirects,
  hasLoggedInUser,
  getAllUsers,
  logoutUser,
  useStitchAuth,
} from "./authentication";

export default app;
export {
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  handleOAuthRedirects,
  hasLoggedInUser,
  getAllUsers,
  logoutUser,
  useStitchAuth,
  getLocationForAddress,
  searchNearAddress,
};
