import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "./ContextProvider";
import { Spin, message } from "antd";

export const ProtectedAdmin = ({ children }) => {
  const { admin, logout } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [serverLost, setServerLost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (serverLost) {
      message.error("Failed to connect to server");
      navigate("/signin");
    }
  }, [serverLost]);

  if (!admin) {
    return <Navigate to="/signin" replace />;
  }

  checkAdminJwt();

  // we also need to check if the jwt token in the cookie is valid
  async function checkAdminJwt() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/admin/checkreloadadminjwt`,
        { credentials: "include" }
      );
      await response.json();
      if (!response.ok) {
        logout();
      } else {
        setLoading(false);
      }
    } catch (error) {
      setServerLost(true);
    }
  }

  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center bg-slate-100">
          <Spin size="large" />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export const ProtectedUserUnregistered = ({ children }) => {
  const { unRegisteredGoogleUser } = useContext(Context);
  if (!unRegisteredGoogleUser) {
    return <Navigate to="/signin" replace />;
  } else {
    return children;
  }
};

export const ProtectedUserRegistered = ({ children }) => {
  const { registeredGoogleUser } = useContext(Context);
  if (!registeredGoogleUser) {
    return <Navigate to="/signin" replace />;
  } else {
    return children;
  }
};

export default {
  ProtectedAdmin,
  ProtectedUserUnregistered,
  ProtectedUserRegistered,
};
