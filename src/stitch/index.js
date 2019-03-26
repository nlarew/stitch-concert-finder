import app from "./app";
import { getLocationForAddress, searchNearAddress } from "./functions";
import {
  loginEmailPasswordUser,
  loginFacebookUser,
  handleOAuthRedirects,
  hasLoggedInUser,
  getAllUsers,
  logoutUser,
  useStitchAuth,
} from "./authentication";
import Songkick from "./services/songkick";
import Spotify from "./services/spotify";

export default app;
export {
  loginEmailPasswordUser,
  loginFacebookUser,
  handleOAuthRedirects,
  hasLoggedInUser,
  getAllUsers,
  logoutUser,
  useStitchAuth,
  Songkick,
  Spotify,
  getLocationForAddress,
  searchNearAddress,
};
