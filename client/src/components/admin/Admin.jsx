import React from "react";
import Header from "../Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";
import Footer from "./Footer/Footer";

const Admin = () => {
  return (
    <div className="flex flex-col bg-stone-100">
      <div className="h-screen flex flex-row">
        <Sidebar />
        <div className="w-full flex flex-col overflow-y-scroll overflow-x-hidden">
          <Header />
          <Content />
          <div className="h-full mt-3 flex flex-col-reverse border-t-3">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
