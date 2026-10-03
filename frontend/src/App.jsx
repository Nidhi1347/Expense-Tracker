import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";

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
  Legend
} from "recharts";

const API = "http://localhost:5000/api/expenses";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Education",
  "Bills",
  "Health",
  "Others"
];

const chartColors = [
  "#3159c9",
  "#16a34a",
  "#f59e0b",
  "#9333ea",
  "#ef4444",
  "#0891b2",
  "#64748b"
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [showRegister, setShowRegister] = useState(false);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().slice(0, 10),
    note: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedInUser(null);
    setIsLoggedIn(false);
    setItems([]);
  };

  // Load only logged-in user's transactions
  const load = async () => {
    if (!loggedInUser?.email) return;

    const { data } = await axios.get(API, {
      params: {
        userEmail: loggedInUser.email
      }
    });

    setItems(data);
  };
  // Load monthly budget
const loadBudget = async () => {
  if (!loggedInUser?.email) return;

  const month = new Date().toISOString().slice(0, 7);

  const { data } = await axios.get(
    "http://localhost:5000/api/budget",
    {
      params: {
        userEmail: loggedInUser.email,
        month
      }
    }
  );

  setBudget(Number(data.amount || 0));
  setBudgetInput(data.amount || "");
};
  useEffect(() => {
  if (loggedInUser?.email) {
    load().catch(console.error);
    loadBudget().catch(console.error);
  }
}, [loggedInUser]);

  // Totals
  const totals = useMemo(() => {
    const income = items
      .filter((x) => x.type === "income")
      .reduce((sum, x) => sum + Number(x.amount), 0);

    const expense = items
      .filter((x) => x.type === "expense")
      .reduce((sum, x) => sum + Number(x.amount), 0);

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [items]);

  // Search + Filter
  const filtered = items.filter(
    (x) =>
      (filter === "All" || x.type === filter) &&
      `${x.title} ${x.category} ${x.note}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // Income vs Expense
  const incomeExpenseData = [
    {
      name: "Money",
      income: totals.income,
      expense: totals.expense
    }
  ];

  // Category-wise expense
  const categoryData = useMemo(() => {
    return categories
      .map((category) => {
        const amount = items
          .filter(
            (item) =>
              item.type === "expense" &&
              item.category === category
          )
          .reduce((sum, item) => sum + Number(item.amount), 0);

        return {
          category,
          amount
        };
      })
      .filter((item) => item.amount > 0);
  }, [items]);

  // Monthly income and expense
  const monthlyData = useMemo(() => {
    const months = {};

    items.forEach((item) => {
      const date = new Date(item.date);

      const month = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric"
      });

      if (!months[month]) {
        months[month] = {
          month,
          income: 0,
          expense: 0
        };
      }

      if (item.type === "income") {
        months[month].income += Number(item.amount);
      } else {
        months[month].expense += Number(item.amount);
      }
    });

    return Object.values(months);
  }, [items]);

  // Add / Update Transaction
  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      alert("Please enter title and amount.");
      return;
    }

    if (!loggedInUser?.email) {
      alert("Please login first.");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      userEmail: loggedInUser.email
    };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
      } else {
        await axios.post(API, payload);
      }

      reset();
      await load();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Reset form
  const reset = () => {
    setEditingId(null);

    setForm({
      title: "",
      amount: "",
      category: "Food",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
      note: ""
    });
  };

  // Edit transaction
  const edit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      type: item.type,
      date: new Date(item.date).toISOString().slice(0, 10),
      note: item.note || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Delete transaction
  const remove = async (id) => {
    
    if (confirm("Delete this transaction?")) {
      try {
        await axios.delete(`${API}/${id}`, {
          params: {
            userEmail: loggedInUser.email
          }
        });

        await load();
      } catch (error) {
        console.error(error);
        alert("Unable to delete transaction.");
      }
    }
  };
  // Export transactions to CSV
const exportCSV = () => {
  if (items.length === 0) {
    alert("No transactions available to export.");
    return;
  }

  const headers = [
    "Title",
    "Amount",
    "Category",
    "Type",
    "Date",
    "Note"
  ];

  const rows = items.map((item) => [
    item.title,
    item.amount,
    item.category,
    item.type,
    item.date,
    item.note || ""
  ]);

  const csvContent = [
    headers,
    ...rows
  ]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "expense-tracker-transactions.csv";

  link.click();

  URL.revokeObjectURL(url);
};

  // Login / Register screen
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => {
            alert("Registration successful! Please login.");
            setShowRegister(false);
          }}
          onLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => {
          const user = JSON.parse(localStorage.getItem("user"));

          setLoggedInUser(user);
          setIsLoggedIn(true);
        }}
        onRegister={() => setShowRegister(true)}
      />
    );
  }
return (
  <BrowserRouter>
    <div className="app-layout">

      <aside className="sidebar">
        <h2>💰 Expense Tracker</h2>

        <nav>
          <NavLink to="/dashboard">🏠 Dashboard</NavLink>
          <NavLink to="/add-transaction">➕ Add Transaction</NavLink>
          <NavLink to="/transactions">📋 Transactions</NavLink>
          <NavLink to="/analytics">📊 Analytics</NavLink>
          <NavLink to="/budget">💰 Budget</NavLink>
        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </aside>

      <div className="main-content">

        <header className="app-header">
          <div>
            <h1>Expense Tracker</h1>

            <div className="welcome-box">
              <h2>
                👋 Welcome, {loggedInUser?.email || "User"}!
              </h2>

              <p>
                Manage your income and expenses easily.
              </p>
            </div>
          </div>
        </header>

        <section className="cards">

          <div className="card">
            <span>Total Income</span>
            <b>₹{totals.income.toFixed(2)}</b>
          </div>

          <div className="card">
            <span>Total Expenses</span>
            <b>₹{totals.expense.toFixed(2)}</b>
          </div>

          <div className="card">
            <span>Balance</span>
            <b>₹{totals.balance.toFixed(2)}</b>
          </div>

          <div className="card">
            <span>Transactions</span>
            <b>{items.length}</b>
          </div>

        </section>

        <main>
          <Routes>

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="/dashboard"
              element={
                <Dashboard
                  items={items}
                  budget={budget}
                />
              }
            />

            <Route
              path="/add-transaction"
              element={
                <AddTransaction
                  form={form}
                  setForm={setForm}
                  submit={submit}
                  editingId={editingId}
                  reset={reset}
                />
              }
            />

            <Route
              path="/transactions"
              element={
                <Transactions
                  filtered={filtered}
                  search={search}
                  setSearch={setSearch}
                  filter={filter}
                  setFilter={setFilter}
                  edit={edit}
                  remove={remove}
                  exportCSV={exportCSV}
                />
              }
            />

            <Route
              path="/analytics"
              element={
                <Analytics
                  items={items}
                />
              }
            />

            <Route
              path="/budget"
              element={
                <Budget
                  budget={budget}
                  budgetInput={budgetInput}
                  setBudgetInput={setBudgetInput}
                  saveBudget={async () => {
                    if (!budgetInput || Number(budgetInput) <= 0) {
                      alert("Please enter a valid budget.");
                      return;
                    }

                    try {
                      const month = new Date()
                        .toISOString()
                        .slice(0, 7);

                      await axios.post(
                        "http://localhost:5000/api/budget",
                        {
                          userEmail: loggedInUser.email,
                          month,
                          amount: Number(budgetInput)
                        }
                      );

                      setBudget(Number(budgetInput));

                      alert(
                        "Monthly budget saved successfully!"
                      );
                    } catch (error) {
                      console.error(error);
                      alert("Unable to save budget.");
                    }
                  }}
                  expenses={totals.expense}
                />
              }
            />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

          </Routes>
        </main>

      </div>
    </div>
  </BrowserRouter>
);
}

export default App;