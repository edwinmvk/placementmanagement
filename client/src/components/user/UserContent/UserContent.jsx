import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHome from "../../../pages/User/UserHome/UserHome";
import ForMe from "../../../pages/User/ForMe/ForMe";
import AppliedPlacements from "../../../pages/User/AppliedPlacements/AppliedPlacements";
import Error404 from "../../../pages/Error404/Error404";

const UserContent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/forme" element={<ForMe />} />
        <Route path="/appliedplacements" element={<AppliedPlacements />} />
        <Route path="/*" element={<Error404 />} />
      </Routes>
    </div>
  );
};

export default UserContent;
