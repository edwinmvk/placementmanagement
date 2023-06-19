import React, { useState, useEffect, useContext } from "react";
import { Card, Space, Statistic, Table, Typography } from "antd";
import {
  CarryOutOutlined,
  PercentageOutlined,
  ReconciliationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Context } from "../../../utils/ContextProvider";
import "../../../components/CustomTableCss/CustomTable.css"; // Import the CSS file

const UserHome = () => {
  const { registeredGoogleUser } = useContext(Context);
  const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

  const [statedata, setstatedata] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userid}`);
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>Dashboard</Typography.Title>
      </div>
      <Space direction="horizontal" className="mb-4">
        <div className="flex flex-wrap gap-2">
          <Card className="w-full md:w-60 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out">
            <div className="flex justify-center">
              <Space direction="horizontal">
                <UserOutlined className="text-4xl" style={{ color: "" }} />
                <Statistic
                  title="Student Id"
                  value={statedata?.userid}
                  formatter={(value) => String(value)}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
          <Card className="w-full md:w-40 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out">
            <div className="flex justify-center">
              <Space direction="horizontal">
                <PercentageOutlined
                  className="text-4xl"
                  style={{ color: "green" }}
                />
                <Statistic
                  title="Average CGPA"
                  value={String(statedata?.cgpa)}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
          <Card className="w-full md:w-40 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out">
            <div className="flex justify-center">
              <Space direction="horizontal">
                <ReconciliationOutlined
                  className="text-4xl"
                  style={{ color: "#c95149" }}
                />
                <Statistic
                  title="Arrears"
                  value={statedata?.arrears}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
          <Card className="w-full md:w-40 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out">
            <div className="flex justify-center">
              <Space direction="horizontal">
                <CarryOutOutlined
                  className="text-4xl"
                  style={{ color: "#d4b148" }}
                />
                <Statistic
                  title="Passout year"
                  value={String(statedata?.passoutyear)}
                  formatter={(value) => String(value)}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
        </div>
      </Space>
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
      render: (text) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Company name",
      dataIndex: "companyname",
      width: 200,
      align: "center",
      render: (text) => {
        return text.toUpperCase();
      },
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
      title: "Passout year",
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
      className="custom-table"
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

export default UserHome;
