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
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>Dashboard</Typography.Title>
      </div>
      <div className="flex flex-wrap gap-x-4">
        <Card className="rounded-md text-center mb-3 md:w-40 w-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl hover:duration-300">
          <PushpinOutlined
            className="text-4xl rounded-md"
            style={{ color: "#4d3f3f", backgroundColor: "#e6d5d5" }}
          />
          <Statistic title="Total Placements" value={totplacements} />
        </Card>
        <Card className="rounded-md text-center mb-3 md:w-40 w-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl hover:duration-300">
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
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch("http://localhost:3000/api/placements");
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
      title: "Placement ID",
      dataIndex: "placementid",
      width: 150,
      align: "center",
    },
    {
      title: "Company name",
      dataIndex: "companyname",
      width: 200,
      align: "center",
    },
    {
      title: "Posted date",
      dataIndex: "createdate",
      width: 150,
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const dateA = new Date(a.createdate); // we are doing this because the date in the table is in string foramt
        const dateB = new Date(b.createdate);
        return dateA - dateB;
      },
    },
    {
      title: "Last date",
      dataIndex: "lastdate",
      width: 150,
      align: "center",
      sorter: (a, b) => {
        const dateA = new Date(a.lastdate);
        const dateB = new Date(b.lastdate);
        return dateA - dateB;
      },
    },
    {
      title: "Passoutyear",
      dataIndex: "passoutyear",
      width: 150,
      align: "center",
      sorter: (a, b) => {
        return a.passoutyear - b.passoutyear;
      },
    },
    {
      title: "Min CGPA",
      dataIndex: "cgpa",
      width: 80,
      align: "center",
      sorter: (a, b) => {
        return a.cgpa - b.cgpa;
      },
    },
    {
      title: "Max arrears",
      dataIndex: "arrears",
      width: 80,
      align: "center",
      sorter: (a, b) => {
        return a.arrears - b.arrears;
      },
    },
  ];

  // When a row is expanded, the function adds the key of the expanded row to the expandedRowKeys array.
  // If a row is being collapsed, the function removes its key from the expandedRowKeys array
  const handleRowExpand = (expanded, record) => {
    // expanded is a boolean which is triggered by clicking the + or - button
    setExpandedRowKeys((prevState) => {
      if (expanded) {
        return [...prevState, record.placementid];
      } else {
        return prevState.filter((key) => key !== record.placementid);
      }
    });
  };

  const expandedRowRender = (record) => {
    return (
      <p style={{ margin: 0 }}>
        <strong>Description: </strong>
        {record.description}
      </p>
    );
  };

  return (
    <Table
      dataSource={statedata}
      columns={columns}
      expandedRowRender={expandedRowRender} // defines what component must be rendered in the expanded row
      onExpand={handleRowExpand}
      expandedRowKeys={expandedRowKeys}
      rowKey="placementid"
      bordered
      pagination={true}
      scroll={{ y: 500 }}
    />
  );
};

export default Home;
