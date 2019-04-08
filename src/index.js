import React, { useState, useEffect } from "react";
import * as R from 'ramda'
import ReactDOM from "react-dom";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  linkEmailPasswordUser,
  linkFacebookUser,
  linkGoogleUser,
  logoutUser,
  handleOAuthRedirects,
  getCurrentUser
} from "./stitch";
import Login, { ConfirmEmail, ResetPassword, LinkLogin } from "./components/Login";
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
  useEffect(() => {
    const orderByFavorites = R.sort(favoritesFirst)
    const ordered = orderByFavorites(venues.map(venue => ({
      ...venue,
      isFavorite: isFavorite(venue)
    })))
    setOrderedVenues(ordered)
  }, [favoriteVenues, venues]);
  return orderedVenues
}

// class MyAppRouter extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       currentUserProfile: null
//     }
//     this.authListener = {
//       onUserAdded: updateUsers,
//       onUserLoggedIn: updateUsers,
//       onActiveUserChanged: updateUsers,
//       onUserLoggedOut: updateUsers,
//       onUserRemoved: updateUsers,
//       onUserLinked: updateUsers,
//       onListenerRegistered: updateUsers,
//     }
//   }

//   updateUser() {
//     console.log("update");
//     this.setState((state) => ({ ...state,  }))
//     setLoggedInUser(getCurrentUser());
//   }

//   listenForAuth() {
//     app.auth.addAuthListener(this.authListener);
//   }
//   cancelListenForAuth() {
//     app.auth.removeAuthListener(this.authListener);
//   }

//   componentDidMount() {
//     listenForAuth()
//   }
// }

function AppRouter() {
  const { currentUserProfile } = useStitchAuth();
  const hasLoggedInUser = !!currentUserProfile

  let venueData = useVenues();
  const orderedVenues = useFavoritesFirst(currentUserProfile, venueData.venues);
  venueData = {
    ...venueData,
    orderedVenues
  };

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
          handleLogout={() => logoutUser(app.currentUser)}
        />
      )}
      {hasLoggedInUser && (
        <Profile
          path="/profile"
          venueData={venueData}
          currentUserProfile={currentUserProfile}
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

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
