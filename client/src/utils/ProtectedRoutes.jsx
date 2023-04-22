import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./ContextProvider";

export const ProtectedAdmin = ({ children }) => {
  const { admin } = useContext(Context);
  if (!admin) {
    return <Navigate to="/signin" replace />;
  }
  return children;
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
