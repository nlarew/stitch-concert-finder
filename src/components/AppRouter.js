import React, { useState, useEffect } from "react";
import * as R from "ramda";
import app, {
  useStitchAuth,
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
import Profile from "./Profile";
import { useVenues } from "./Search";
import { Router, Redirect } from "@reach/router";

function useFavoritesFirst(currentUserProfile, venues) {
  const [orderedVenues, setOrderedVenues] = useState(venues);
  const favoriteVenues = currentUserProfile
    ? currentUserProfile.favoriteVenues
    : [];
  const isFavorite = venue =>
    currentUserProfile &&
    R.includes(venue.id, currentUserProfile.favoriteVenues);
  function favoritesFirst(a, b) {
    const aFav = isFavorite(a);
    const bFav = isFavorite(b);
    if (aFav && bFav) {
      return 0;
    }
    if (!aFav && !bFav) {
      return 0;
    }
    if (aFav && !bFav) {
      return -1;
    }
    if (!aFav && bFav) {
      return 1;
    }
  }
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
    currentUserProfile,
    setCurrentUserProfile,
    isLoadingAuth,
    actions: {
      loginEmailPasswordUser,
      loginFacebookUser,
      loginGoogleUser,
      loginGuestUser
    }
  } = useStitchAuth();
  const hasLoggedInUser = !!currentUserProfile;

  let venueData = useVenues();
  const orderedVenues = useFavoritesFirst(currentUserProfile, venueData.venues);
  venueData = {
    ...venueData,
    orderedVenues
  };

  return isLoadingAuth ? (
    <Loading />
  ) : (
    <Router>
      <Login
        path="/login"
        isLoggedIn={hasLoggedInUser}
        loginEmailPasswordUser={loginEmailPasswordUser}
        loginFacebookUser={loginFacebookUser}
        loginGoogleUser={loginGoogleUser}
        loginGuestUser={loginGuestUser}
      />
      <ConfirmEmail path="/admin/confirmEmail" />
      <ResetPassword path="/admin/resetPassword" />
      {hasLoggedInUser && (
        <App
          path="/app"
          venueData={venueData}
          currentUserProfile={currentUserProfile}
          setCurrentUserProfile={setCurrentUserProfile}
          handleLogout={() => logoutUser(app.currentUser)}
        />
      )}
      {hasLoggedInUser && (
        <Profile
          path="/profile/:userId"
          venueData={venueData}
          currentUserProfile={currentUserProfile}
          setCurrentUserProfile={setCurrentUserProfile}
          handleLogout={() => logoutUser(app.currentUser)}
        />
      )}
      {hasLoggedInUser && (
        <LinkLogin
          path="/profile/link"
          loginEmailPasswordUser={linkEmailPasswordUser}
          loginFacebookUser={linkFacebookUser}
          loginGoogleUser={linkGoogleUser}
        />
      )}
      <Redirect from="*" to="/login" noThrow default />
    </Router>
  );
}
