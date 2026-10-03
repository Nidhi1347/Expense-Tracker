import { useState } from "react";

function Register({ onRegister, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getPasswordStrength = (password) => {
    if (!password) return "";

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score <= 2) return "Medium";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    alert("Registration successful! Please login.");

    setName("");
    setEmail("");
    setPassword("");

    onRegister();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Create Account</h1>

        <p className="login-subtitle">
          Register to manage your expenses
        </p>

        <form onSubmit={handleSubmit}>
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {passwordStrength && (
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              Password Strength: <strong>{passwordStrength}</strong>
            </p>
          )}

          <button type="submit" className="login-button">
            Register
          </button>
        </form>

        <p className="register-text">
          Already have an account?

          <button
            type="button"
            className="register-link"
            onClick={onLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;