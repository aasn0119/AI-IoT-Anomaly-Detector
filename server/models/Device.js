const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  deviceName: {
    type: String,
  },
  deviceId: {
    type: String,
    required: true,
  },
  data: {
    type: Number,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
