const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const userId = req.user.id; // Extracted from JWT token

  const income = IncomeSchema({
    title,
    amount,
    category,
    description,
    date,
    user: userId, // Associate income with the logged-in user
  });

  try {
    // Validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || typeof amount !== "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    await income.save();
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getIncomes = async (req, res) => {
  const userId = req.user.id; // Extracted from JWT token

  try {
    const incomes = await IncomeSchema.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Extracted from JWT token

  try {
    const income = await IncomeSchema.findOneAndDelete({
      _id: id,
      user: userId, // Ensure the income belongs to the logged-in user
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
