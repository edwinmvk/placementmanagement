import React from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import Protected from "./ProtectedRoutes";
import Signin from "../components/signin/Signin";
import AdminSignin from "../components/signin/AdminSignin";
import Admin from "../components/admin/Admin";
import Home from "../pages/admin/Home/Home";
import NewPlacement from "../pages/admin/NewPlacement/NewPlacement";
import Responses from "../pages/admin/Responses/Responses";
import ManageStudents from "../pages/admin/ManageStudents/ManageStudents";
import User from "../components/user/User";
import Error404 from "../components/error404/Error404";

const RoutesDef = () => {
  return (
    <Routes>
      <Route index element={<Signin />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signin/admin" element={<AdminSignin />} />
      <Route
        path="/admin/*"
        element={
          <Protected.ProtectedAdmin>
            <Admin />
          </Protected.ProtectedAdmin>
        }
      >
        <Route path="" element={<Home />} />
        <Route path="newplacement" element={<NewPlacement />} />
        <Route path="responses" element={<Responses />} />
        <Route path="manage" element={<ManageStudents />} />
      </Route>
      <Route
        path="/userprofile"
        element={
          <Protected.ProtectedUser>
            <User />
          </Protected.ProtectedUser>
        }
      />
      <Route path="*" element={<Error404></Error404>}></Route>
    </Routes>
  );
};

// const RoutesDef= ()=> {
//   const routes= useRoutes([
//     {
//       path: '/',
//       element: <Signin />
//     },
//     {
//       path: '/signin',
//       element: <Signin />
//     },
//     {
//       path: '/adminlogin',
//       element: <AdminSignin />
//     },
//     {
//       path: '/admin/*',
//       element: <Protected.ProtectedAdmin><Admin /></Protected.ProtectedAdmin>,
//       children: [
//         {
//           path: '',
//           element: <Home />
//         },
//         {
//           path: 'newplacement',
//           element: <NewPlacement />
//         },
//         {
//           path: 'responses',
//           element: <Responses />
//         },
//         {
//           path: 'manage',
//           element: <ManageStudents />
//         }
//       ]
//     },
//     {
//       path: '/userprofile',
//       element: <Protected.ProtectedUser><User /></Protected.ProtectedUser>
//     },
//     {
//       path: '*',
//       element: <Error404 />
//     }
//   ]);

//   return routes;
// };

export default RoutesDef;
