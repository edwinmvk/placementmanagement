import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./ContextProvider";
import Domain from "./Domain.json";

export const ProtectedAdmin = ({ children }) => {
  const { admin, logout } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminJwt();
  }, []);

  if (!admin) {
    return <Navigate to="/signin" replace />;
  }

  // we also need to check if the jwt token in the cookie is valid
  async function checkAdminJwt() {
    if (admin) {
      try {
        const response = await fetch(
          `${Domain.serveraddress}/api/admin/checkreloadadminjwt`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) {
          setLoading(true);
          logout();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return <>{loading ? null : children}</>;
};

export const ProtectedUserUnregistered = ({ children }) => {
  const { unRegisteredGoogleUser } = useContext(Context);
  if (!unRegisteredGoogleUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export const ProtectedUserRegistered = ({ children }) => {
  const { registeredGoogleUser } = useContext(Context);
  if (!registeredGoogleUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default {
  ProtectedAdmin,
  ProtectedUserUnregistered,
  ProtectedUserRegistered,
};
