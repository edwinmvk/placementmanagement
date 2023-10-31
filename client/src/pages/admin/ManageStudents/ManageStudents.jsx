import React, { useState, useEffect } from "react";
import { Typography, Table, Avatar, Modal, Input, message } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import "../../../components/CustomTableCss/CustomTable.css";
import CSVbutton from "../../../components/CSVbutton/CSVbutton";

const ManageStudents = () => {
  const [statedata, setstatedata] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [disableDelete, setDisabledDelete] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // This is used to obtain the data from the server and set it to Hooks for the first time only
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user`
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendDeleteData = async (userid) => {
    setDisabledDelete(true);
    message.warning("Please wait for confirmation. This may take some time");
    // This async function is to send the updated state data to the server for updating the database
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${userid}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        message.success(data);
        setstatedata((previousstatedata) => {
          return previousstatedata.filter((student) => {
            return student.userid !== userid;
          });
        });
      } else if (response.status === 404) {
        message.error("User not found in database");
      } else if (response.status === 500) {
        message.error("Please try again");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisabledDelete(false);
    }
  };

  const sendPatchedData = async (userid) => {
    // This async function is to send the updated state data to the server for updating the database
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/user/${userid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editRec),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        message.success(data);
        setstatedata((previousstatedata) => {
          // here we are updating the previous statedata array by reinserting the objects into the array based on condition
          return previousstatedata.map((student) => {
            if (student.username === editRec.username) {
              return editRec;
            } else {
              return student;
            }
          });
        });
        setIsEditing(false);
        setEditRec(null);
      } else if (response.status === 404) {
        message.error("User not found in database");
      } else if (response.status === 500) {
        message.error("Please try again");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Picture", // This is the column name in table which we can now itself
      dataIndex: "avatar", // This is the column name from the database which is already preassigned
      width: 80,
      render: (link) => {
        // for showing photos
        return <Avatar src={link} />;
      },
    },
    {
      title: "User Id",
      dataIndex: "userid",
      width: 130,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "username",
      width: 200,
      align: "center",
      render: (text) => {
        return text.toUpperCase();
      },
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        return a.username.localeCompare(b.username);
      },
      showSorterTooltip: false,
    },
    {
      title: "Passout Year",
      dataIndex: "passoutyear",
      width: 150,
      align: "center",
      sorter: (a, b) => {
        return a.passoutyear - b.passoutyear;
      },
      showSorterTooltip: false,
    },
    {
      title: "Arrears",
      dataIndex: "arrears",
      width: 100,
      align: "center",
      sorter: (a, b) => {
        return a.arrears - b.arrears;
      },
      showSorterTooltip: false,
    },
    {
      title: "CGPA",
      dataIndex: "cgpa",
      width: 100,
      align: "center",
      sorter: (a, b) => {
        return a.cgpa - b.cgpa;
      },
      showSorterTooltip: false,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (_, record) => {
        // record means the ALL DATA in that ROW only, _ is datatype in dataIndex (here null)
        return (
          <div className="mx-1 flex justify-between">
            <EditFilled
              className={`text-xl text-green-500 ${
                disableDelete ? `pointer-events-none opacity-20` : ``
              }`}
              onClick={() => onClickUpdate(record)}
            />
            <DeleteFilled
              className={`text-xl text-red-500 ${
                disableDelete ? `pointer-events-none opacity-20` : ``
              }`}
              onClick={() => onClickDelete(record)}
            />
          </div>
        );
      },
    },
  ];

  const onClickUpdate = (record) => {
    setIsEditing(true);
    setEditRec({ ...record }); // here we are passing a copy of the record object, not the original record object of the statedata
  };

  const onClickDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this user?`,
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        // sending the updated state data to the backend
        sendDeleteData(record.userid);
      },
    });
  };

  const onCancel = () => {
    setIsEditing(false);
    setEditRec(null);
  };

  const onOk = () => {
    const valueArray = Object.values(editRec); // Object.values creates an array with all values of the 'editRec' object's keys
    const hasEmptyString = valueArray.some((val) => val === "");
    // some method return a boolean true even if any one of the value is an empty string, else it returns false

    if (!hasEmptyString) {
      // sending the updated state data to the backend
      sendPatchedData(editRec.userid);
    } else {
      Modal.error({
        title: "All Fields Required !",
        okButtonProps: { className: "bg-blue-500" },
      });
    }
  };

  const onChangeArrears = (input) => {
    setEditRec((previouseditrec) => {
      let convertedvalue = parseInt(input.target.value, 10);
      let typecheckedvalue = isNaN(convertedvalue) ? "" : convertedvalue;
      if (typecheckedvalue < 0) {
        message.error("Negative number should not be entered");
        return { ...previouseditrec, arrears: "" };
      } else {
        return { ...previouseditrec, arrears: typecheckedvalue };
      }
    });
  };

  const onChangeCgpa = (input) => {
    setEditRec((previouseditrec) => {
      let convertedvalue = parseFloat(input.target.value, 10);
      let typecheckedvalue = isNaN(convertedvalue) ? "" : convertedvalue;
      if (typecheckedvalue < 0) {
        message.error("Negative number should not be entered");
        return { ...previouseditrec, cgpa: "" };
      } else if (typecheckedvalue > 10) {
        message.error("Cgpa must be less than 10");
        return { ...previouseditrec, cgpa: "" };
      } else {
        return { ...previouseditrec, cgpa: typecheckedvalue };
      }
    });
  };

  return (
    <div className="mx-5">
      <div className="flex flex-wrap justify-between items-center">
        <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
          <Typography.Title level={3}>Manage Student Details</Typography.Title>
        </div>
        <span className="mb-1">
          <CSVbutton data={statedata} filename={`All_Student_Details`} />
        </span>
      </div>
      <Table
        className="custom-table"
        bordered
        columns={columns}
        dataSource={statedata}
        scroll={{ y: 500 }}
        pagination={true}
        rowKey="userid"
      ></Table>

      <Modal
        title="Edit Student details"
        open={isEditing}
        okText="Save"
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{ className: "bg-blue-500" }}
      >
        <label htmlFor="arrears">Arrears :</label>
        <Input
          type="number"
          id="arrears"
          value={editRec?.arrears}
          onChange={onChangeArrears}
        />

        <label htmlFor="cgpa">CGPA :</label>
        <Input
          type="number"
          id="cgpa"
          value={editRec?.cgpa}
          onChange={onChangeCgpa}
        />
      </Modal>
    </div>
  );
};

export default ManageStudents;
