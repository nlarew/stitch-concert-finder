import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  createContext,
} from "react";
import app from "./../stitch/app";
import { getUserProfile } from "./../stitch/mongodb";
import {
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  loginGuestUser
} from "./../stitch/authentication";

const StitchAuthContext = createContext();

// Export a hook that lets us access Stitch auth state anywhere inside of StitchAuthProvider
function useStitchAuth() {
  const context = useContext(StitchAuthContext);
  if (!context) {
    throw new Error(`useStitchAuth must be used within a StitchAuthProvider`);
  }
  return context;
}

// Stitch auth state is accessible anywhere inside of this component
function StitchAuthProvider(props) {
  // Declare auth state and actions
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    isLoggedIn: null,
    currentUserProfile: null
  });
  const actions = useMemo(() => ({
    loginEmailPasswordUser,
    loginFacebookUser,
    loginGoogleUser,
    loginGuestUser
  }), []);
  
  // Update auth state whenever a Stitch auth event occurs
  useStitchAuthListener(async () => {
    const { user, isLoggedIn } = app.auth;
    const currentUserProfile = isLoggedIn ? await getUserProfile(user.id) : null;
    setData({ isLoggedIn, currentUserProfile });
    if (isLoading) {
      setIsLoading(false);
    }
  });

  // Wrap all children in the React Context provider
  const value = useMemo(() => ({isLoading, data, actions }), [
    isLoading,
    data.isLoggedIn,
    data.currentUserProfile,
    actions
  ]);
  return (
    <StitchAuthContext.Provider value={value}>
      {props.children}
    </StitchAuthContext.Provider>
  );
};

function useStitchAuthListener(update) {
  const updateOnAuthEvents = () => {
    const listener = {
      onUserAdded: update,
      onUserLoggedIn: update,
      onUserLoggedOut: update,
      onUserLinked: update,
      onListenerRegistered: update
    };
    app.auth.addAuthListener(listener);
    return () => {
      app.auth.removeAuthListener(listener);
    };
  };
  useEffect(updateOnAuthEvents, []);
}

export { StitchAuthProvider, useStitchAuth }
