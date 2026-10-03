const express = require("express");

const router = express.Router();

const {
  getBudget,
  setBudget
} = require("../controllers/budgetController");

// Get budget
router.get("/", getBudget);

// Create / Update budget
router.post("/", setBudget);

module.exports = router;