const express = require("express");
const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expense");
const {
  addIncome,
  getIncome,
  deleteIncome,
} = require("../controllers/income");

// Importing the prediction controller
const { predictExpenses } = require("../controllers/prediction");

// Import the protect middleware
const {authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// Income Routes (Protected)
router
  .post("/add-income", authenticateUser, addIncome) // Add income
  .get("/get-income", authenticateUser, getIncome) // Get all incomes
  .delete("/delete-income/:id", authenticateUser, deleteIncome); // Delete income

// Expense Routes (Protected)
router
  .post("/add-expense", authenticateUser, addExpense) // Add expense
  .get("/get-expenses", authenticateUser, getExpense) // Get all expenses
  .delete("/delete-expense/:id", authenticateUser, deleteExpense); // Delete expense

// Prediction Route (Protected)
router.post("/predict-expense", authenticateUser, predictExpenses); // Predict future expenses

module.exports = router;
