const Expense = require("../models/Expense");

// Get expenses of logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const { userEmail } = req.query;

    const expenses = await Expense.find({
      userEmail
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const item = await Expense.create(req.body);

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const item = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        userEmail: req.body.userEmail
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!item) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const item = await Expense.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.query.userEmail
    });

    if (!item) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.json({
      message: "Transaction deleted"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};