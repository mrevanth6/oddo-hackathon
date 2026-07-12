import "./LoginPage.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// IMport env variable for backend URI
const BACKEND_URI = import.meta.env.VITE_API_URL;
function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const navigate = useNavigate();
 async function handleSubmit(e) {
    e.preventDefault();
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try{
      console.log("Submitting login form with:", { email, password, role });
      const response=await axios.post(`${BACKEND_URI}/api/auth/login`,{email,password,role});
      console.log("Login response:", response); // Log the response data for debugging
      if(response.status===200){
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        navigate("/dashboard"); // Redirect to the dashboard page after successful login
        toast.success("Login successful! Redirecting to dashboard...");
      }

    } catch (error) {
      console.log("Login error:", error.response ? error.response.data : error.message); // Log the error for debugging
      toast.error("Invalid email or password.");
    }
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
              
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Fleet Manager">Fleet Manager</option>
              <option value="Dispatcher">Dispatcher</option>
              <option value="Safety Officer">Safety Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
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
