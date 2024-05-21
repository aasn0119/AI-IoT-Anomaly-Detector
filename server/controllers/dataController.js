const Device = require("../models/Device");
const detectAnomaly = require("../services/anomalyDetection");
const Alert = require("../models/Alert");

exports.receiveData = async (req, res) => {
  const { deviceId, data } = req.body;
  const newData = new Device({ deviceId, data });

  try {
    await newData.save();

    // Ensure that the anomaly detection logic is only executed once
    const isAnomaly = await detectAnomaly(deviceId, data);

    if (isAnomaly) {
      // Avoid duplicate alert creation
      const existingAlert = await Alert.findOne({
        deviceId,
        data,
        timestamp: new Date(Date.now() - 1000),
      });

      if (!existingAlert) {
        const alert = new Alert({
          deviceId,
          data,
          severity: data > 200 ? "high" : "medium",
          message: `Anomaly detected for device ${deviceId} with data ${data} at ${new Date().toISOString()}`,
        });
        await alert.save();
        req.io.emit("anomaly", alert); // Emit the alert to connected clients
      }
    }
    res.status(200).send("Data received");
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};
