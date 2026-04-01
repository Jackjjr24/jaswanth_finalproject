import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const { user, role, logout, isAuthenticated } = useContext(AuthContext);
  const [userFromStorage, setUserFromStorage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserFromStorage(JSON.parse(storedUser));
    }
  }, []);


  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userDisplayName = user?.name || userFromStorage?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="navbar">
      <Link to={isAuthPage || !isAuthenticated ? "/" : role === "CUSTOMER" ? "/home" : role === "SELLER" ? "/seller/dashboard" : "/admin/dashboard"} style={{ textDecoration: "none" }}>
        <div className="logo">QuitQ</div>
      </Link>

      <div className="nav-links">
        {isAuthPage || !isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : role === "CUSTOMER" ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/user/profile">Profile</Link>
            <Link to="/cart" style={{ position: "relative" }}>
              Cart
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "var(--danger)",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "40px",
              }}
            >
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {userDisplayName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : role === "SELLER" ? (
          <>
            <Link to="/seller/dashboard">Dashboard</Link>
            <Link to="/seller/products">Products</Link>
            <Link to="/seller/orders">Orders</Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "40px",
              }}
            >
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {userDisplayName} (Seller)
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : role === "ADMIN" ? (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">User Management</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/reports">Reports</Link>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "40px",
              }}
            >
              <span
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {userDisplayName} (Admin)
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Logout
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;