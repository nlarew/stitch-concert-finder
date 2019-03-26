import app from "./app";
import { getLocationForAddress, searchNearAddress } from "./functions";
import {
  loginEmailPasswordUser,
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
  hasLoggedInUser,
  getAllUsers,
  logoutUser,
  useStitchAuth,
  Songkick,
  Spotify,
  getLocationForAddress,
  searchNearAddress,
};
