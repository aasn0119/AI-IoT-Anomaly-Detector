const express = require("express");
const router = express.Router();
const { receiveData, getDevices, getAlerts } = require("../controllers/dataController");

router.post("/data", receiveData);
router.get("/devices", getDevices);
router.get("/alerts", getAlerts);

module.exports = router;
