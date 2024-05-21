const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const api = require("./routes/api");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your React app's URL
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your React app's URL
  })
);

// Middleware to make io available in all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", api);

io.on("connection", (socket) => {
  console.log("New client connected");

  // Emit data periodically or on events
  setInterval(async () => {
    const timestamp = Date.now();
    const data = Math.floor(Math.random() * 200 + 10);
    socket.emit("data", { timestamp, data });
  }, 2000); // Fetch alert data every 5 seconds

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
