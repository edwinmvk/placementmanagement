import React from "react";
import Header from "../Header/Header";
import UserSideBar from "./UserSidebar/UserSideBar";
import UserContent from "./UserContent/UserContent";
import Footer from "../admin/Footer/Footer";

const User = () => {
  const divStyle = {
    background: `
      radial-gradient(black 3px, transparent 4px),
      radial-gradient(black 3px, transparent 4px),
      linear-gradient(#fff 4px, transparent 0),
      linear-gradient(45deg, transparent 74px, transparent 75px, #a4a4a4 75px, #a4a4a4 76px, transparent 77px, transparent 109px),
      linear-gradient(-45deg, transparent 75px, transparent 76px, #a4a4a4 76px, #a4a4a4 77px, transparent 78px, transparent 109px),
      #fff`,
    backgroundSize:
      "109px 109px, 109px 109px, 100% 6px, 109px 109px, 109px 109px",
    backgroundPosition: "54px 55px, 0px 0px, 0px 0px, 0px 0px, 0px 0px",
  };

  return (
    <div style={divStyle}>
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
