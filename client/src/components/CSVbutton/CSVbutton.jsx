import React from "react";
import { CSVLink } from "react-csv";

const CSVbutton = ({ data, filename }) => {
  return (
    <button className="p-1 m-2 bg-green-500 text-white font-sans rounded-md text-sm font-bold">
      <CSVLink
        filename={`${filename}.csv`}
        data={data}
        className="btn btn-primary"
      >
        Export to CSV
      </CSVLink>
    </button>
  );
};

export default CSVbutton;
