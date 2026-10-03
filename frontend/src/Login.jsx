import { useState } from "react";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    // Demo login - any email and password accepted
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
      })
    );

    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Expense Tracker</h1>

        <p className="login-subtitle">
          Login to manage your expenses
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="register-text">
          Don't have an account?

          <button
            type="button"
            className="register-link"
            onClick={onRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;