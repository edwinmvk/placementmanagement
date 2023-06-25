import React from "react";
import { CSVLink } from "react-csv";

const CSVbutton = ({ data, filename }) => {
  return (
    <button className="p-1 m-2 bg-lime-600 hover:bg-lime-500 text-white font-sans rounded-md text-sm font-semibold">
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
