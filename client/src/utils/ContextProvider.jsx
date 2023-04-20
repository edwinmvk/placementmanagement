import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./Firebase";

export const Context = createContext(null);

const ContextProvider = ({ children }) => {
  const [isCollapsed, setCollapsed] = useState(false);

  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (signedInUser) => {
      setGoogleUser(signedInUser);
      console.log(signedInUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const [admin, setAdmin] = useState(() => {
    // Load admin from localStorage if it exists and hasn't expired
    const adminJson = localStorage.getItem("browseradmin");
    if (adminJson) {
      const { data, expiry } = JSON.parse(adminJson);
      if (expiry > Date.now()) {
        return data;
      }
    }
    return null;
  });

  // Save admin to localStorage when it changes
  useEffect(() => {
    if (admin) {
      const expiry = Date.now() + 1000 * 60 * 10; // expires in 10 minutes
      localStorage.setItem(
        "browseradmin",
        JSON.stringify({ data: admin, expiry })
      );
    } else {
      localStorage.removeItem("browseradmin");
    }
  }, [admin]);

  const login = (currentAdmin) => {
    setAdmin(currentAdmin);
  };

  const logout = () => {
    setAdmin(null);
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
      hd: "jecc.ac.in",
    });

    signInWithPopup(auth, provider).catch((error) => {
      console.error(error);
    });
  };

  const googleSignOut = () => {
    signOut(auth);
  };

  return (
    <Context.Provider
      value={{
        admin,
        login,
        logout,
        googleSignIn,
        googleSignOut,
        googleUser,
        isCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
