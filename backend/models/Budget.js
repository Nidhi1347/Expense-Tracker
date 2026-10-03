const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    month: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

budgetSchema.index(
  { userEmail: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Budget", budgetSchema);