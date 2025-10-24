// backend/routes/classesRoutes.js
const express = require("express");
const router = express.Router();
const classesController = require("../controllers/classesController");

// GET all classes
router.get("/", classesController.getAllClasses);

// GET single class by ID
router.get("/:id", classesController.getClassById);

// POST create new class
router.post("/", classesController.createClass);

// PUT update class
router.put("/:id", classesController.updateClass);

// DELETE class
router.delete("/:id", classesController.deleteClass);

module.exports = router;