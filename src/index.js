import React, { useState, useEffect } from "react";
import * as R from 'ramda'
import ReactDOM from "react-dom";
import styled from '@emotion/styled'
import app, {
  useStitchAuth,
  // loginEmailPasswordUser,
  // loginFacebookUser,
  // loginGoogleUser,
  loginGuestUser,
  linkEmailPasswordUser,
  linkFacebookUser,
  linkGoogleUser,
  logoutUser,
  handleOAuthRedirects,
  getCurrentUser
} from "./stitch";
import Login, { ConfirmEmail, ResetPassword, LinkLogin } from "./components/Login";
import App from "./components/App";
import Loading from "./components/Loading";
import Profile from "./components/Profile";
import { useVenues } from "./components/Search";
import { Router, Redirect } from "@reach/router";

import AppRouter from './components/AppRouter'

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

handleOAuthRedirects();
// app.auth.logout()
const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
