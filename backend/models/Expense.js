const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userEmail: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
},

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Education",
        "Bills",
        "Health",
        "Others",
      ],
    },

    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);