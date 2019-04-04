import React, { useState, useEffect } from "react";
import * as R from 'ramda'
import ReactDOM from "react-dom";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  logoutUser,
  handleOAuthRedirects
} from "./stitch";
import Login, { ConfirmEmail, ResetPassword } from "./components/Login";
import App from "./components/App";
import Profile from "./components/Profile";
import { useVenues } from "./components/Search";
import { Router, Redirect } from "@reach/router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

handleOAuthRedirects();

function useFavoritesFirst(currentUserProfile, venues) {
  const [orderedVenues, setOrderedVenues] = useState(venues);
  const favoriteVenues = currentUserProfile ? currentUserProfile.favoriteVenues : []
  const isFavorite = (venue) => currentUserProfile && R.includes(venue.id, currentUserProfile.favoriteVenues)
  function favoritesFirst(a, b) {
    const aFav = isFavorite(a);
    const bFav = isFavorite(b);
    if (aFav && bFav) { return 0 }
    if (!aFav && !bFav) { return 0 }
    if (aFav && !bFav) { return -1 }
    if (!aFav && bFav) { return 1 }
  }
  const orderByFavorites = () => {
    const ordered = R.sort(favoritesFirst, venues.map(venue => ({
      ...venue,
      isFavorite: isFavorite(venue)
    })))
    setOrderedVenues(ordered);
  };
  useEffect(() => {
    orderByFavorites();
  }, [favoriteVenues, venues]);
  return orderedVenues
}

function AppRouter() {
  const {
    hasLoggedInUser,
    currentUserProfile,
    updateCurrentUserProfile
  } = useStitchAuth();

  const venueData = useVenues();
  venueData.orderedVenues = useFavoritesFirst(currentUserProfile, venueData.venues);

  return (
    <Router>
      <Login
        path="/login"
        isLoggedIn={hasLoggedInUser}
        loginEmailPasswordUser={loginEmailPasswordUser}
        loginFacebookUser={loginFacebookUser}
        loginGoogleUser={loginGoogleUser}
      />
      <ConfirmEmail path="/admin/confirmEmail" />
      <ResetPassword path="/admin/resetPassword" />
      {hasLoggedInUser && (
        <App
          path="/app"
          venueData={venueData}
          currentUserProfile={currentUserProfile}
          updateCurrentUserProfile={updateCurrentUserProfile}
          handleLogout={() => logoutUser(app.currentUser)}
        />
      )}
      {hasLoggedInUser && (
        <Profile
          path="/profile"
          venueData={venueData}
          currentUserProfile={currentUserProfile}
          updateCurrentUserProfile={updateCurrentUserProfile}
          handleLogout={() => logoutUser(app.currentUser)}
        />
      )}
      <Redirect from="*" to="/login" noThrow default />
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
