import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { ClockCircleFilled, RightOutlined } from "@ant-design/icons";
import DomainNames from "../../../utils/DomainNames.json";

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
        `${DomainNames.netlify}/api/appliedplacement`
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
        <Typography.Title level={3}>Student Responses</Typography.Title>
      </div>
      <Typography.Title level={5}>
        Click to edit the status of responses
      </Typography.Title>
      <div className="bg-stone-100 p-5 px-8 h-80 max-h-full rounded-lg overflow-y-scroll">
        {statedata.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col justify-center items-center">
              <ClockCircleFilled className="text-6xl opacity-30" />
              <h1 className="m-6 text-xl opacity-30">No responses currently</h1>
            </div>
          </div>
        ) : null}
        {statedata
          // the statedata is first sorted and then mapped
          .sort((a, b) => a.companyname.localeCompare(b.companyname))
          .map((placement, index) => {
            return (
              <div
                key={index} // Use index as the key
                onClick={() => navigateToEditStatus(placement._id)}
                className="bg-white cursor-pointer flex items-center justify-between p-5 w-full h-14 mb-3 rounded-md shadow-sm hover:scale-x-105 transition delay-50 duration-100 ease-in-out"
              >
                <div className="flex items-center justify-between gap-x-5">
                  <span className="flex items-center">
                    <h1 className="mt-1">{index + 1}.</h1>
                  </span>
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
                  </span>
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
