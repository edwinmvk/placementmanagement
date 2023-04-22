import React, { useState, useEffect } from "react";
import { Card, Statistic, Table, Typography } from "antd";
import { PushpinOutlined, UserOutlined } from "@ant-design/icons";

const Home = () => {
  const [totplacements, settotplacements] = useState(0);
  const [totstudents, settotstudents] = useState(0);

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch("https://dummyjson.com/carts/1");
      const data = await response.json();
      settotplacements(data.totalProducts);
      settotstudents(data.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mx-5">
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <div className="flex flex-wrap">
        <Card className="text-center m-3 md:w-40 w-full bg-gradient-to-r from-white via-white to-neutral-100 shadow-lg hover:shadow-xl">
          <PushpinOutlined
            className="text-4xl rounded-md"
            style={{ color: "#4d3f3f", backgroundColor: "#e6d5d5" }}
          />
          <Statistic title="Total Placements" value={totplacements} />
        </Card>
        <Card className="text-center m-3 md:w-40 w-full bg-gradient-to-r from-white via-white to-neutral-100 shadow-lg hover:shadow-xl">
          <UserOutlined
            className="text-4xl rounded-md"
            style={{ color: "#1f5926", backgroundColor: "#cafacc" }}
          />
          <Statistic title="Total Students" value={totstudents} />
        </Card>
      </div>
      <Typography.Title level={4}>All Placements</Typography.Title>
      <DatabaseData />
    </div>
  );
};

const DatabaseData = () => {
  const [statedata, setstatedata] = useState([]); // this state will eventually hold ALL the data from the DATABASE

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch("http://jsonplaceholder.typicode.com/posts");
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Placement Id", // This is the column name in table which we can name
      dataIndex: "id", // This is the colunm name from the database which we cannot name
      width: 150,
    },
    {
      title: "Posted Date",
      sorter: true,
      dataIndex: "id",
      width: 150,
    },
    {
      title: "Company Name",
      dataIndex: "userId",
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "body",
      width: 300,
    },
  ];

  return (
    <Table
      bordered
      columns={columns}
      dataSource={statedata}
      pagination={true}
      scroll={{ y: 500 }}
    ></Table>
  );
};

export default Home;
