import React from "react";
import DataChart from "./components/DataChart";

const App = () => {
  return (
    <div>
      <DataChart
        apiEndpoint="http://localhost:4000/api/temperature"
        threshold={80}
        title={"temperature"}
      />
      <DataChart
        apiEndpoint="http://localhost:4000/api/heat"
        threshold={120}
        title={"threshold"}
      />
      {/* Add more DataChart instances for other types of data */}
    </div>
  );
};

export default App;
