const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  type: {
    type: String,
    default: "Anamoly",
  },
  message: {
    type: String,
    default: "Anamoly Detected",
  },
});

module.exports = mongoose.model("Alert", alertSchema);
