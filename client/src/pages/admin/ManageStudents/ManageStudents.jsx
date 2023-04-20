import React, { useState, useEffect } from "react";
import { Typography, Table, Avatar, Modal, Input } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { LocalDetails } from "./LocalDetails";

const ManageStudents = () => {
  const [statedata, setstatedata] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRec, setEditRec] = useState(null);

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

  const columns = [
    {
      title: "Picture", // This is the column name in table which we can now itself
      dataIndex: "picture", // This is the column name from the database which is already preassigned
      width: 80,
      render: (link) => {
        // for showing photos
        return <Avatar src={link} />;
      },
    },
    {
      title: "Username",
      dataIndex: `username`,
      width: 130,
      render: (text) => {
        return text.toUpperCase();
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Passout Year",
      dataIndex: "passoutyear",
      sorter: true,
      width: 150,
    },
    {
      title: "Arrears",
      dataIndex: "arrears",
      sorter: true,
      width: 100,
    },
    {
      title: "SGPA",
      dataIndex: "sgpa",
      sorter: true,
      width: 100,
    },
    {
      title: "Actions",
      width: 100,
      render: (_, record) => {
        // record means the ALL DATA in that ROW only, _ is datatype in dataIndex (here null)
        return (
          <div className="mx-1 flex justify-between">
            <EditFilled
              className="text-xl text-green-500"
              onClick={() => onClickUpdate(record)}
            />
            <DeleteFilled
              className="text-xl text-red-500"
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
        setstatedata((previousstatedata) => {
          return previousstatedata.filter((student) => {
            return student.username !== record.username;
          });
        });

        // // sending the updated state data to the backend
        // sendUpdatedData();
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
      setstatedata((previousstatedata) => {
        // here we are updating the previous statedata array by reinserting the objects into the array based on condition
        return previousstatedata.map((student) => {
          if (student.username === editRec.username) return editRec;
          else return student;
        });
      });

      // // sending the updated state data to the backend
      // sendUpdatedData();

      setIsEditing(false);
      setEditRec(null);
    } else {
      Modal.error({
        title: "All Fields Required !",
        okButtonProps: { className: "bg-blue-500" },
      });
    }
  };

  const onChangeYear = (input) => {
    setEditRec((previouseditrec) => {
      // here we are updating the old year key in previoseditrecord with the new year key
      let convertedvalue = parseInt(input.target.value, 10); // the inputed value is converted to an integer
      let checkedvalue = isNaN(convertedvalue) ? "" : convertedvalue; // if its of type NaN, i.e.,empty string, then we return an ""
      return { ...previouseditrec, passoutyear: checkedvalue };
    });
  };

  const onChangeArrears = (input) => {
    setEditRec((previouseditrec) => {
      let convertedvalue = parseInt(input.target.value, 10);
      let checkedvalue = isNaN(convertedvalue) ? "" : convertedvalue;
      return { ...previouseditrec, arrears: checkedvalue };
    });
  };

  const onChangeSgpa = (input) => {
    setEditRec((previouseditrec) => {
      let convertedvalue = parseFloat(input.target.value, 10);
      let checkedvalue = isNaN(convertedvalue) ? "" : convertedvalue;
      return { ...previouseditrec, sgpa: checkedvalue };
    });
  };

  return (
    <div className="mx-5">
      <Typography.Title level={3}>Manage Student Details</Typography.Title>

      <Table
        bordered
        columns={columns}
        dataSource={statedata}
        scroll={{ y: 500 }}
        pagination={true}
      ></Table>

      <Modal
        title="Edit Student details"
        open={isEditing}
        okText="Save"
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{ className: "bg-blue-500" }}
      >
        <label htmlFor="passoutyear">Passout year :</label>
        <Input
          type="number"
          id="passoutyear"
          value={editRec?.passoutyear}
          onChange={onChangeYear}
        />

        <label htmlFor="arrears">Arrears :</label>
        <Input
          type="number"
          id="arrears"
          value={editRec?.arrears}
          onChange={onChangeArrears}
        />

        <label htmlFor="sgpa">SGPA :</label>
        <Input
          type="number"
          id="sgpa"
          value={editRec?.sgpa}
          onChange={onChangeSgpa}
        />
      </Modal>
    </div>
  );
};

export default ManageStudents;
