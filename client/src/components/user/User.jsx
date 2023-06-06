import React from "react";
import Header from "../admin/Header/Header";
import UserSideBar from "./UserSidebar/UserSideBar";
import UserContent from "./UserContent/UserContent";
import Footer from "../admin/Footer/Footer";

const User = () => {
  return (
    <div className="flex flex-col bg-stone-100">
      <div className="h-screen flex flex-row">
        <UserSideBar />
        <div className="w-full flex flex-col overflow-y-scroll overflow-x-hidden">
          <Header />
          <UserContent />
          <div className="h-full mt-3 flex flex-col-reverse border-t-3">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
