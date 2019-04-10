/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import {
  AnonymousCredential,
  UserPasswordCredential,
  FacebookRedirectCredential,
  GoogleRedirectCredential,
  UserPasswordAuthProviderClient,
} from "mongodb-stitch-browser-sdk";
import app from "./app";
import { getUserProfile, useWatchUser } from "./mongodb";

export function useStitchAuth() {
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const updateUsers = async () => {
    const currentUser = getCurrentUser()
    const profile = currentUser && await getUserProfile(currentUser.id)
    setCurrentUserProfile(profile)
    if (isLoadingAuth) {
      setIsLoadingAuth(false)
    }
  };
  useEffect(() => {
    const listener = {
      onUserAdded: updateUsers,
      onUserLoggedIn: updateUsers,
      onActiveUserChanged: updateUsers,
      onUserLoggedOut: updateUsers,
      onUserRemoved: updateUsers,
      onUserLinked: updateUsers,
      onListenerRegistered: updateUsers,
    };
    app.auth.addAuthListener(listener);
    return () => { app.auth.removeAuthListener(listener) };
  }, []);

  return {
    currentUserProfile,
    setCurrentUserProfile,
    isLoadingAuth,
    actions: {
      loginEmailPasswordUser,
      loginFacebookUser,
      loginGoogleUser,
      loginGuestUser
    }
  };
}

/* ## Authentication Functions
 *
 * The functions in this section are wrappers that call authentication methods from the
 * Stitch JavaScript SDK. We'll call these methods in the demo react app whenever an
 * "action" button is clicked.
 */
export function loginEmailPasswordUser({ email, password }) {
  // Log in a user with the specified email and password
  // Note: The user must already be registered with the Stitch app.
  // See https://docs.mongodb.com/stitch/authentication/userpass/#create-a-new-user-account
  return app.auth.loginWithCredential(new UserPasswordCredential(email, password))
}

export function loginGuestUser() {
  return app.auth.loginWithCredential(new AnonymousCredential());
}

export function loginFacebookUser() {
  return app.auth.loginWithRedirect(new FacebookRedirectCredential())
}

export function loginGoogleUser() {
  return app.auth.loginWithRedirect(new GoogleRedirectCredential())
}

export function linkEmailPasswordUser({ email, password }) {
  // Log in a user with the specified email and password
  // Note: The user must already be registered with the Stitch app.
  // See https://docs.mongodb.com/stitch/authentication/userpass/#create-a-new-user-account
  return app.auth.user && app.auth.user.linkWithCredential(new UserPasswordCredential(email, password));
}

export function linkFacebookUser() {
  return app.auth.user && app.auth.user.linkUserWithRedirect(new FacebookRedirectCredential())
}

export function linkGoogleUser() {
  return app.auth.user && app.auth.user.linkUserWithRedirect(new GoogleRedirectCredential())
}

export function handleOAuthRedirects() {
  if (app.auth.hasRedirectResult()) {
    app.auth.handleRedirectResult()
  }
}

export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}

export function getAllUsers() {
  // Return a list of all users that are associated with the app
  return app.auth.listUsers();
}

export function getCurrentUser() {
  // Return a list of all users that are associated with the app
  return app.auth.isLoggedIn ? app.auth.user : false;
}

export function logoutUser(stitchUser) {
  // Log a user out of the app. Logged out users are still associated with
  // the app and will appear in the result of app.auth.listUsers()
  return app.auth.logoutUserWithId(stitchUser.id);
}

export function registerNewEmailUser(email, password) {
  // Register a new email/password user and send them a confirmation email
  const emailProvider = app.auth.getProviderClient(UserPasswordAuthProviderClient.factory)
  return emailProvider
    .registerWithEmail(email, password)
    .catch(e => {
      if (
        e.name === "StitchServiceError" &&
        e.message === "name already in use"
      ) {
        console.log("Sending another email confirmation...");
        return emailProvider.resendConfirmationEmail(email);
      } else {
        console.error("Error sending account confirmationn email:", e);
      }
    });
}

function parseToken(url) {
  // Parse the URL query parameters
  const params = new URLSearchParams(url);
  const token = params.get("token");
  const tokenId = params.get("tokenId");
  return { token, tokenId };
}

export function confirmEmail(location) {
  // Confirm the user's email/password account
  const { token, tokenId } = parseToken(location.search);
  return app.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory)
    .confirmUser(token, tokenId)
    .then(() => console.log('confirmed!'))
    .catch(() => console.log('did not confirm!'))
}

export function sendPasswordResetEmail(emailAddress) {
  // Send a password reset email to the specified address
  return app.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory)
    .sendResetPasswordEmail(emailAddress)
    .catch(e => console.error("Error sending password reset email:", e));
}

export function handlePasswordReset(newPassword, location) {
  // Reset a user's password after they click the email link
  const { token, tokenId } = parseToken(location.search)
  return app.auth
    .getProviderClient(UserPasswordAuthProviderClient.factory)
    .resetPassword(token, tokenId, newPassword)
    .catch(err => { console.error("Error resetting password:", err) })
}
