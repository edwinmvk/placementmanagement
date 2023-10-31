import React from "react";
import { CSVLink } from "react-csv";

const CSVbutton = ({ data, filename }) => {
  return (
    <button className="p-1 px-2 m-2 bg-lime-600 hover:bg-lime-500 text-white font-sans rounded-lg text-sm font-semibold">
      <CSVLink filename={filename} data={data}>
        Export
      </CSVLink>
    </button>
  );
};

export default CSVbutton;
