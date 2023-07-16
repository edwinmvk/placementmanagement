import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/ContextProvider";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import image from "../../assets/adminlogin.png";

const AdminSignin = () => {
  const { admin, login } = useContext(Context);
  const navigate = useNavigate();
  const [adminobj, setAdminObj] = useState({
    username: "",
    password: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);
    try {
      await login(adminobj);
    } catch (error) {
      console.log(error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    if (admin) {
      navigate("/admin");
    }
  }, [admin]);

  const antIcon = (
    <LoadingOutlined
      style={{
        color: "white",
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <div className="lg:flex">
      <div className="lg:w-1/2 xl:max-w-screen-sm">
        <div className="py-12 bg-indigo-100 flex justify-center items-center bg-indigo-100 lg:justify-start lg:px-12">
          <div className="text-5xl text-indigo-800 tracking-wide font-bold">
            Welcome back Admin
          </div>
        </div>
        <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
          <h2
            className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
                    xl:text-bold"
          >
            Log in
          </h2>
          <div className="mt-12">
            <form onSubmit={handleLogin}>
              <div>
                <div className="text-lg font-bold text-gray-700 tracking-wide">
                  Username
                </div>
                <input
                  required
                  name="username"
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="text"
                  placeholder="Enter your username"
                  value={adminobj.username}
                  onChange={(event) => {
                    setAdminObj((prev) => {
                      return { ...prev, username: event.target.value };
                    });
                  }}
                />
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-gray-700 tracking-wide">
                    Password
                  </div>
                </div>
                <input
                  required
                  name="password"
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  type="password"
                  placeholder="Enter your password"
                  value={adminobj.password}
                  onChange={(event) => {
                    setAdminObj((prev) => {
                      return { ...prev, password: event.target.value };
                    });
                  }}
                />
              </div>
              <div className="mt-10">
                <button
                  disabled={isButtonDisabled}
                  type="submit"
                  className={`mb-3 bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline 
                  shadow-lg ${
                    isButtonDisabled ? `bg-blue-200 ` : `hover:bg-indigo-600`
                  }`}
                >
                  {isButtonDisabled ? <Spin indicator={antIcon} /> : `Login`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1">
        <img alt="" src={image} className="hover:scale-95 duration-100" />
      </div>
    </div>
  );
};

export default AdminSignin;
