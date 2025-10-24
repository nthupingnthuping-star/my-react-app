// backend/routes/principalFeedbackRoutes.js
const express = require("express");
const router = express.Router();
const principalFeedbackController = require("../controllers/principalFeedbackController");

// POST - Add new feedback
router.post("/", principalFeedbackController.createFeedback);

// PUT - Update feedback (within 5 mins)
router.put("/:id", principalFeedbackController.updateFeedback);

// DELETE - Delete feedback (within 5 mins)
router.delete("/:id", principalFeedbackController.deleteFeedback);

// GET - Get feedback for a specific report
router.get("/report/:reportId", principalFeedbackController.getFeedbackByReport);

// ✅ NEW: Get ALL principal feedback (for Program Leader)
router.get("/all", principalFeedbackController.getAllPrincipalFeedback);

module.exports = router;