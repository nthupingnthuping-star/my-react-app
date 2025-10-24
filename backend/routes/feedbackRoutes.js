const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// 👇 FOR LECTURERS: View their own feedback
router.get("/ratings/:lecturerId", feedbackController.getRatingsByLecturer);
router.get("/complaints/:lecturerId", feedbackController.getComplaintsByLecturer);

// 👇 FOR PRINCIPAL: View ALL lecturers' rating summary
router.get("/ratings-summary", feedbackController.getRatingsSummary);

// 👇 (Optional) Get detailed ratings for a specific lecturer (e.g., for modal or drill-down)
router.get("/ratings/details/:lecturerId", feedbackController.getRatingsDetails);

module.exports = router;