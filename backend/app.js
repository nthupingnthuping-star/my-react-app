const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
require("dotenv").config();

// Route imports
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const classesRoutes = require("./routes/classesRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const ratingsRoutes = require("./routes/ratingsRoutes");
const coursesRoutes = require("./routes/coursesRoutes");
const facultiesRoutes = require("./routes/facultiesRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const lecturerRoutes = require("./routes/lecturerRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const principalFeedbackRoutes = require("./routes/principalFeedbackRoutes");

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server

// =======================
// ✅ WebSocket Server Setup
// =======================
const wss = new WebSocket.Server({ 
  server, 
  path: "/ws" // This matches your frontend's /ws path
});

wss.on('connection', (ws) => {
  console.log('✅ WebSocket client connected');
  
  // Send welcome message when client connects
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to WebSocket server successfully!'
  }));
  
  ws.on('message', (message) => {
    try {
      console.log('📨 Received WebSocket message:', message.toString());
      
      // Echo back the message (you can modify this logic)
      ws.send(JSON.stringify({
        type: 'echo',
        message: `Server received: ${message.toString()}`
      }));
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('❌ WebSocket client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// =======================
// ✅ Express Middleware
// =======================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// =======================
// ✅ Existing Routes
// =======================
app.use("/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/ratings", ratingsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/faculties", facultiesRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/principal-feedback", principalFeedbackRoutes);

// =======================
// ✅ Root Route
// =======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 LUCT Reporting API is running successfully!",
    websocket: `ws://localhost:${process.env.PORT || 5000}/ws`
  });
});

// =======================
// ✅ 404 Fallback
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// =======================
// ✅ Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// =======================
// ✅ Start Server (IMPORTANT: Use server.listen not app.listen)
// =======================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ HTTP Server running on port ${PORT}`);
  console.log(`✅ WebSocket Server running on ws://localhost:${PORT}/ws`);
});

module.exports = app;