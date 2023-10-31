import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../../utils/ContextProvider";
import { Badge, Button, Drawer, Calendar, List, Modal } from "antd";
import {
  BellFilled,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Header = () => {
  const {
    isCollapsed,
    setCollapsed,
    mobileView,
    setMobilePopout,
    registeredGoogleUser,
    admin,
  } = useContext(Context);
  const location = useLocation();

  const [notify, setNotify] = useState([]);
  const [notifyDrawer, setNotifyDrawer] = useState(false);
  const [isCalender, setIsCalender] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (location.pathname.includes("admin")) {
      // if admin logged in
      setCurrentUser(admin.username);
      fetchAdminData();
    } else {
      // if student logged in
      const userid = parseInt(
        registeredGoogleUser?.displayName.substring(0, 8)
      );
      setCurrentUser(userid);
      fetchUserData();
    }
  }, [currentUser]);

  async function fetchAdminData() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/adminnotifications`
      );
      const data = await response.json();
      setNotify(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchUserData() {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/usernotifications/${currentUser}`
      );
      const data = await response.json();
      setNotify(data);
    } catch (error) {
      console.log(error);
    }
  }

  const clearButton = () => {
    return (
      <div className="w-full flex justify-center">
        <button
          className=" bg-blue-700 text-white w-20 rounded-full text-lg p-1 hover:bg-sky-600 font-sans"
          onClick={
            location.pathname.includes("admin")
              ? clearAdminNotifications
              : clearUserNotifications
          }
        >
          Clear
        </button>
      </div>
    );
  };

  async function clearAdminNotifications() {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/adminnotifications`,
        {
          method: "DELETE",
        }
      )
        .then(setNotifyDrawer(false))
        .then(setNotify([]));
    } catch (error) {
      console.log(error);
    }
  }

  async function clearUserNotifications() {
    try {
      await fetch(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/usernotifications/${currentUser}`,
        {
          method: "DELETE",
        }
      )
        .then(setNotifyDrawer(false))
        .then(setNotify([]));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="m-2 mb-5 p-2 flex justify-between items-center rounded-md shadow-md bg-stone-50">
      {mobileView ? (
        <MenuOutlined
          className="ml-2 text-2xl"
          onClick={() => setMobilePopout(true)}
        />
      ) : (
        <Button type="default" onClick={() => setCollapsed(!isCollapsed)}>
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      )}

      <div className="flex justify-between items-center gap-x-4">
        <CalendarOutlined
          className="text-2xl my-1 cursor-pointer"
          onClick={() => setIsCalender(true)}
        />
        <Badge count={notify.length} /*dot*/>
          <BellFilled
            className="text-2xl cursor-pointer"
            onClick={() => setNotifyDrawer(true)}
          />
        </Badge>
      </div>

      <Modal
        title={<h1 className="font-bold text-2xl">Calender</h1>}
        open={isCalender}
        onCancel={() => setIsCalender(false)}
        maskClosable={true} // this will make the Model not disappear even if we click outside the Model
        footer={null}
      >
        <Calendar fullscreen={false} className="rounded-md" />
      </Modal>
      <Drawer
        title="Notifications"
        open={notifyDrawer}
        onClose={() => setNotifyDrawer(false)}
        maskClosable={true}
        footer={clearButton()}
      >
        <div className="flex flex-col justify-between">
          <List
            dataSource={notify}
            renderItem={(item) => {
              return (
                <List.Item className="font-semibold">
                  {item.description}.
                </List.Item>
              );
            }}
          ></List>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
