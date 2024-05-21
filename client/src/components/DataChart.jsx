import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const socket = io("http://localhost:4000");

const DataChart = ({ apiEndpoint, threshold, title }) => {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData(); // Fetch initial data

    socket.on("data", (newData) => {
      setData((prevData) => [...prevData, newData]);
      // Check if the threshold value exceeds a fixed limit
      if (newData.data > threshold) {
        // If the threshold exceeds the limit, trigger an alert
        setAlerts((prevAlerts) => [
          ...prevAlerts,
          { message: "Threshold value exceeded!", timestamp: newData.timestamp },
        ]);
      }
    });

    socket.on("alert", (alertData) => {
      setAlerts((prevAlerts) => [...prevAlerts, alertData]);
    });

    return () => {
      socket.off("data");
      socket.off("alert");
    };
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Real-time Data Monitoring for {title}
      </h1>
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-700">Alerts:</h2>
      <div className="mb-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-2"
          >
            {alert.message} - {new Date(alert.timestamp).toLocaleString()}
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2 text-center text-gray-700">
        Data Chart:
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="data"
            stroke="#3182ce"
            strokeWidth={2}
            dot={{ stroke: "#3182ce", fill: "#3182ce", strokeWidth: 4, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataChart;
