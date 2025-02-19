const ExpenseSchema = require("../models/ExpenseModel");
const { authenticateUser } = require("../middleware/authMiddleware");

exports.addExpense = async (req, res) => {
  authenticateUser(req, res, async () => {
    const { title, amount, category, description, date } = req.body;

    const expense = new ExpenseSchema({
      //?userId: req.user.id, // Associate expense with logged-in user
      title,
      amount,
      category,
      description,
      date,
    });

    try {
      if (!title || !category || !description || !date) {
        return res.status(400).json({ message: "All fields are required!" });
      }
      if (amount <= 0 || typeof amount !== "number") {
        return res
          .status(400)
          .json({ message: "Amount must be a positive number!" });
      }

      await expense.save();
      res.status(200).json({ message: "Expense Added" });
    } catch (error) {
      console.error("Error adding expense:", error); // Log the error to the console
      res.status(500).json({ message: "Server Error", error: error.message }); // Include the error message
    }
  });
};

exports.getExpense = async (req, res) => {
  authenticateUser(req, res, async () => {
    try {
      const expenses = await ExpenseSchema.find().sort({
        createdAt: -1,
      });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
};

exports.deleteExpense = async (req, res) => {
  authenticateUser(req, res, async () => {
    const { id } = req.params;
    try {
      const expense = await ExpenseSchema.findOneAndDelete({
        _id: id,
      });
      if (!expense)
        return res.status(404).json({ message: "Expense not found" });

      res.status(200).json({ message: "Expense Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
};
