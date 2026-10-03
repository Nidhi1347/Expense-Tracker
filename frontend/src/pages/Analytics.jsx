import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Analytics({ items }) {
  const income = items
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = items
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const incomeExpenseData = [
    { name: "Income", amount: income },
    { name: "Expenses", amount: expenses },
  ];

  const categories = {};

  items
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categories[item.category] =
        (categories[item.category] || 0) + Number(item.amount);
    });

  const categoryData = Object.entries(categories).map(
    ([name, amount]) => ({
      name,
      amount,
    })
  );

  const monthly = {};

  items.forEach((item) => {
    const month = item.date?.slice(0, 7);

    if (!month) return;

    if (!monthly[month]) {
      monthly[month] = {
        month,
        income: 0,
        expenses: 0,
      };
    }

    if (item.type === "income") {
      monthly[month].income += Number(item.amount);
    } else {
      monthly[month].expenses += Number(item.amount);
    }
  });

  const monthlyData = Object.values(monthly);

  return (
    <div className="page">
      <h1>📊 Analytics</h1>

      <div className="panel">
        <h2>Income vs Expenses</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={incomeExpenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel">
        <h2>Expenses by Category</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="panel">
        <h2>Monthly Income vs Expenses</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="income"
              name="Income"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;