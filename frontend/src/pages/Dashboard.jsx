import React from "react";

function Dashboard({ items, budget }) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expenses;

  return (
    <div className="page">
      <h1>🏠 Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p>₹{income.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p>₹{expenses.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Balance</h3>
          <p>₹{balance.toFixed(2)}</p>
        </div>

        <div className="summary-card">
          <h3>Monthly Budget</h3>
          <p>₹{Number(budget || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="panel">
        <h2>Welcome to Expense Tracker 👋</h2>
        <p>
          Manage your income, expenses, transactions, analytics and monthly
          budget from one place.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;