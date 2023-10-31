import React from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/admin/Sidebar/Sidebar";
import Content from "../../components/admin/Content/Content";
import Footer from "../../components/Footer/Footer";

const Admin = () => {
  return (
    <div>
      <div className="flex flex-col backdrop-blur	bg-stone-50/60">
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
    </div>
  );
};

export default Admin;
