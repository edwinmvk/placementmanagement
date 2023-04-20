import React from "react";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";

const Admin = () => {
  return (
    <div className="flex flex-col">
      <div className="h-screen flex flex-row">
        <Sidebar />
        <div className="w-full flex flex-col overflow-y-scroll overflow-x-hidden">
          <Header />
          <Content />
        </div>
      </div>
    </div>
  );
};

export default Admin;
