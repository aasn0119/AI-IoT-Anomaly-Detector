const mongoose = require("mongoose");
const Device = require("../../models/Device");
const Alert = require("../../models/Alert");
const detectAnomaly = require("../../services/anomalyDetection");
const chai = require("chai");

chai.should(); // Using Should style assertion from chai library for more readability and less code writing in test cases.

describe("Anomoly Detection Service", () => {
  before((done) => {
    mongoose.connect(
      "mongodb://localhost:27017/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        mongoose.connection.db.dropDatabase(() => {
          done();
        });
      }
    );
  });
  it("should detect an anomaly if data exceeds the threshold", (done) => {
    const data = 150;
    detectAnomaly("device1", data).then((isAnomaly) => {
      isAnomaly.should.be.true;

      Alert.findOne({ deviceId: "device1" }, (err, alert) => {
        chai.expect(alert).to.not.be.null;
        chai.expect(alert.data).to.equal(150);
        chai.expect(alert.severity).to.equal("medium");
        chai
          .except(alert.message)
          .to.equal("Anomaly detected for device device1 with value 150");
        done();
      });
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
