import React from "react";

function AddTransaction({
  form,
  setForm,
  submit,
  editingId,
  reset,
}) {
  return (
    <div className="page">
      <h1>➕ {editingId ? "Edit Transaction" : "Add Transaction"}</h1>

      <div className="panel">
        <form onSubmit={submit} className="form-grid">

          <div>
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="Enter title"
              required
            />
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Education</option>
              <option>Bills</option>
              <option>Health</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Note</label>
            <input
              type="text"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
              placeholder="Optional note"
            />
          </div>

          <div className="form-buttons">
            <button type="submit">
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>

            <button type="button" onClick={reset}>
              Clear
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddTransaction;