import React, { useState, useEffect } from "react";
import * as R from "ramda";
import app, {
  linkEmailPasswordUser,
  linkFacebookUser,
  linkGoogleUser,
  logoutUser,
} from "./../stitch";
import Login, {
  ConfirmEmail,
  ResetPassword,
  LinkLogin
} from "./Login";
import App from "./App";
import Loading from "./Loading";
import useAuth from "./../hooks/useAuth";
import useSearch from "./../hooks/useSearch";
import Profile from "./Profile";
import NewMap from "./NewMap";
import { Router, Redirect } from "@reach/router";

function useFavoritesFirst(currentUserProfile, venues) {
  const [orderedVenues, setOrderedVenues] = useState(venues);
  const favoriteVenues = currentUserProfile
    ? currentUserProfile.favoriteVenues
    : [];
  const isFavorite = venue =>
    currentUserProfile &&
    R.includes(venue.id, currentUserProfile.favoriteVenues);
  const favoritesFirst = (a, b) => (isFavorite(a) * -1) + (isFavorite(b) * 1)
  useEffect(() => {
    const orderByFavorites = R.sort(favoritesFirst);
    const ordered = orderByFavorites(
      venues.map(venue => ({
        ...venue,
        isFavorite: isFavorite(venue)
      }))
    );
    setOrderedVenues(ordered);
  }, [favoriteVenues, venues]);
  return orderedVenues;
}

export default function AppRouter() {
  const {
    isLoading,
    data: { isLoggedIn, currentUserProfile },
    actions: {
      loginEmailPasswordUser,
      loginFacebookUser,
      loginGoogleUser,
      loginGuestUser
    }
  } = useAuth(app.auth);
  const setCurrentUserProfile = () => { /*This is a hack*/ }

  return isLoading ? (
    <Loading />
  ) : (
    <Router>
      <Login
        path="/login"
        isLoggedIn={isLoggedIn}
        loginEmailPasswordUser={loginEmailPasswordUser}
        loginFacebookUser={loginFacebookUser}
        loginGoogleUser={loginGoogleUser}
        loginGuestUser={loginGuestUser}
      />
      <ConfirmEmail path="/admin/confirmEmail" />
      <ResetPassword path="/admin/resetPassword" />
      {isLoggedIn && <NewMap path="/app" />}
      <Redirect from="*" to="/login" noThrow default />
    </Router>
  );
}
