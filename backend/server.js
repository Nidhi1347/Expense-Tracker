const budgetRoutes = require("./routes/budgetRoutes");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Expense Tracker API is running" }));
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
