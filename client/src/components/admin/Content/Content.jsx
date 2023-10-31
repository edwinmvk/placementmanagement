import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../../../pages/admin/Home/Home";
import ManageStudents from "../../../pages/admin/ManageStudents/ManageStudents";
import NewPlacement from "../../../pages/admin/NewPlacement/NewPlacement";
import Responses from "../../../pages/admin/Responses/Responses";
import EditStatus from "../../../pages/admin/EditStatus/EditStatus";
import Error404 from "../../../pages/Error404/Error404";

const Content = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newplacement" element={<NewPlacement />} />
        <Route path="/responses" element={<Responses />} />
        <Route path="/responses/editstatus/:id" element={<EditStatus />} />
        <Route path="/manage" element={<ManageStudents />} />
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </div>
  );
};

export default Content;
