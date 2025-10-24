// backend/routes/monitoringRoutes.js
const express = require("express");
const router = express.Router();
const monitoringController = require("../controllers/monitoringController");

// ✅ For Principal Lecturer: View ALL lecture reports + principal feedback
router.get("/reports/all", monitoringController.getAllReportsWithMonitoring);

// ✅ For Lecturer: View their own reports + feedback
router.get("/lecturer/:lecturerId", monitoringController.getMonitoringByLecturer);

// ✅ NEW: For Program Leader — Lecturer performance based on ratings
router.get("/performance", monitoringController.getLecturerPerformance);

module.exports = router;