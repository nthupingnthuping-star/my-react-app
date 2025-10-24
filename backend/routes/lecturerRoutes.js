// routes/lecturerRoutes.js
const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');

router.get('/', lecturerController.getLecturers);
router.get('/ratings-summary', lecturerController.getRatingsSummary);        // ✅
router.get('/ratings/:lecturerId', lecturerController.getRatingsDetails);   // ✅

module.exports = router;