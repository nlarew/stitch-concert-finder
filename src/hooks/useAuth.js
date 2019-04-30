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

// Export a hook that lets us access Stitch auth state anywhere inside of StitchAuthProvider
const StitchAuthContext = createContext();
const useStitchAuth = () => useContext(StitchAuthContext);
export default useStitchAuth;

// Stitch auth state is accessible anywhere inside of this component
export const StitchAuthProvider = ({ children }) => {
  // Declare auth state and actions
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    isLoggedIn: null,
    currentUserProfile: null
  });
  const actions = {
    loginEmailPasswordUser,
    loginFacebookUser,
    loginGoogleUser,
    loginGuestUser
  };
  
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
    data.currentUserProfile
  ]);
  return (
    <StitchAuthContext.Provider value={value}>
      {children}
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
