import React from "react";

function Transactions({
  filtered,
  search,
  setSearch,
  filter,
  setFilter,
  edit,
  remove,
  exportCSV,
}) {
  return (
    <div className="page">
      <div className="transactions-header">
        <h1>📋 Transactions</h1>

        <button onClick={exportCSV}>
          📥 Export CSV
        </button>
      </div>

      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>₹{Number(item.amount).toFixed(2)}</td>
                    <td>{item.type}</td>
                    <td>{item.category}</td>
                    <td>{item.date}</td>
                    <td>{item.note || "-"}</td>

                    <td>
                      <button onClick={() => edit(item)}>
                        ✏️ Edit
                      </button>

                      <button onClick={() => remove(item._id)}>
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;