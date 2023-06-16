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
} from "@ant-design/icons";
import placementcell from "../../assets/placementcell.png";

const { Sider } = Layout;

const UserSideBar = () => {
  const { isCollapsed, setCollapsed, registeredGoogleUser, googleSignOut } =
    useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/userprofile");
  const [statedata, setstatedata] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [list, setList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchData = async (id) => {
    // This is used to obtain the data from the server and set it to Hooks for the first time only
    try {
      const response = await fetch(`http://localhost:3000/api/user/${id}`);
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

    fetchData(userid);

    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange); // This code sets up an event listener for the "resize" event on the window object when the component mounts (i.e., when we load admin page)
    return () => window.removeEventListener("resize", handleWindowSizeChange); // This code removes the event listener when the component unmounts (i.e., when we exit the admin page)
  }, []);

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  };

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]); // the state changes when the location.pathname changes

  const logoutHandleClick = async () => {
    try {
      await googleSignOut();
    } catch (error) {
      console.log(error);
    }
  };

  const sizeChecking = (fileList) => {
    // this if condition is necessary for the delete button to work
    if (fileList.length > 0) {
      if (fileList[0].size > 614400) {
        message.error("File size exceeded");
        setList([]); // Clear the fileList state
        return;
      }
    }
    setList(fileList); // Update the fileList state
  };

  const onCancel = () => {
    setList([]);
    setIsModelOpen(false);
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
          `http://localhost:3000/api/user/userupdate/${userid}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
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

  return (
    <Layout>
      <Sider
        mode="vertical"
        trigger={null} // this is used to remove the black arrrow on the side of Sider component
        collapsible
        theme="dark"
        collapsedWidth={80}
        collapsed={isCollapsed}
        width="200px"
        style={{
          backgroundColor: "#141929",
          backgroundImage: `repeating-linear-gradient(120deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
                    repeating-linear-gradient(60deg, rgba(255,255,255,.1), rgba(255,255,255,.1) 1px, transparent 1px, transparent 60px),
                    linear-gradient(60deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1)),
                    linear-gradient(120deg, rgba(0,0,0,.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,.1) 75%, rgba(0,0,0,.1))`,
          backgroundSize: "70px 120px",
        }}
      >
        <div
          className={`p-2 flex flex-row items-center justify-center backdrop-blur-sm bg-white/30 ${
            isCollapsed ? "m-2 rounded-full" : "m-0"
          }`}
        >
          <img alt="" src={placementcell} width={50} className="rounded-full" />
          {isCollapsed ? null : (
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
          }}
          style={{
            marginTop: "10px",
            background: "transparent",
            color: "white",
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
              <img
                alt=""
                src={statedata?.avatar}
                width={30}
                className="rounded-full"
              />
              {isCollapsed ? (
                <></>
              ) : (
                <>
                  <h1 className="text-lg font-bold text-gray-200">
                    {statedata?.username}
                  </h1>
                  <RightOutlined className="text-gray-200" />
                </>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
      <Modal
        title={<h1 className="font-bold text-2xl">Change profile picture</h1>}
        open={isModelOpen}
        maskClosable={false} // this will make the Model not disappear even if we click outside the Model
        okButtonProps={{ className: "bg-blue-500", disabled: isButtonDisabled }}
        onCancel={onCancel}
        onOk={onOk}
      >
        <Upload.Dragger
          maxCount={1}
          multiple={false}
          listType="picture"
          showUploadList={{ showRemoveIcon: true }}
          accept=".png, .jpg, .jpeg"
          fileList={list}
          onChange={(event) => sizeChecking(event.fileList)}
        >
          Drag and drop Profile picture here
          <br />
          (formats: .png, ,jpg) (maxsize: 500kb)
        </Upload.Dragger>
      </Modal>
    </Layout>
  );
};

export default UserSideBar;
