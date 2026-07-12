import "./LoginPage.css";
import { useState } from "react";
import { toast } from "react-toastify";
function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [role, setRole] = useState("dispatcher");
  function handleSubmit(e) {
    e.preventDefault();
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Login successful!");
    // console.log("Email:", email);
    // console.log("Password:", password);
    // console.log("Role:", role);
  }
  return (
    <main className="login-page">
      <section className="login-page-left">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true" />
          <h1>TransitOps</h1>
          <p>Smart Transport Operations Platform</p>
        </div>

        <div className="roles-block">
          <h2>One login, four roles:</h2>
          <ul>
            <li>Fleet Manager</li>
            <li>Dispatcher</li>
            <li>Safety Officer</li>
            <li>Financial Analyst</li>
          </ul>
        </div>

        <p className="left-footer">TRANSITOPS © 2026 · RBAC · EMAIL</p>
      </section>

      <section className="login-page-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <header className="form-heading">
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to continue</p>
          </header>

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              type="email"
              placeholder="Ravenk@transitops.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">ROLE (RBAC)</label>
            <select
              id="role"
              defaultValue="dispatcher"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="fleet-manager">Fleet Manager</option>
              <option value="dispatcher">Dispatcher</option>
              <option value="safety-officer">Safety Officer</option>
              <option value="financial-analyst">Financial Analyst</option>
            </select>
          </div>

          <div className="form-row">
            <label className="remember-row" htmlFor="remember">
              <input id="remember" type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>

          <div className="access-note">
            <p>Access is scoped by role after login:</p>
            <ul>
              <li>Fleet Manager → Fleet, Maintenance</li>
              <li>Dispatcher → Dashboard, Trips</li>
              <li>Safety Officer → Drivers, Compliance</li>
              <li>Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
