import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Table, Typography, Upload, message } from "antd";
import { Context } from "../../../utils/ContextProvider";
import { CloudUploadOutlined, SelectOutlined } from "@ant-design/icons";
import "../../../components/CustomTableCss/CustomTable.css";
import Domain from "../../../utils/Domain.json";

const ForMe = () => {
  const { registeredGoogleUser } = useContext(Context);
  const userid = parseInt(registeredGoogleUser?.displayName.substring(0, 8));

  const [statedata, setstatedata] = useState([]); // this state will eventually hold ALL the data from the DATABASE
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [disableApply, setDisabledApply] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    // This is used to obtain the data from the server and set it to Hooks
    try {
      const response = await fetch(`${Domain.name}/api/placements/${userid}`);
      const data = await response.json();
      setstatedata(data);

      fetchUserDetails();
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchUserDetails() {
    try {
      const response = await fetch(`${Domain.name}/api/user/${userid}`);
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
      title: "Last date",
      dataIndex: "lastdate",
      width: 130,
      align: "center",
      sorter: (a, b) => {
        const dateA = new Date(a.lastdate);
        const dateB = new Date(b.lastdate);
        return dateA - dateB;
      },
    },
    {
      title: "Action",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            shape="round"
            size="large"
            className={`bg-blue-500 text-white${
              disableApply ? `pointer-events-none opacity-20` : ``
            }`}
            onClick={() => onApply(record)}
          >
            <div className="flex items-center gap-x-1">
              <SelectOutlined style={{ marginTop: "4px" }} />
              Apply now
            </div>
          </Button>
        );
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

  async function onApply(record) {
    if (userDetails?.resumeurl) {
      setDisabledApply(true);
      try {
        const id = userDetails?.userid;
        const response = await fetch(
          `${Domain.name}/api/appliedplacements/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              placementid: record.placementid,
              companyname: record.companyname,
              status: "Applied for Preliminary",
              cgpa: userDetails?.cgpa,
              arrears: userDetails?.arrears,
              passoutyear: userDetails?.passoutyear,
              resumeurl: userDetails?.resumeurl,
            }),
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          Modal.success({
            title: data,
            content:
              "Please check your status in the Applied Placements section",
            okButtonProps: { className: "bg-blue-500" },
          });

          // remove the applied placement from the statedata
          setstatedata((prev) => {
            return prev.filter((placement) => {
              return placement.placementid !== record.placementid;
            });
          });

          // send notification
          fetch(
            `${Domain.name}/api/adminnotifications/${userDetails?.userid}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                description: `${userDetails?.username} has applied for placement with id:${record.placementid}`,
              }),
            }
          );
        } else if (response.status === 404) {
          Modal.error({
            title: data,
            okButtonProps: { className: "bg-blue-500" },
          });
        } else if (response.status === 500) {
          Modal.error({
            title: "Application not recieved",
            content: "Please try again",
            okButtonProps: { className: "bg-blue-500" },
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDisabledApply(false);
      }
    } else {
      message.error("No resume uploaded. Please upload a resume and try again");
    }
  }

  const onOk = async () => {
    if (list.length > 0) {
      setIsButtonDisabled(true);
      message.warning("Please wait for confirmation");
      try {
        const id = userDetails?.userid;
        const formData = new FormData();
        formData.append("resumeurl", list[0]?.originFileObj); // contains the file of newly uploaded resume
        userDetails?.resumepublicid
          ? formData.append("resumepublicid", userDetails?.resumepublicid)
          : null; // contains if there are any previous uploaded resume
        const response = await fetch(`${Domain.name}/api/user/resume/${id}`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.status === 200) {
          message.success("Resume uploaded");
          // refresh the userDetails state
          fetchUserDetails();
        } else if (response.status === 500) {
          message.error("Upload failed");
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
      <div className="flex flex-wrap justify-between items-center">
        <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
          <Typography.Title level={3}>Placements For Me</Typography.Title>
        </div>
        <Button
          className="flex items-center mb-3 bg-green-600 hover:bg-green-500"
          style={{ border: "white", color: "white" }}
          onClick={() => setIsModalVisible(true)}
        >
          <CloudUploadOutlined />
          Upload Resume
        </Button>
      </div>

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
      <Modal
        title="Upload Resume"
        open={isModalVisible}
        maskClosable={false} // this will make the Model not disappear even if we click outside the Model
        okButtonProps={{ className: "bg-blue-500", disabled: isButtonDisabled }}
        okText="Upload"
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
          Drag and drop your resume here
          <br />
          (formats: .pdf) (maxsize: 500kb)
        </Upload.Dragger>
        <Button
          className="m-1 bg-green-600 hover:bg-green-500"
          style={{ border: "white", color: "white" }}
          onClick={() => {
            userDetails?.resumeurl
              ? window.open(userDetails?.resumeurl, "_blank")
              : null;
          }}
        >
          View previous Resume
        </Button>
      </Modal>
    </div>
  );
};

export default ForMe;
