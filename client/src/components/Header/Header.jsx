import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../utils/ContextProvider";
import { Badge, Button, Drawer, Calendar, List, Modal } from "antd";
import {
  BellFilled,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Header = () => {
  const { isCollapsed, setCollapsed } = useContext(Context);
  const [notify, setNotify] = useState([]);
  const [notifyDrawer, setNotifyDrawer] = useState(false);
  const [isCalender, setIsCalender] = useState(false);

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
    <div className="m-2 mb-5 p-2 flex justify-between items-center rounded-md shadow-md bg-stone-50">
      <Button type="default" onClick={() => setCollapsed(!isCollapsed)}>
        {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <div className="flex justify-between gap-x-4">
        <CalendarOutlined
          className="text-2xl my-1 cursor-pointer"
          onClick={() => setIsCalender(true)}
        />
        <Badge count={notify.length} /*dot*/>
          <BellFilled
            className="text-2xl my-1 cursor-pointer"
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
