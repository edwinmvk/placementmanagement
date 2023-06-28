import React, { useContext, useEffect, useState } from "react";
import { Button, Table, Tag, Typography } from "antd";
import { Context } from "../../../utils/ContextProvider";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "../../../components/CustomTableCss/CustomTable.css";
import DomainNames from "../../../utils/DomainNames.json";

const AppliedPlacements = () => {
  const { registeredGoogleUser } = useContext(Context);
  const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

  const [statedata, setstatedata] = useState([]);

  useEffect(() => {
    appliedPlacements();
  }, []);

  async function appliedPlacements() {
    try {
      const response = await fetch(
        `${DomainNames.netlify}/api/user/appliedplacements/${userid}`
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  }

  const displaytags = (statustext) => {
    switch (statustext) {
      case "Applied for Preliminary":
        return (
          <Tag color="orange">
            <div className="flex items-center gap-x-1 h-8">
              <CheckCircleOutlined spin />
              <h3>Applied for Preliminary</h3>
            </div>
          </Tag>
        );
      case "Eligible for Round 1":
        return (
          <Tag color="purple">
            <div className="flex items-center gap-x-1 h-8">
              <CheckCircleOutlined spin />
              <h3>Eligible for Round 1</h3>
            </div>
          </Tag>
        );
      case "Eligible for Round 2":
        return (
          <Tag color="purple">
            <div className="flex items-center gap-x-1 h-8">
              <CheckCircleOutlined spin />
              <h3>Eligible for Round 2</h3>
            </div>
          </Tag>
        );
      case "You have been Placed":
        return (
          <Tag color="green">
            <div className="flex items-center gap-x-1 h-8">
              <CheckOutlined />
              <h3>You have been Placed</h3>
            </div>
          </Tag>
        );
      case "Failed":
        return (
          <Tag color="red">
            <div className="flex items-center justify-center gap-x-1 h-8 w-20">
              <CloseCircleOutlined />
              <h3>Failed</h3>
            </div>
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

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
      width: 170,
      align: "center",
      render: (text) => {
        return text.toUpperCase();
      },
    },
    // {
    //   title: "Posted date",
    //   dataIndex: "createdate",
    //   width: 130,
    //   align: "center",
    //   defaultSortOrder: "descend",
    //   sorter: (a, b) => {
    //     const dateA = new Date(a.createdate); // we are doing this because the date in the table is in string foramt
    //     const dateB = new Date(b.createdate);
    //     return dateA - dateB;
    //   },
    // },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render: (text) => displaytags(text),
    },

    {
      title: "Offer letter",
      width: 130,
      align: "center",
      render: (_, record) => {
        return (
          <Button
            shape="round"
            size="large"
            className="bg-orange-500 text-white hover:bg-white"
            onClick={() => {
              if (record.offerletterurl) {
                window.open(record.offerletterurl, "_blank");
              }
            }}
          >
            <div className="flex items-center gap-x-2">
              <EyeOutlined />
              View
            </div>
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
