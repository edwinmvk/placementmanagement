import React from "react";
import { Routes, Route } from "react-router-dom";
import ContextProvider from "./utils/ContextProvider";
import "./App.css";
import Protected from "./utils/ProtectedRoutes";
import Signin from "./components/signin/Signin";
import AdminSignin from "./components/signin/AdminSignin";
import Admin from "./components/admin/Admin";
import RegisterUser from "./pages/user/RegisterUser/RegisterUser";
import User from "./components/user/User";
import Error404 from "./components/Error404/Error404";

const App = () => {
  return (
    <ContextProvider>
      <div className="App">
        <Routes>
          <Route index element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
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
