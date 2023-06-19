import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";

const Responses = () => {
  const navigate = useNavigate();

  const [statedata, setstatedata] = useState([]);

  useEffect(() => {
    fetchPlacementsList();
  }, []);

  const navigateToEditStatus = (id) => {
    navigate(`/admin/responses/editstatus/${id}`);
  };

  async function fetchPlacementsList() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/appliedplacements"
      );
      const data = await response.json();
      setstatedata(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-5">
      <div className="px-2.5 py-0.5 mb-4 w-fit bg-stone-100 shadow-lg rounded-md">
        <Typography.Title level={3}>Responses</Typography.Title>
      </div>
      <Typography.Title level={5}>
        Click to edit the status of responses
      </Typography.Title>
      <div className="bg-stone-100 p-5 h-screen rounded-lg overflow-y-scroll">
        {statedata.map((placement, index) => {
          return (
            <div
              key={index} // Use index as the key
              onClick={() => navigateToEditStatus(placement._id)}
              className="flex items-center justify-between p-5 w-full h-14 mb-3 rounded-lg shadow-md bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:scale-105 transition delay-50 duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between gap-x-5">
                <span className="flex items-center gap-x-2">
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                    }}
                  >
                    Placement id:
                  </Typography.Title>
                  <h1 className="mt-1">{placement._id.toUpperCase()}</h1>
                </span>
                <span className="flex items-center gap-x-2">
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                    }}
                  >
                    Company name:
                  </Typography.Title>
                  <h1 className="mt-1">
                    {placement.companyname.toUpperCase()}
                  </h1>
                </span>{" "}
              </div>
              <div>
                <RightOutlined />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Responses;
