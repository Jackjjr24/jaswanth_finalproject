import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: enter email, 2: answer questions, 3: new password
  const [email, setEmail] = useState("");
  const [securityQuestion1, setSecurityQuestion1] = useState("");
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = () => {
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    // Get user data from localStorage
    const userDataStr = localStorage.getItem(`user_${email}`);
    if (!userDataStr) {
      setErrors({ email: "Email not found in our system" });
      return;
    }

    const userData = JSON.parse(userDataStr);
    setSecurityQuestion1(userData.securityQuestion1);
    setSecurityQuestion2(userData.securityQuestion2);
    setErrors({});
    setStep(2);
  };

  const handleAnswersSubmit = async () => {
    const newErrors = {};

    if (!securityAnswer1 || securityAnswer1.trim() === "") {
      newErrors.securityAnswer1 = "Answer to question 1 is required";
    }

    if (!securityAnswer2 || securityAnswer2.trim() === "") {
      newErrors.securityAnswer2 = "Answer to question 2 is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetPassword(email, securityAnswer1, securityAnswer2, newPassword);
      setErrors({});
      setStep(3);
      setSuccessMessage("Security answers verified! Now set your new password.");
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  const handlePasswordReset = async () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetPassword(email, securityAnswer1, securityAnswer2, newPassword);
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Enter your email address to reset your password
            </p>

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

            <button onClick={handleEmailSubmit} disabled={loading}>
              {loading ? "Verifying..." : "Continue"}
            </button>
          </>
        )}

        {/* Step 2: Answer Security Questions */}
        {step === 2 && (
          <>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Answer your security questions to verify your identity
            </p>

            <div>
              <label style={{ fontSize: "12px", color: "#475569", fontWeight: "500" }}>
                {securityQuestion1}
              </label>
              <input
                placeholder="Your answer"
                value={securityAnswer1}
                onChange={(e) => {
                  setSecurityAnswer1(e.target.value);
                  setErrors({ ...errors, securityAnswer1: "" });
                }}
              />
              {errors.securityAnswer1 && (
                <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
                  {errors.securityAnswer1}
                </p>
              )}
            </div>

            <div style={{ marginTop: "12px" }}>
              <label style={{ fontSize: "12px", color: "#475569", fontWeight: "500" }}>
                {securityQuestion2}
              </label>
              <input
                placeholder="Your answer"
                value={securityAnswer2}
                onChange={(e) => {
                  setSecurityAnswer2(e.target.value);
                  setErrors({ ...errors, securityAnswer2: "" });
                }}
              />
              {errors.securityAnswer2 && (
                <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
                  {errors.securityAnswer2}
                </p>
              )}
            </div>

            {errors.form && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "10px 0" }}>
                {errors.form}
              </p>
            )}

            <button onClick={handleAnswersSubmit} disabled={loading} style={{ marginTop: "12px" }}>
              {loading ? "Verifying..." : "Verify Answers"}
            </button>

            <button
              onClick={() => {
                setStep(1);
                setErrors({});
              }}
              style={{
                background: "transparent",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                marginTop: "8px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Set your new password
            </p>

            {successMessage && (
              <p style={{ color: "#16a34a", fontSize: "13px", margin: "0 0 12px 0", fontWeight: "500" }}>
                ✓ {successMessage}
              </p>
            )}

            <div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({ ...errors, newPassword: "" });
                }}
              />
              {errors.newPassword && (
                <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>
                  {errors.newPassword}
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

            {errors.form && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "10px 0" }}>
                {errors.form}
              </p>
            )}

            <button onClick={handlePasswordReset} disabled={loading} style={{ marginTop: "12px" }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                marginTop: "8px",
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </>
        )}

        {/* Cancel button for step 1 and 2 */}
        {step !== 3 && (
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              color: "#64748b",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              marginTop: "8px",
              textDecoration: "underline",
              padding: "0",
            }}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
