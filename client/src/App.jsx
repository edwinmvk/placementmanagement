import React from "react";
import ContextProvider from "./utils/ContextProvider";
import RoutesDef from "./utils/RoutesDef";
import "./App.css";

const App = () => {
  return (
    <ContextProvider>
      <div className="App">
        <RoutesDef />
      </div>
    </ContextProvider>
  );
};

export default App;
