import { createContext, useState, useCallback, useEffect } from "react";
import { API_ENDPOINTS } from "../api/config";
import { post } from "../api/apiService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const login = useCallback(async (email, password, selectedRole) => {
    setLoading(true);
    try {
      if (selectedRole === "ADMIN") {
        const mockToken = btoa(email + ":" + password + ":" + Date.now());
        const userData = {
          id: Math.floor(Math.random() * 10000),
          email: email,
          name: email.split("@")[0],
          role: "ADMIN",
        };

        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", "ADMIN");

        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const userExists = allUsers.some(u => u.id === userData.id || u.email === userData.email);
        if (!userExists) {
          allUsers.push(userData);
          localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }

        setToken(mockToken);
        setUser(userData);
        setRole("ADMIN");

        return { token: mockToken, user: userData };
      }

      const response = await post(API_ENDPOINTS.auth.login, {
        username: email,
        password,
      });

      const isSuccess = 
        (typeof response === "string" && response === "Login Successful") ||
        (typeof response === "object" && response && (response.id || response.userId));

      if (isSuccess) {
        const mockToken = btoa(email + ":" + password + ":" + Date.now());
        const userData = {
          id: response.id || Math.floor(Math.random() * 10000),
          email: email,
          name: response.name || email.split("@")[0],
          role: selectedRole,
        };

        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", selectedRole);

        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const userExists = allUsers.some(u => u.id === userData.id || u.email === userData.email);
        if (!userExists) {
          allUsers.push(userData);
          localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }

        setToken(mockToken);
        setUser(userData);
        setRole(selectedRole);

        return { token: mockToken, user: userData };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw new Error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, selectedRole, securityQuestions) => {
    setLoading(true);
    try {
      const response = await post(API_ENDPOINTS.auth.register, {
        name,
        username: email,
        email,
        password,
        role: selectedRole,
        securityQuestion1: securityQuestions.question1,
        securityAnswer1: securityQuestions.answer1,
        securityQuestion2: securityQuestions.question2,
        securityAnswer2: securityQuestions.answer2,
      });

      if (response && response.id) {
        const userData = {
          id: response.id,
          name,
          email,
          password,
          role: selectedRole,
          securityQuestion1: securityQuestions.question1,
          securityAnswer1: securityQuestions.answer1,
          securityQuestion2: securityQuestions.question2,
          securityAnswer2: securityQuestions.answer2,
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(userData));

        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const userExists = allUsers.some(u => u.email === email);
        if (!userExists) {
          allUsers.push({ id: response.id, name, email, role: selectedRole });
          localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }

        return response;
      } else {
        throw new Error("Registration successful, please login");
      }
    } catch (error) {
      const userData = {
        id: Math.floor(Math.random() * 10000),
        name,
        email,
        password,
        role: selectedRole,
        securityQuestion1: securityQuestions.question1,
        securityAnswer1: securityQuestions.answer1,
        securityQuestion2: securityQuestions.question2,
        securityAnswer2: securityQuestions.answer2,
      };

      localStorage.setItem(`user_${email}`, JSON.stringify(userData));

      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const userExists = allUsers.some(u => u.email === email);
      if (!userExists) {
        allUsers.push({ id: userData.id, name, email, role: selectedRole });
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
      }

      throw new Error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const resetPassword = useCallback(async (email, answer1, answer2, newPassword) => {
    setLoading(true);
    try {
      try {
        const response = await post(API_ENDPOINTS.auth.resetPassword || `${API_ENDPOINTS.auth.login.split('/login')[0]}/reset-password`, {
          email,
          securityAnswer1: answer1,
          securityAnswer2: answer2,
          newPassword,
        });

        return { success: true, message: response };
      } catch (backendError) {
        console.warn("Backend reset-password not available, using localStorage fallback");

        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const user = allUsers.find(u => u.email === email);

        if (!user) {
          throw new Error("User not found");
        }

        const userDataStr = localStorage.getItem(`user_${email}`);
        const userData = userDataStr ? JSON.parse(userDataStr) : null;

        if (!userData) {
          throw new Error("User account not properly initialized");
        }

        const storedAnswer1 = (userData.securityAnswer1 || "").toLowerCase().trim();
        const storedAnswer2 = (userData.securityAnswer2 || "").toLowerCase().trim();
        const providedAnswer1 = (answer1 || "").toLowerCase().trim();
        const providedAnswer2 = (answer2 || "").toLowerCase().trim();

        if (storedAnswer1 !== providedAnswer1 || storedAnswer2 !== providedAnswer2) {
          throw new Error("Security answers do not match");
        }

        userData.password = newPassword;
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));

        const userIndex = allUsers.findIndex(u => u.email === email);
        if (userIndex !== -1) {
          allUsers[userIndex].password = newPassword;
          localStorage.setItem("allUsers", JSON.stringify(allUsers));
        }

        return { success: true, message: "Password reset successfully" };
      }
    } catch (error) {
      throw new Error(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!token;
  const isCustomer = role === "CUSTOMER";
  const isSeller = role === "SELLER";
  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated,
        isCustomer,
        isSeller,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
