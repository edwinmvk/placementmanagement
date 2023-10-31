import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Table,
  Typography,
  Tag,
  Modal,
  Upload,
  message,
  Dropdown,
  Popconfirm,
} from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  DownOutlined,
  EyeOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import CSVbutton from "../../../components/CSVbutton/CSVbutton";

const EditStatus = () => {
  const { id } = useParams();

  const [statedata, setstatedata] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);
  const [open, setOpen] = useState({}); // Use an object to store the open state for each row
  const [rowData, setRowDData] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    fetchData(id);
  }, []);

  async function fetchData(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/appliedplacements/${id}`
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.log(error);
    }
  }

  const onOk = async () => {
    if (list.length > 0) {
      setIsUploadButtonDisabled(true);
      message.warning("Please wait for confirmation");
      try {
        const userid = userDetails?.creator.userid;
        const formData = new FormData();
        formData.append("offerletterurl", list[0]?.originFileObj);
        formData.append("placementid", userDetails.placementid);
        userDetails?.offerletterpublicid
          ? formData.append(
              "offerletterpublicid",
              userDetails?.offerletterpublicid
            )
          : null;
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_DOMAIN
          }/api/appliedplacements/${userid}`,
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
        setIsUploadButtonDisabled(false);
        onCancel();
      }
    }
  };

  const onNewStatusOk = async () => {
    const userid = rowData.creator.userid;
    handleOpenChange(); // this is done to close the Dropdown menu
    message.warning("Please wait for confirmation");
    try {
      const stateToChangeIndex = statedata.findIndex(
        (item) => item.creator.userid === rowData.creator.userid
      );
      const updatedvalues = {
        ...statedata[stateToChangeIndex],
        status: newStatus,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/appliedplacements/${userid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedvalues),
        }
      );
      const data = await response.json();

      if (response.status === 200) {
        message.success(data);

        // we first make a copy of the statedatarray
        const copystatedata = [...statedata];
        // we then find the index of the data to be updated
        const stateToChangeIndex = copystatedata.findIndex(
          (item) => item.creator.userid === rowData.creator.userid
        );
        // make a copy of that particular object whose status is to be updated
        const tochangevalues = { ...copystatedata[stateToChangeIndex] };
        // remove that object and replace it with new edited object
        copystatedata.splice(stateToChangeIndex, 1, {
          ...tochangevalues,
          status: newStatus,
        });
        setstatedata(copystatedata);

        // send notification
        fetch(
          `${
            import.meta.env.VITE_SERVER_DOMAIN
          }/api/usernotifications/${userid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              description: `The status of placementid: ${id} is updated to ${newStatus}`,
            }),
          }
        );
      } else if (response.status === 500) {
        message.error("Please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    setList([]);
    setIsModalVisible(false);
  };

  const onNewStatusCancel = () => {
    setNewStatus(null);
  };

  const sizeChecking = (fileList) => {
    // this if condition is necessary for the delete button to work
    if (fileList.length > 0) {
      if (fileList[0].size > 1500000) {
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

  const handleOpenChange = (toggle, key) => {
    //  this if condition runs when the Dropdown is made to be opened
    if (key) {
      setOpen((prev) => ({
        ...prev,
        [key]: toggle,
      }));
    } else {
      // this else condition runs when the Dropdown is made to be closed on clicking the ok button in the Popconfirm
      setOpen(Object.fromEntries(Object.keys(open).map((key) => [key, false]))); // here all the keys (Dropdowns) will be set to false (closed)
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
      title: "Student Name",
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
      width: 160,
      align: "center",
      render: (_, record) => {
        return (
          <div className="flex flex-wrap justify-center">
            <Dropdown
              key={record.creator.userid}
              menu={{
                items,
                // onclicking the options in the Dropdown, we get the key from event. Using this key we find the label of that key from the items array and store it to newStatus state
                onClick: (event) => {
                  const selectedItem = items.find(
                    (item) => item.key === event.key
                  );
                  setNewStatus(
                    selectedItem.label.props.children.props.children
                  );
                },
              }}
              onOpenChange={
                (toggle) => handleOpenChange(toggle, record.creator.userid) // we are passing the toggle and the key of this particular Dropdown
              }
              open={open[record.creator.userid]} // the state of Dropdowm is checked bu checking specific key's value in the open state object
              destroyPopupOnHide={true} // this is set to true so that the Popup destroys when the Dropdown is also destroyed
              trigger={["click"]} // hover can also be used
            >
              <Button
                className="bg-blue-500"
                style={{ color: "white" }}
                // When clicking the button to open the Dropdown menu, we store the data in that particular row to the rowData state
                onClick={() => setRowDData(record)}
              >
                <div className="flex items-center gap-x-2">
                  Choose Actions
                  <DownOutlined />
                </div>
              </Button>
            </Dropdown>
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
            className="bg-green-600 hover:bg-green-500"
            style={{ border: "white", color: "white" }}
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

  const items = [
    {
      label: (
        <Popconfirm
          placement="top"
          overlayStyle={{ zIndex: "9999" }}
          title="Confirm status update"
          description="Notification will be sent to student"
          onConfirm={onNewStatusOk}
          okText="Yes"
          okButtonProps={{ className: `bg-blue-500` }}
          cancelText="No"
          onCancel={onNewStatusCancel}
        >
          <a>Eligible for Round 1</a>
        </Popconfirm>
      ),
      key: "1",
      icon: <HourglassOutlined />,
      style: { color: "purple" },
    },
    {
      label: (
        <Popconfirm
          placement="top"
          overlayStyle={{ zIndex: "9999" }}
          title="Confirm status update"
          description="Notification will be sent to student"
          onConfirm={onNewStatusOk}
          okText="Yes"
          okButtonProps={{ className: `bg-blue-500` }}
          cancelText="No"
          onCancel={onNewStatusCancel}
        >
          <a>Eligible for Round 2</a>
        </Popconfirm>
      ),
      key: "2",
      icon: <HourglassOutlined />,
      style: { color: "purple" },
    },
    {
      label: (
        <Popconfirm
          placement="top"
          overlayStyle={{ zIndex: "9999" }}
          title="Confirm status update"
          description="Notification will be sent to student"
          onConfirm={onNewStatusOk}
          okText="Yes"
          okButtonProps={{ className: `bg-blue-500` }}
          cancelText="No"
          onCancel={onNewStatusCancel}
        >
          <a>Failed</a>
        </Popconfirm>
      ),
      key: "3",
      icon: <CloseCircleOutlined />,
      style: { color: "red" },
    },
    {
      label: (
        <Popconfirm
          placement="top"
          overlayStyle={{ zIndex: "9999" }}
          title="Confirm status update"
          description="Notification will be sent to student"
          onConfirm={onNewStatusOk}
          okText="Yes"
          okButtonProps={{ className: `bg-blue-500` }}
          cancelText="No"
          onCancel={onNewStatusCancel}
        >
          <a>You have been Placed</a>
        </Popconfirm>
      ),
      key: "4",
      icon: <CheckCircleOutlined />,
      style: { color: "green" },
    },
  ];

  const csvdata = statedata?.map((item) => {
    return {
      ...item,
      creator: item.creator.username,
      userid: item.creator.userid,
    };
  });

  return (
    <div className="mx-5">
      <div className="flex flex-wrap justify-between item-center">
        <div className="px-2.5 py-0.5 mb-6 w-fit bg-stone-100 shadow-lg rounded-md">
          <Typography.Title level={4}>
            Placement id: {id.toUpperCase()}
          </Typography.Title>
        </div>
        <span className="mb-2">
          <CSVbutton
            data={csvdata}
            filename={`Placement_id:${id.toUpperCase()}`}
          />
        </span>
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
        okButtonProps={{
          className: "bg-blue-500",
          disabled: isUploadButtonDisabled,
        }}
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
          beforeUpload={(file) => false} // This is stop the automatic uploading
        >
          Drag and drop the offer letter here
          <br />
          (formats: .pdf) (maxsize: 1Mb)
        </Upload.Dragger>
        <Button
          className="mt-3 bg-green-600 hover:bg-green-500"
          style={{ border: "white", color: "white" }}
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
