import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Table, Button, Modal, Tag } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import "../../../components/CustomTableCss/CustomTable.css";
import { LocalDetails } from "../Responses/LocalDetails";

const EditStatus = () => {
  const [statedata, setstatedata] = useState([]);
  const [statusTag, setStatusTag] = useState(null);

  const navigate = useNavigate();

  // const fetchData= async ()=> {  // This is used to obtain the data from the server and set it to Hooks for the first time only
  //     try{
  //       const response= await fetch('/......');
  //       const data= await response.json();
  //       setstatedata(data);
  //     } catch(error){
  //          console.error(error);
  //     }
  // }

  // const fetchUpdatedData= async ()=> {  // This async function is to fetch the new updated data from the server and update the statedata in the Hooks, even though they are already updated locally
  //     try{
  //       const response= await fetch('/....');
  //       const updatedData= await response.json();
  //       setstatedata(updatedData);
  //     } catch(error){
  //          console.error(error);
  //     }
  // }

  // const sendUpdatedData= async ()=> { // This async function is to send the updated state data to the server for updating the database
  //     try{
  //         const response= await fetch('/.....', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(statedata)
  //         });
  //         const data= await response.json();
  //         console.log(data);

  //         // Fetch the updated data from backend and update the state
  //         fetchUpdatedData();

  //     } catch(error){
  //         console.error(error);
  //     }
  // }

  useEffect(() => {
    // fetchData();

    setstatedata(LocalDetails);
    console.log(statedata);
  }, []);

  useEffect(() => {
    setstatedata((previousstatedata) => {
      // here we are updating the previous statedata array by reinserting the objects into the array based on condition
      return previousstatedata.map((student) => {
        if (student.username === statusTag?.username)
          // ? is very important because, statusTag will be null when it is automatically executed for the 1st 2 times
          return statusTag;
        else return student;
      });
    });
    console.log(statedata);

    // Even though React has not updated the component's state yet, we can still pass the updated state directly to the api call
    // sendUpdatedData();
  }, [statusTag]);

  let groupedData = _.chain(statedata)
    .groupBy("placementid")
    .map((arrayofeachkeys, keyofobject) => {
      return { placementid: keyofobject, sortedresponses: arrayofeachkeys };
    })
    .value();

  const columns = [
    {
      title: "Placement ID",
      dataIndex: "placementid",
      width: 100,
    },
    {
      title: "Responses",
      dataIndex: "sortedresponses",
      width: 500,
      render: (_, record) => {
        return (
          <Table
            bordered
            dataSource={record.sortedresponses}
            columns={nestedColumns}
            scroll={{ y: 200 }}
            pagination={false}
          />
        );
      },
    },
  ];

  const nestedColumns = [
    {
      title: "Username",
      dataIndex: "username",
      width: 100,
      render: (text) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 110,
      render: (text) => displaytags(text),
    },
    {
      title: "Resume",
      dataIndex: "resume",
      width: 90,
      render: (_) => {
        return (
          <Button
            className="bg-blue-500"
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
          />
        );
      },
    },
    {
      title: "Actions",
      width: 170,
      render: (_, record) => {
        return (
          <div className="flex flex-wrap justify-between">
            <Button
              type="text"
              className="m-1 w-20 bg-green-500 text-white"
              onClick={() => onClickAccept(record)}
            >
              Accept
            </Button>
            <Button
              type="text"
              className="m-1 w-20 bg-red-500 text-white"
              onClick={() => onClickReject(record)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const onClickAccept = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to Accept?`,
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setStatusTag({ ...record });
        setStatusTag((previousstatustag) => {
          return { ...previousstatustag, status: "accepted" };
        });
      },
    });
  };

  const onClickReject = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to Reject?`,
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setStatusTag({ ...record });
        setStatusTag((previousstatustag) => {
          return { ...previousstatustag, status: "rejected" };
        });
      },
    });
  };

  const displaytags = (status) => {
    switch (status) {
      case "applied":
        return (
          <Tag icon={<SyncOutlined spin />} color="warning">
            applied
          </Tag>
        );
      case "accepted":
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            accepted
          </Tag>
        );
      case "rejected":
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            rejected
          </Tag>
        );
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>Responses</Typography.Title>
      </div>
      <Table
        className="custom-table"
        columns={columns}
        dataSource={groupedData}
        scroll={{ y: 500 }}
      ></Table>
    </div>
  );
};

export default EditStatus;
