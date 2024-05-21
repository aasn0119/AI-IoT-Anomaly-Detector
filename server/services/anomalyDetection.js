const Alert = require("../models/Alert");

const anomalyDetection = async (deviceId, data) => {
  const threshold = 100; // Example threshold

  return data > threshold;
};

module.exports = anomalyDetection;
