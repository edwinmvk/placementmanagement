import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./Firebase";
import { message } from "antd";
import DomainNames from "../utils/DomainNames.json";

export const Context = createContext(null);

const ContextProvider = ({ children }) => {
  const [isCollapsed, setCollapsed] = useState(false);

  const [unRegisteredGoogleUser, setUnRegisteredGoogleUser] = useState(null);
  const [registeredGoogleUser, setRegisteredGoogleUser] = useState(null);

  // Usually if the user signed out properly, the googleSignInTime will not exist in the local storage
  // Check if the user's signin period is expired when the user login after a long period of time or when the page refreshes
  const storedSignInTime = localStorage.getItem("googleSignInTime");
  if (storedSignInTime) {
    const currentTime = new Date().getTime(); // getTime function converts the data into milliseconds from 1970
    if (currentTime >= parseInt(storedSignInTime)) {
      // we are parsing Int because, the storedSigninTime was converted to string while storing in the session storage
      signOut(auth); // Sign out the user if 5 days have passed
      localStorage.removeItem("googleSignInTime"); // Remove the stored sign-in time
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (signedInUser) => {
      if (signedInUser) {
        checkUser(signedInUser); // this function sends the signedInUser object from firebase to the backend and checks whether the user is registered or not.
      } else {
        setUnRegisteredGoogleUser(null);
        setRegisteredGoogleUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
        hd: "jecc.ac.in",
      });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const googleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("googleSignInTime");
    } catch (error) {
      console.log(error);
    }
  };

  async function checkUser(signedInUser) {
    try {
      const response = await fetch(`${DomainNames.local}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: parseInt(signedInUser.displayName.substring(0, 8)),
        }),
      });
      const data = await response.json();

      if (data === "unregistered") {
        // console.log(data);
        setUnRegisteredGoogleUser(signedInUser);
      } else if (data === "registered") {
        // console.log(data);
        setRegisteredGoogleUser(signedInUser);
      }

      // Each time after the user successfully logs in the login time details are stored in the local storage for 5 days from now
      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

      // Store the sign-in timestamp in local storage
      localStorage.setItem(
        "googleSignInTime",
        fiveDaysLater.getTime().toString()
      );
    } catch (error) {
      googleSignOut(); // signing out is necessary response is not obtained. If we didnt write this function, even though the page is protected and not shown, the user details are stil existing
      console.error(error);
    }
  }

  const [admin, setAdmin] = useState(() => {
    // Load admin from localStorage if it exists and hasn't expired upon refresh
    const adminJson = sessionStorage.getItem("browseradmin");
    if (adminJson) {
      const currentTime = new Date().getTime();
      const { data, adminSignInTime } = JSON.parse(adminJson);
      if (currentTime <= parseInt(adminSignInTime)) {
        return data;
      } else {
        sessionStorage.removeItem("browseradmin"); // remove the browser admin if the session is expired
      }
    }
    return null;
  });

  useEffect(() => {
    // admin contains data only if the login is successful or if the useState puts data in admin from session storage
    if (admin) {
      const tenMinutesLater = new Date();
      tenMinutesLater.setMinutes(tenMinutesLater.getMinutes() + 10);
      sessionStorage.setItem(
        "browseradmin",
        JSON.stringify({
          data: admin,
          adminSignInTime: tenMinutesLater.getTime().toString(),
        })
      );
    }
  }, [admin]);

  const login = async (adminobj) => {
    try {
      if (adminobj) {
        const response = await fetch(`${DomainNames.local}/api/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminobj),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.success(data);
          setAdmin({ username: adminobj.username }); // we only store the username in the context admin
        } else {
          message.error(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setAdmin(null);
    sessionStorage.removeItem("browseradmin");
  };

  return (
    <Context.Provider
      value={{
        admin,
        login,
        logout,
        googleSignIn,
        googleSignOut,
        unRegisteredGoogleUser,
        registeredGoogleUser,
        isCollapsed,
        setCollapsed,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
