import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../../utils/ContextProvider";
import { Badge, Button, Drawer, List } from "antd";
import {
  BellFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
// import "tachyons";

const Header = () => {
  const { isCollapsed, setCollapsed } = useContext(Context);
  const [notify, setNotify] = useState([]);
  const [notifyDrawer, setNotifyDrawer] = useState(false);

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/comments"
      );
      const data = await response.json();
      setNotify(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();

    // // Old method
    // fetch('https://jsonplaceholder.typicode.com/comments')
    // .then((response)=> {
    //     return response.json();
    // })
    // .then(data => {
    //     setNotify(data)
    // })
  }, []);

  return (
    <div className="m-3 flex justify-between border-b border-gray-300">
      <Button
        type="default"
        onClick={() => setCollapsed(!isCollapsed)}
        style={{
          marginBottom: 10,
        }}
      >
        {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Badge count={notify.length} /*dot*/>
        <BellFilled
          className="text-2xl my-1 cursor-pointer"
          onClick={() => setNotifyDrawer(true)}
        />
      </Badge>
      <Drawer
        title="Notifications"
        open={notifyDrawer}
        onClose={() => setNotifyDrawer(false)}
        maskClosable={true}
      >
        <List
          dataSource={notify}
          renderItem={(item) => {
            return <List.Item>{item.email} has responded</List.Item>;
          }}
        ></List>
      </Drawer>
    </div>
  );
};

export default Header;
