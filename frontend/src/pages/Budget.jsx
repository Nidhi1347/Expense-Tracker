import React from "react";

function Budget({
  budget,
  budgetInput,
  setBudgetInput,
  saveBudget,
  expenses,
}) {
  const budgetAmount = Number(budget || 0);
  const totalExpenses = Number(expenses || 0);

  const remaining = budgetAmount - totalExpenses;

  const percentage =
    budgetAmount > 0
      ? Math.min((totalExpenses / budgetAmount) * 100, 100)
      : 0;

  return (
    <div className="page">
      <h1>💰 Monthly Budget</h1>

      <div className="panel">
        <h2>Set Your Budget</h2>

        <div className="budget-form">
          <input
            type="number"
            placeholder="Enter monthly budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
          />

          <button onClick={saveBudget}>
            Save Budget
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>Budget Overview</h2>

        <div className="budget-details">
          <p>
            <strong>Budget:</strong> ₹{budgetAmount.toFixed(2)}
          </p>

          <p>
            <strong>Expenses:</strong> ₹{totalExpenses.toFixed(2)}
          </p>

          <p>
            <strong>Remaining:</strong> ₹{remaining.toFixed(2)}
          </p>
        </div>

        <div className="budget-progress">
          <div
            className="budget-progress-fill"
            style={{ width: `${percentage}%` }}
          >
            {percentage.toFixed(0)}%
          </div>
        </div>

        {budgetAmount > 0 && totalExpenses > budgetAmount && (
          <p className="budget-warning">
            ⚠️ You have exceeded your monthly budget!
          </p>
        )}

        {budgetAmount > 0 &&
          totalExpenses <= budgetAmount &&
          percentage >= 80 && (
            <p className="budget-warning">
              ⚠️ You are close to your monthly budget limit.
            </p>
          )}
      </div>
    </div>
  );
}

export default Budget;