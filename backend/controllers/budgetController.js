const Budget = require("../models/Budget");

// Get user's budget for a month
exports.getBudget = async (req, res) => {
  try {
    const { userEmail, month } = req.query;

    const budget = await Budget.findOne({
      userEmail,
      month
    });

    res.json(budget || { amount: 0 });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Create or update budget
exports.setBudget = async (req, res) => {
  try {
    const { userEmail, month, amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        userEmail,
        month
      },
      {
        userEmail,
        month,
        amount: Number(amount)
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(budget);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};