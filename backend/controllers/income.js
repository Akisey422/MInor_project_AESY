const IncomeSchema = require("../models/IncomeModel");
const { authenticateUser } = require("../middleware/authMiddleware");

exports.addIncome = async (req, res) => {
  authenticateUser(req, res, async () => {
    
    const { title, amount, category, description, date } = req.body;

    const income = new IncomeSchema({
      // ?userId: req.user.id,
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
        return res.status(400).json({ message: "Amount must be a positive number!" });
      }

      await income.save();
      res.status(200).json({ message: "Income Added" });
    } catch (error) {
      console.error("Error adding income:", error); // Log the error to the console
      res.status(500).json({ message: "Server Error", error: error.message }); // Include the error message
    }
  });
};

exports.getIncome = async (req, res) => {
  authenticateUser(req, res, async () => {
    try {
      // Fetch incomes for the authenticated user
      const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
      res.status(200).json(incomes);
    } catch (error) {
      console.error(error); // Log the error for better debugging
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
};


exports.deleteIncome = async (req, res) => {
  authenticateUser(req, res, async () => {
    const { id } = req.params;
    try {
      const income = await IncomeSchema.findOneAndDelete({ _id: id});
      if (!income) return res.status(404).json({ message: "Income not found" });

      res.status(200).json({ message: "Income Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });
};

