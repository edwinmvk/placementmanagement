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

export const ProtectedUser = ({ children }) => {
  const { googleUser } = useContext(Context);
  if (!googleUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default { ProtectedAdmin, ProtectedUser };
