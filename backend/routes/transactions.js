const express = require("express");
const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expense");
const {
  addIncome,
  getIncomes,
  deleteIncome,
} = require("../controllers/income");

// Importing the prediction controller
const { predictExpenses } = require("../controllers/prediction");

// Import the protect middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Income Routes (Protected)
router
  .post("/add-income", protect, addIncome) // Add income
  .get("/get-incomes", protect, getIncomes) // Get all incomes
  .delete("/delete-income/:id", protect, deleteIncome); // Delete income

// Expense Routes (Protected)
router
  .post("/add-expense", protect, addExpense) // Add expense
  .get("/get-expenses", protect, getExpense) // Get all expenses
  .delete("/delete-expense/:id", protect, deleteExpense); // Delete expense

// Prediction Route (Protected)
router.post("/predict-expenses", protect, predictExpenses); // Predict future expenses

module.exports = router;
