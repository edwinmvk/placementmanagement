import React from "react";
import { Routes, Route } from "react-router-dom";
import ContextProvider from "./utils/ContextProvider";
import Protected from "./utils/ProtectedRoutes";
import UserSignin from "./pages/UserSignin/UserSignin";
import AdminSignin from "./pages/AdminSignin/AdminSignin";
import Admin from "./pages/admin/Admin";
import RegisterUser from "./pages/user/RegisterUser/RegisterUser";
import User from "./pages/user/User";
import Error404 from "./pages/Error404/Error404";
import "./App.css";

const App = () => {
  return (
    <ContextProvider>
      <div className="App">
        <Routes>
          <Route index element={<UserSignin />} />
          <Route path="/signin" element={<UserSignin />} />
          <Route path="/adminsignin" element={<AdminSignin />} />
          <Route
            path="/admin/*"
            element={
              <Protected.ProtectedAdmin>
                <Admin />
              </Protected.ProtectedAdmin>
            }
          />
          <Route
            path="/register"
            element={
              <Protected.ProtectedUserUnregistered>
                <RegisterUser />
              </Protected.ProtectedUserUnregistered>
            }
          />
          <Route
            path="/userprofile/*"
            element={
              <Protected.ProtectedUserRegistered>
                <User />
              </Protected.ProtectedUserRegistered>
            }
          />
          <Route path="*" element={<Error404 />}></Route>
        </Routes>
      </div>
    </ContextProvider>
  );
};

export default App;
