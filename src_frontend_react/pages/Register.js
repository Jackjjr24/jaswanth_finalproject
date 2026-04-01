import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SECURITY_QUESTIONS = [
  "What city were you born in?",
  "What is your favorite book?",
  "What is your favorite movie?",
  "What is your secret keyword?",
];

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const [securityQuestion1, setSecurityQuestion1] = useState(SECURITY_QUESTIONS[0]);
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState(SECURITY_QUESTIONS[1]);
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!securityAnswer1 || securityAnswer1.trim() === "") {
      newErrors.securityAnswer1 = "Answer to question 1 is required";
    }

    if (!securityAnswer2 || securityAnswer2.trim() === "") {
      newErrors.securityAnswer2 = "Answer to question 2 is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register(name, email, password, selectedRole, {
          question1: securityQuestion1,
          answer1: securityAnswer1.toLowerCase().trim(),
          question2: securityQuestion2,
          answer2: securityAnswer2.toLowerCase().trim(),
        });
        navigate("/login");
      } catch (error) {
        setErrors({ form: error.message });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>

        <div>
          <label>Register As:</label>
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
          </select>
        </div>

        {errors.form && (
          <p style={{ color: "var(--danger)", fontSize: "13px", margin: "10px 0", textAlign: "center" }}>
            {errors.form}
          </p>
        )}

        <div>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({ ...errors, name: "" });
            }}
          />
          {errors.name && (
            <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.name}
            </p>
          )}
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

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors({ ...errors, confirmPassword: "" });
            }}
          />
          {errors.confirmPassword && (
            <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "13px", fontWeight: "500", marginBottom: "12px", color: "#334155" }}>
            Security Questions (for password recovery)
          </p>

          <div>
            <label style={{ fontSize: "12px", color: "#475569" }}>Question 1:</label>
            <select
              value={securityQuestion1}
              onChange={(e) => {
                setSecurityQuestion1(e.target.value);
                setErrors({ ...errors, securityAnswer1: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              {SECURITY_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <input
              placeholder="Your answer"
              value={securityAnswer1}
              onChange={(e) => {
                setSecurityAnswer1(e.target.value);
                setErrors({ ...errors, securityAnswer1: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
            {errors.securityAnswer1 && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
                {errors.securityAnswer1}
              </p>
            )}
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={{ fontSize: "12px", color: "#475569" }}>Question 2:</label>
            <select
              value={securityQuestion2}
              onChange={(e) => {
                setSecurityQuestion2(e.target.value);
                setErrors({ ...errors, securityAnswer2: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              {SECURITY_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q}>
                  {q}
                </option>
              ))}
            </select>
            <input
              placeholder="Your answer"
              value={securityAnswer2}
              onChange={(e) => {
                setSecurityAnswer2(e.target.value);
                setErrors({ ...errors, securityAnswer2: "" });
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
                boxSizing: "border-box",
              }}
            />
            {errors.securityAnswer2 && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
                {errors.securityAnswer2}
              </p>
            )}
          </div>
        </div>

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#64748b" }}>
            Already have an account?
          </p>
          <button
            onClick={() => navigate("/login")}
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
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;