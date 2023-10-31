import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../../utils/ContextProvider";
import { Layout, Menu, Dropdown, Modal, Upload, message } from "antd";
import {
  HomeOutlined,
  MonitorOutlined,
  LogoutOutlined,
  AuditOutlined,
  RightOutlined,
  UserOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import placementcell from "../../../assets/placementcell.png";

const { Sider } = Layout;

const UserSideBar = () => {
  const {
    registeredGoogleUser,
    googleSignOut,
    isCollapsed,
    setCollapsed,
    mobileView,
    setMobileView,
    mobilePopout,
    setMobilePopout,
  } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/userprofile");
  const [statedata, setstatedata] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange); // This code sets up an event listener for the "resize" event on the window object when the component mounts (i.e., when we load admin page)
    return () => window.removeEventListener("resize", handleWindowSizeChange); // This code removes the event listener when the component unmounts (i.e., when we exit the admin page)
  }, []);

  const handleWindowSizeChange = () => {
    // this if condition determines whether it is mobile view
    if (window.innerWidth < 500) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
    // this if condition determines whether the sider must be collapsed or not in the desktop view
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));
    fetchData(userid);
  }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]); // the state changes when the location.pathname changes

  async function fetchData(id) {
    // This is used to obtain the data from the server and set it to Hooks for the first time only
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${id}`
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  }

  const logoutHandleClick = async () => {
    setMobilePopout(false);
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  const sizeChecking = (fileList) => {
    // this if condition is necessary for the delete button to work
    if (fileList.length > 0) {
      if (fileList[0].size > 1500000) {
        message.error("File size exceeded");
        setList([]); // Clear the fileList state
        return;
      }
    }
    setList(fileList); // Update the fileList state
  };

  const onOk = async () => {
    if (list.length > 0) {
      setIsButtonDisabled(true);
      message.warning("Please wait for confirmation");
      try {
        const userid = statedata?.userid;
        const formData = new FormData();
        formData.append("avatar", list[0]?.originFileObj);
        formData.append("avatarpublicid", statedata?.avatarpublicid);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/userupdate/${userid}`,
          {
            method: "POST",
            body: formData,
          }
        );
        await response.json();
        if (response.status === 200) {
          message.success("Picture updated");
        } else if (response.status === 500) {
          message.error("Updation failed");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsButtonDisabled(false);
        onCancel();
      }
    }
  };

  const onCancel = () => {
    setList([]);
    setIsModelOpen(false);
  };

  const MenuContents = [
    {
      label: "Home",
      icon: <HomeOutlined />,
      key: "/userprofile",
    },
    {
      label: "For Me",
      icon: <MonitorOutlined />,
      key: "/userprofile/forme",
    },
    {
      label: "Applied Placements",
      icon: <AuditOutlined />,
      key: "/userprofile/appliedplacements",
    },
  ];

  const items = [
    {
      label: "Change picture",
      icon: <UserOutlined />,
      key: "1",
      onClick: () => setIsModelOpen(true),
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "2",
      onClick: logoutHandleClick,
    },
  ];

  const CommonSidebar = () => (
    <Layout hasSider={true}>
      <Sider
        mode="vertical"
        trigger={null} // this is used to remove the black arrrow on the side of Sider component
        collapsible
        theme="dark"
        collapsedWidth={80}
        collapsed={mobileView ? false : isCollapsed} // the sider must be always open in the mobile view
        width={mobileView ? "230px" : "200px"}
        style={{
          backgroundColor: "rgba(20, 25, 41, 1)",
          backgroundImage: `repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
                    repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
                    linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)),
                    linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1))`,
          backgroundSize: "70px 120px",
        }}
      >
        <div
          className={`p-3 flex flex-row items-center justify-center backdrop-blur-sm bg-white/30 ${
            mobileView ? `` : isCollapsed ? "m-2 rounded-full" : ""
          }`}
        >
          <img alt="" src={placementcell} width={50} className="rounded-full" />
          {mobileView ? (
            <>
              <h1 className="m-2 text-white text-lg font-extrabold uppercase">
                Placement Cell
              </h1>
              <CloseCircleOutlined
                className="text-gray-200 text-2xl mb-1"
                onClick={() => setMobilePopout(false)}
              />
            </>
          ) : isCollapsed ? null : (
            <h1 className="m-2 text-white text-lg font-extrabold uppercase">
              Placement Cell
            </h1>
          )}
        </div>
        <Menu
          items={MenuContents}
          theme="dark"
          selectedKeys={[currentPath]}
          mode="vertical"
          onClick={(item) => {
            navigate(item.key);
            setMobilePopout(false);
          }}
          style={{
            marginTop: "10px",
            background: "transparent",
            color: "rgb(221, 232, 200)",
            border: "none",
          }}
        />
        <div className="absolute bottom-0 right-0 left-0 m-2 cursor-pointer">
          <Dropdown
            menu={{
              items,
              selectable: true,
            }}
          >
            <div className="p-2 flex items-center justify-around gap-x-2 border border-solid border-transparent bg-white/30 rounded-md">
              <div className="rounded-full w-10 h-10 overflow-hidden">
                <img
                  alt=""
                  src={statedata?.avatar}
                  className="object-cover h-full w-full"
                />
              </div>

              {mobileView ? (
                <div className="flex items-center w-2/3">
                  <h1 className="text-md font-bold text-gray-200">
                    {statedata?.username}
                  </h1>
                  <RightOutlined className="m-1 text-gray-200" />
                </div>
              ) : isCollapsed ? (
                <></>
              ) : (
                <div className="flex items-center w-2/3">
                  <h1 className="text-md font-bold text-gray-200">
                    {statedata?.username}
                  </h1>
                  <RightOutlined className="m-1 text-gray-200" />
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
      <Modal
        title="Change profile picture"
        open={isModelOpen}
        maskClosable={false} // this will make the Model not disappear even if we click outside the Model
        okButtonProps={{ className: "bg-blue-500", disabled: isButtonDisabled }}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Upload.Dragger
          maxCount={1}
          multiple={false}
          listType="picture"
          showUploadList={{ showRemoveIcon: true }}
          accept=".png, .jpg, .jpeg"
          fileList={list}
          onChange={(event) => sizeChecking(event.fileList)}
          beforeUpload={(file) => false} // This is stop the automatic uploading
        >
          Drag and drop Profile picture here
          <br />
          (formats: .png, ,jpg) (maxsize: 1Mb)
        </Upload.Dragger>
      </Modal>
    </Layout>
  );
  return (
    <div>
      {mobileView ? (
        <div
          className="flex flex-col h-full fixed top-0 left-0 items-start justify-start z-10 duration-500"
          style={{ transform: mobilePopout ? "none" : "translateX(-100%)" }}
        >
          <CommonSidebar />
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <CommonSidebar />
        </div>
      )}
    </div>
  );
};

export default UserSideBar;
