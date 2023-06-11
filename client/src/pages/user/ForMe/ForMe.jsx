import React, { useContext, useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { Context } from "../../../utils/ContextProvider";

const ForMe = () => {
  const [statedata, setstatedata] = useState([]); // this state will eventually hold ALL the data from the DATABASE
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const { registeredGoogleUser } = useContext(Context);
  const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

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
    } catch (error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: "Placement ID",
      dataIndex: "placementid",
      width: 150,
    },
    {
      title: "Company name",
      dataIndex: "companyname",
      width: 200,
    },
    {
      title: "Posted date",
      dataIndex: "createdate",
      width: 150,
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
      sorter: (a, b) => {
        const dateA = new Date(a.lastdate);
        const dateB = new Date(b.lastdate);
        return dateA - dateB;
      },
    },
    // {
    //   title: "Passoutyear",
    //   dataIndex: "passoutyear",
    //   width: 150,
    // },
    // {
    //   title: "Min CGPA",
    //   dataIndex: "cgpa",
    //   width: 80,
    // },
    // {
    //   title: "Max arrears",
    //   dataIndex: "arrears",
    //   width: 80,
    // },
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
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-50 rounded-md">
        <Typography.Title level={3}>Placements For Me</Typography.Title>
      </div>
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
    </div>
  );
};

export default ForMe;
