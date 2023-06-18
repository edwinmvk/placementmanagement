import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Table, Typography, Upload, message } from "antd";
import { Context } from "../../../utils/ContextProvider";
import { EyeOutlined } from "@ant-design/icons";
import "../../../components/CustomTableCss/CustomTable.css";

const AppliedPlacements = () => {
  const { registeredGoogleUser } = useContext(Context);
  const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

  const [statedata, setstatedata] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch(
        `http://localhost:3000/api/placements/${userid}`
      );
      const data = await response.json();
      setstatedata(data);

      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchUserDetails() {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${userid}`);
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error(error);
    }
  }

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
      width: 170,
      align: "center",
    },
    {
      title: "Posted date",
      dataIndex: "createdate",
      width: 130,
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        const dateA = new Date(a.createdate); // we are doing this because the date in the table is in string foramt
        const dateB = new Date(b.createdate);
        return dateA - dateB;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
    },

    {
      title: "Offer letter",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <Button
            shape="round"
            icon={<EyeOutlined />}
            size="large"
            className="bg-orange-500 text-white hover:bg-white"
            onClick={() => console.log("Hi")}
          >
            View
          </Button>
        );
      },
    },
  ];

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>Applied Placements</Typography.Title>
      </div>

      <Table
        className="custom-table"
        dataSource={statedata}
        columns={columns}
        rowKey="placementid"
        bordered
        pagination={true}
        scroll={{ y: 500 }}
      />
    </div>
  );
};

export default AppliedPlacements;
