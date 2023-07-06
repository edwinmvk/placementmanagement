import React, { useState, useEffect } from "react";
import { Space, Card, Statistic, Table, Typography } from "antd";
import { ProfileFilled, SafetyOutlined } from "@ant-design/icons";
import "../../../components/CustomTableCss/CustomTable.css";
import CSVbutton from "../../../components/CSVbutton/CSVbutton";
import Domain from "../../../utils/Domain.json";

const Home = () => {
  const [statedata, setstatedata] = useState([]); // this state will eventually hold ALL the data from the DATABASE

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch(`${Domain.name}/api/placements`);
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  }

  let totalplacements = statedata.length;

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
                <ProfileFilled className="text-4xl" style={{ color: "" }} />
                <Statistic
                  title="Total Placements"
                  value={totalplacements}
                  formatter={(value) => String(value)}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
          <Card className="w-full md:w-60 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out">
            <div className="flex justify-center">
              <Space direction="horizontal">
                <SafetyOutlined
                  className="text-4xl"
                  style={{ color: "green" }}
                />
                <Statistic
                  title="Total Students Placed"
                  value={String(10)}
                  className="ml-2"
                />
              </Space>
            </div>
          </Card>
        </div>
      </Space>
      <div className="flex flex-wrap justify-between items-center">
        <Typography.Title level={4}>All Placements</Typography.Title>
        <span className="mb-1">
          <CSVbutton data={statedata} filename={`All_Placements`} />
        </span>
      </div>

      <DatabaseData placementsdata={statedata} />
    </div>
  );
};

const DatabaseData = ({ placementsdata }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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
      className="custom-table"
      dataSource={placementsdata}
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
