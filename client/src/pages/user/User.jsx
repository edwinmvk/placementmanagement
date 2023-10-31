import React from "react";
import Header from "../../components/Header/Header";
import UserSideBar from "../../components/user/UserSidebar/UserSideBar";
import UserContent from "../../components/user/UserContent/UserContent";
import Footer from "../../components/Footer/Footer";

const User = () => {
  return (
    <div>
      <div className="flex flex-col backdrop-blur	bg-stone-50/60">
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
    </div>
  );
};

export default User;
