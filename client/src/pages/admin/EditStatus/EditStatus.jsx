import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Typography, Tag, Modal, Upload, message } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const EditStatus = () => {
  const { id } = useParams();

  const [statedata, setstatedata] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    fetchData(id);
  }, []);

  async function fetchData(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/appliedplacements/${id}`
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.log(error);
    }
  }

  const onOk = async () => {
    if (list.length > 0) {
      setIsButtonDisabled(true);
      message.warning("Please wait for confirmation");
      try {
        const userid = userDetails?.creator.userid;
        const formData = new FormData();
        formData.append("offerletterurl", list[0]?.originFileObj); // contains the file of newly uploaded resume
        formData.append("placementid", userDetails.placementid);
        userDetails?.offerletterpublicid
          ? formData.append(
              "offerletterpublicid",
              userDetails?.offerletterpublicid
            )
          : null; // contains if there are any previous uploaded resume
        const response = await fetch(
          `http://localhost:3000/api/appliedplacements/${userid}`,
          {
            method: "PUT",
            body: formData,
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          message.success(data);

          // refresh the userDetails state
          fetchData(id);
        } else if (response.status === 500) {
          message.error("Send failed");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsButtonDisabled(false);
        onCancel();
      }
    }
  };

  const onCancel = () => {
    setList([]);
    setIsModalVisible(false);
  };

  const sizeChecking = (fileList) => {
    // this if condition is necessary for the delete button to work
    if (fileList.length > 0) {
      if (fileList[0].size > 614400) {
        message.error("File size exceeded");
        setList([]); // Clear the fileList state
        return;
      }
    }
    setList(fileList); // Update the fileList state
  };

  const displayTags = (statustext) => {
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
            <div className="flex items-center gap-x-1 h-8">
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
      title: "User Id",
      width: 100,
      align: "center",
      render: (_, record) => {
        return record.creator.userid;
      },
    },
    {
      title: "User Name",
      width: 150,
      align: "center",
      render: (_, record) => {
        return record.creator.username;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 180,
      align: "center",
      render: (text) => displayTags(text),
    },
    {
      title: "Resume",
      width: 110,
      align: "center",
      render: (_, record) => {
        return (
          <Button
            shape="round"
            // size="large"
            className="bg-orange-500 text-white hover:bg-white"
            onClick={() => {
              if (record.resumeurl) {
                window.open(record.resumeurl, "_blank");
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
    {
      title: "Actions",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex flex-wrap justify-between">
            <Button
              type="text"
              className="m-1 w-20 bg-green-500 text-white"
              onClick={() => console.log(record)}
            >
              Accept
            </Button>
            <Button
              type="text"
              className="m-1 w-20 bg-red-500 text-white"
              onClick={() => console.log(record)}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
    {
      title: "Offer Letter",
      width: 120,
      align: "center",
      render: (_, record) => {
        return (
          <Button
            className="bg-green-500 text-white hover:bg-white"
            onClick={() => {
              setUserDetails(record);
              setIsModalVisible(true);
            }}
          >
            <div className="flex items-center gap-x-2">
              <CloudUploadOutlined />
              Upload
            </div>
          </Button>
        );
      },
    },
  ];

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-8 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={4}>
          Placement id: {id.toUpperCase()}
        </Typography.Title>
      </div>

      <Table
        className="custom-table"
        rowKey={(rec) => rec.creator.userid}
        bordered
        columns={columns}
        dataSource={statedata}
        scroll={{ y: 500 }}
      />
      <Modal
        title="Upload Offer letter"
        open={isModalVisible}
        maskClosable={false} // this will make the Model not disappear even if we click outside the Model
        okButtonProps={{ className: "bg-blue-500", disabled: isButtonDisabled }}
        okText="Send"
        onOk={onOk}
        onCancel={onCancel}
      >
        <Upload.Dragger
          maxCount={1}
          multiple={false}
          showUploadList={{ showRemoveIcon: true }}
          accept=".pdf"
          fileList={list}
          onChange={(event) => sizeChecking(event.fileList)}
        >
          Drag and drop the offer letter here
          <br />
          (formats: .pdf) (maxsize: 500kb)
        </Upload.Dragger>
        <Button
          type="text"
          className="m-1 bg-green-500 text-white"
          onClick={() => {
            userDetails.offerletterurl
              ? window.open(userDetails.offerletterurl, "_blank")
              : null;
          }}
        >
          View previous
        </Button>
      </Modal>
    </div>
  );
};

export default EditStatus;
