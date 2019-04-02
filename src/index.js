import React from "react";
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
import { Router, Redirect } from "@reach/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

handleOAuthRedirects();

function NotFound() {
  return <div>NOT FOUND</div>;
}

function AppRouter() {
  const {
    hasLoggedInUser,
    currentUserProfile,
    updateCurrentUserProfile
  } = useStitchAuth();
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
      {hasLoggedInUser ? (
        <App
          path="/app"
          handleLogout={() => logoutUser(app.currentUser)}
          currentUserProfile={currentUserProfile}
          updateCurrentUserProfile={updateCurrentUserProfile}
        />
      ) : (
        <Redirect from="/app" to="/login" noThrow />
      )}
      <NotFound default />
    </Router>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
