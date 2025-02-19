const axios = require("axios");
const { authenticateUser } = require("../middleware/authMiddleware");

exports.predictExpenses = async (req, res) => {
  authenticateUser(req, res, async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        req.body
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error predicting expenses" });
    }
  });
};
