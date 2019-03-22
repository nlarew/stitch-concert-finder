import React, { useState, useEffect } from "react";
import { Stitch, UserPasswordCredential } from "mongodb-stitch-browser-sdk";
import { config } from "dotenv";
config();

// Get our Stitch application ID (the APP_ID value in our .env file)
const APP_ID = process.env["APP_ID"];
console.log(APP_ID);

// Stitch App Client Setup
const app = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID);

export default app;

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
  return app.auth
    .loginWithCredential(new UserPasswordCredential(email, password))
    .then(stitchUser => {
      console.log(`logged in as: ${email}`);
      return stitchUser;
    });
}

export function hasLoggedInUser() {
  return app.auth.isLoggedIn;
}

export function getAllUsers() {
  // Return a list of all users that are associated with the app
  return app.auth.listUsers();
}

export function removeUserFromApp(stitchUser) {
  // Remove a user from the app (and log them out automatically, if necessary)
  return app.auth.removeUserWithId(stitchUser.id);
}

export function switchToUser(stitchUser) {
  // Set another logged-in user as the active user
  return app.auth.switchToUserWithId(stitchUser.id);
}

export function logoutUser(stitchUser) {
  // Log a user out of the app. Logged out users are still associated with
  // the app and will appear in the result of app.auth.listUsers()
  return app.auth.logoutUserWithId(stitchUser.id);
}

export function isActiveUser(stitchUser) {
  // Return true if the specified user is logged in and currently active
  return app.auth.currentUser && app.auth.currentUser.id === stitchUser.id;
}

export function useStitchAuth() {
  // We'll store the list of users in state
  const [users, setUsers] = useState([]);
  // Whenever some authentication event happens, we want to update our list of users in state.
  // We'll use a Stitch auth listener to call our update function whenever any type of auth event
  // is emitted. We only want to add this listener once (when the component first loads) so we pass
  // an empty dependency array.
  const updateUsers = () => {
    // We'll get a current list of users and update our state with a function
    const appUsers = getAllUsers();
    setUsers(appUsers);
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
    // React hooks can return a "cleanup" function that ties up any loose ends before
    // a component is unmounted. In this case, we want to remove the auth listener
    // we created to prevent a memory leak.
    return () => app.auth.removeAuthListener(listener);
  }, []);

  // We also want a state variable that indicates if ANY user is currently logged in
  const [hasLoggedInUser, setHasLoggedInUser] = useState(app.auth.isLoggedIn);
  const checkForLoggedInUser = () => {
    setHasLoggedInUser(app.auth.isLoggedIn);
  };
  useEffect(checkForLoggedInUser);

  return { users, hasLoggedInUser };
}
