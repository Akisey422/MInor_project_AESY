const axios = require("axios");

exports.predictExpenses = async (req, res) => {
  try {
    // Sending the request to the Flask server running on localhost:5000
    const response = await axios.post(
      "http://localhost:5000/predict",
      req.body
    );
    res.status(200).json(response.data); // Returning the prediction response
  } catch (error) {
    res.status(500).json({ message: "Error predicting expenses" });
  }
};
