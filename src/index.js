import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import app, {
  useStitchAuth,
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  logoutUser,
  handleOAuthRedirects,
} from "./stitch";
import Login, { ConfirmEmail, ResetPassword } from "./components/Login";
import App from "./components/App";
import { Router, Redirect, navigate } from "@reach/router"
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import { Button, Input, Label, Form, FormGroup, Card, CardBody } from 'reactstrap'

handleOAuthRedirects();

function MyApp(props) {
  const { hasLoggedInUser, currentUserProfile, updateCurrentUserProfile } = props;
  return hasLoggedInUser ? (
    <App
      handleLogout={() => logoutUser(app.currentUser)}
      currentUserProfile={currentUserProfile}
      updateCurrentUserProfile={updateCurrentUserProfile}
    />
  ) : (
    <Redirect to="/login" noThrow/>
  );
}

function NotFound(props) {
  return (<div>NOT FOUND</div>)
}

function AppRouter(props) {
  const {
    hasLoggedInUser,
    currentUserProfile,
    updateCurrentUserProfile
  } = useStitchAuth();
  if(!hasLoggedInUser) {
    navigate("/login")
  }
  return (
    <Router>
      <Login
        path="/login"
        isLoggedIn={hasLoggedInUser}
        loginEmailPasswordUser={loginEmailPasswordUser}
        loginFacebookUser={loginFacebookUser}
        loginGoogleUser={loginGoogleUser}
      />
      <ConfirmEmail path="/confirmEmail" />
      <ResetPassword path="/resetPassword" />
      <App
        path="/app"
        handleLogout={() => logoutUser(app.currentUser)}
        currentUserProfile={currentUserProfile}
        updateCurrentUserProfile={updateCurrentUserProfile}
      />
      <NotFound default />
    </Router>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
