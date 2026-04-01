import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ProductContext } from "../../context/ProductContext";
import "../Auth.css";

function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const { products, loading: productsLoading } = useContext(ProductContext);
  const navigate = useNavigate();
  const [sellerOrders, setSellerOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setSellerOrders(storedOrders);
  }, []);

  const totalRevenue = sellerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const recentOrders = sellerOrders.slice(0, 5);

  const cardStyle = {
    border: "1px solid var(--border)",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    background: "white",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  };

  const cardTitleStyle = {
    margin: "0 0 12px 0",
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
    textTransform: "uppercase",
  };

  const cardValueStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--primary)",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>Seller Dashboard</h1>
      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
        Welcome, {user?.name || "Seller"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Total Products</h3>
          <p style={cardValueStyle}>{products.length}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Total Orders</h3>
          <p style={cardValueStyle}>{sellerOrders.length}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Total Revenue</h3>
          <p style={{ ...cardValueStyle, color: "var(--success)" }}>
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: "0" }}>Your Products</h2>
          <Link to="/seller/products/new" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Add New Product
            </button>
          </Link>
        </div>
        {productsLoading ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading products...</p>
        ) : products.length > 0 ? (
          <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Product Name</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Price</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Stock</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{product.name}</td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>
                      <span
                        style={{
                          backgroundColor: product.stock > 0 ? "var(--success)" : "var(--danger)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <Link to={`/seller/products/edit/${product.id}`} style={{ textDecoration: "none" }}>
                        <button
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px" }}>
            <p style={{ color: "#94a3b8" }}>No products yet. Add your first product.</p>
            <Link to="/seller/products/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Add Product
              </button>
            </Link>
          </div>
        )}
        <Link to="/seller/products" style={{ textDecoration: "none", display: "block", marginTop: "15px" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              color: "var(--primary)",
              border: "1px solid var(--primary)",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View All Products
          </button>
        </Link>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: "0" }}>Recent Orders</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/seller/sales-reports" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--secondary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                View Reports
              </button>
            </Link>
            <Link to="/seller/orders" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                View All Orders
              </button>
            </Link>
          </div>
        </div>
        {false ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Loading orders...</p>
        ) : recentOrders.length > 0 ? (
          <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Order ID</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Customer</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Total</th>
                  <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>#{order.id}</td>
                    <td style={{ padding: "16px", fontSize: "14px" }}>{order.customerName || "N/A"}</td>
                    <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500" }}>₹{order.totalPrice?.toLocaleString() || 0}</td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          backgroundColor: order.status === "Delivered" ? "var(--success)" : "var(--warning)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px" }}>
            <p style={{ color: "#94a3b8" }}>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
