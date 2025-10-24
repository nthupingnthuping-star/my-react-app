// backend/routes/ratingsRoutes.js
const express = require("express");
const router = express.Router();
const ratingsController = require("../controllers/ratingsController");

// ✅ Only allow students to SUBMIT a rating
router.post("/", ratingsController.createRating);


module.exports = router;