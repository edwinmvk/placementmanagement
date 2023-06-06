import React from "react";
import { Routes, Route } from "react-router-dom";
import UserHome from "../../../pages/user/UserHome/UserHome";
import AllPlacements from "../../../pages/user/AllPlacements/AllPlacements";
import ForMe from "../../../pages/user/ForMe/ForMe";
import AppliedPlacements from "../../../pages/user/AppliedPlacements/AppliedPlacements";

const UserContent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/allplacements" element={<AllPlacements />} />
        <Route path="/forme" element={<ForMe />} />
        <Route path="/appliedplacements" element={<AppliedPlacements />} />
      </Routes>
    </div>
  );
};

export default UserContent;
