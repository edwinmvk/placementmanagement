import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Responses = () => {
  const navigate = useNavigate();

  const [statedata, setstatedata] = useState([]);
  const navigateToEditStatus = (id) => {
    navigate(`/admin/responses/editstatus/${id}`);
  };

  useEffect(() => {
    fetchPlacementsList();
  }, []);

  async function fetchPlacementsList() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/appliedplacements"
      );
      const data = await response.json();
      console.log(data);
      setstatedata(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-5">
      <div
        onClick={() => navigateToEditStatus(2022)}
        className="w-full h-20 mb-3 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out"
      >
        <h1>id:2022</h1>
      </div>
      <div
        onClick={() => navigateToEditStatus(2022)}
        className="w-full h-20 bg-gradient-to-br from-fuchsia-100 to-indigo-100 hover:shadow-xl transition delay-50 duration-300 ease-in-out"
      >
        <h1>id:2022</h1>
      </div>
    </div>
  );
};

export default Responses;
