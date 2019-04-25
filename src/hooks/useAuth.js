import React, { useState, useEffect } from 'react';
import { getUserProfile } from "./../stitch/mongodb";
import {
  loginEmailPasswordUser,
  loginFacebookUser,
  loginGoogleUser,
  loginGuestUser
} from "./../stitch/authentication";

export default function useAuth(stitchAuth) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    isLoggedIn: null,
    currentUserProfile: null
  });

  const update = async () => {
    const { user, isLoggedIn } = stitchAuth;
    const currentUserProfile = isLoggedIn ? await getUserProfile(user.id) : null;
    setData({ isLoggedIn, currentUserProfile });
    if(isLoading) {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const listener = {
      onUserAdded: update,
      onUserLoggedIn: update,
      onUserLoggedOut: update,
      onUserLinked: update,
      onListenerRegistered: update
    };
    stitchAuth.addAuthListener(listener);
    return () => {
      stitchAuth.removeAuthListener(listener);
    };
  }, []);

  return {
    data,
    isLoading,
    actions: {
      loginEmailPasswordUser,
      loginFacebookUser,
      loginGoogleUser,
      loginGuestUser
    }
  };
}
