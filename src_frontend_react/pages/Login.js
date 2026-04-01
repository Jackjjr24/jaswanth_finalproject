import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "CUSTOMER") navigate("/home");
      else if (role === "SELLER") navigate("/seller/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
    }
  }, [isAuthenticated, role, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        await login(email, password, selectedRole);
      } catch (error) {
        setErrors({ form: "Login failed. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>QuitQ Login</h2>

        <div>
          <label>Login As:</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
            }}
          />
          {errors.email && (
            <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: "" });
            }}
          />
          {errors.password && (
            <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.password}
            </p>
          )}
        </div>

        {errors.form && (
          <p style={{ color: "var(--danger)", fontSize: "12px", margin: "10px 0" }}>
            {errors.form}
          </p>
        )}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#64748b" }}>
            New user?
          </p>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "transparent",
              color: "var(--primary)",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              padding: "0",
            }}
          >
            Register here
          </button>
          <p style={{ margin: "12px 0 8px 0", fontSize: "14px", color: "#64748b" }}>
            Forgot your password?
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "transparent",
              color: "var(--primary)",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "underline",
              padding: "0",
            }}
          >
            Reset password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;