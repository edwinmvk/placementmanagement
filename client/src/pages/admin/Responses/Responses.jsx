import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { ClockCircleFilled, RightOutlined } from "@ant-design/icons";

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
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/appliedplacements`
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
      <div className="bg-stone-100 p-2 md:p-5 md:px-8 h-80 max-h-full rounded-lg overflow-y-scroll">
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
                className="bg-white cursor-pointer flex items-center p-2 md:p-3 w-full h-inherit mb-3 rounded-md shadow-sm hover:scale-x-105 transition delay-50 duration-100 ease-in-out"
              >
                <h1 className="w-10 text-slate-700">{index + 1}.</h1>
                <div className="w-full flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-5">
                    <span className="gap-x-2">
                      <h1 className="text-sm text-slate-600">Placement id:</h1>
                      <h1>{placement._id.toUpperCase()}</h1>
                    </span>
                    <span className="gap-x-2">
                      <h1 className="text-sm text-slate-600">Company name: </h1>
                      <h1>{placement.companyname.toUpperCase()}</h1>
                    </span>
                  </div>
                  <div>
                    <RightOutlined />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Responses;
