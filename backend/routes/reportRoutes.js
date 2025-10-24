const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET reports for a specific lecturer (by user_id)
router.get("/user/:userId", reportController.getReportsByLecturer);

// GET single report (public read — or restrict if needed)
router.get("/:id", reportController.getReportById);

// POST create new report
router.post("/", reportController.createReport);

// PUT update report
router.put("/:id", reportController.updateReport);

// DELETE report
router.delete("/:id", reportController.deleteReport);

module.exports = router;