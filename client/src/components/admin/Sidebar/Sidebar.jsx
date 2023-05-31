import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../../utils/ContextProvider";
import {
  Layout,
  Menu,
  Modal,
  Button,
  Form,
  Input,
  message,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  AudioOutlined,
  KeyOutlined,
  PlusCircleOutlined,
  LogoutOutlined,
  AuditOutlined,
  RightOutlined,
} from "@ant-design/icons";
import placementcell from "./placementcell.png";
import admin from "./admin.png";
// import { LocalDetails } from "./LocalDetails";

const { Sider } = Layout;

const Sidebar = () => {
  const { logout, isCollapsed, setCollapsed } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/admin");
  const [statedata, setstatedata] = useState([]); // this state will eventually hold ALL the data from the DATABASE
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
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

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks for the first time only
    try {
      const response = await fetch(`http://localhost:3000/api/admin`);
      const data = await response.json();
      setstatedata([data]);
    } catch (error) {
      console.error(error);
    }
  };

  const sendUpdatedData = async (values) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/${values.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        setstatedata((previousstatedata) => {
          return previousstatedata.map((passwordobj) => {
            if (passwordobj.username === values.username) {
              return { ...passwordobj, password: values.newpassword };
            } else {
              return passwordobj; // Return the original object when the condition is not met
            }
          });
        });
        message.success(data);
        setLoading(false);
        form.resetFields();
        form.setFieldsValue({
          username: values.username,
          oldpassword: values.newpassword,
        });
        setTimeout(() => {
          setIsEditing(false);
        }, 1500);
      } else if (response.status === 404) {
        message.error(data);
      } else if (response.status === 500) {
        message.error("Please try again");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const passwordHandleClick = () => {
    // this function is written first becz we cannot access 'passwordHandleClick' funtion in the MenuContents array before initialization
    setIsEditing(true);
  };

  const logoutHandleClick = () => {
    logout();
  };

  const MenuContents = [
    {
      label: "Home",
      icon: <HomeOutlined />,
      key: "/admin",
    },
    {
      label: "New Placement",
      icon: <PlusCircleOutlined />,
      key: "/admin/newplacement",
    },
    {
      label: "Responses",
      icon: <AudioOutlined />,
      key: "/admin/responses",
    },
    {
      label: "Manage Students",
      icon: <AuditOutlined />,
      key: "/admin/manage",
    },
  ];

  const items = [
    {
      label: "Change Password",
      icon: <KeyOutlined />,
      key: "1",
      onClick: passwordHandleClick,
    },
    {
      label: "Logout",
      icon: <LogoutOutlined />,
      key: "2",
      onClick: logoutHandleClick,
    },
  ];

  const initialValues = {
    username: statedata?.[0]?.username,
    oldpassword: statedata?.[0]?.password,
  };

  const validateNewPassword = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (value && value !== form.getFieldValue("oldpassword")) resolve();
      else reject("Old password cannot be reused");
    });
  };

  const validateConfirmPassword = (rule, value) => {
    // even though rule is not used, it must be used as parameter to the correct syntax
    return new Promise((resolve, reject) => {
      if (value && value !== form.getFieldValue("newpassword"))
        reject("The two passwords do not match");
      else resolve();
    });
  };

  const onCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    // call backend function to update details
    sendUpdatedData(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
            item.key !== "1" && item.key !== "2"
              ? navigate(item.key)
              : () => {}; // this is done to prevent the routing of changepassword, inorder to display only the Model
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
              <img alt="" src={admin} width={30} className="rounded-full" />
              {isCollapsed ? (
                <></>
              ) : (
                <>
                  <h1 className="text-lg font-bold">Admin</h1>
                  <RightOutlined />
                </>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>
      <Modal
        title="Change Password"
        open={isEditing}
        maskClosable={false} // this will make the Model not disappear even if we click outside the Model
        onCancel={onCancel}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Form
          form={form}
          name="changepasswordform"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Form.Item name="username" label="Username">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="oldpassword" label="Old Password">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            name="newpassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { validator: validateNewPassword },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="confirmnewpassword"
            label="Confirm New Password"
            rules={[
              { required: true, message: "Please confirm your new password" },
              { validator: validateConfirmPassword },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 7 }}>
            <Button
              className="bg-blue-500"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {loading ? "Updating..." : "Update password"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Sidebar;
