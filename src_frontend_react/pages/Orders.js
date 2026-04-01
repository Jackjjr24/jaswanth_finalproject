import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";

function Orders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch {
        setOrders([]);
      }
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    if (status === "Processing" || status === "PROCESSING") return "var(--warning)";
    if (status === "Shipped" || status === "SHIPPED") return "var(--primary)";
    if (status === "Delivered" || status === "DELIVERED") return "var(--success)";
    return "var(--gray)";
  };

  const getStatusTextColor = (status) => {
    return (status === "Processing" || status === "PROCESSING") ? "var(--dark)" : "white";
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>My Orders</h1>
      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
        Hello {user?.name}, here are your orders
      </p>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", border: "1px solid var(--border)", borderRadius: "8px", background: "white" }}>
          <p style={{ color: "#94a3b8", fontSize: "18px" }}>You haven't placed any orders yet</p>
          <button
            onClick={() => navigate("/home")}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "15px",
              fontWeight: "600",
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div key={`${order.id}-${order.date}`} style={{ background: "white", border: "1px solid var(--border)", padding: "20px", marginBottom: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Order ID</p>
                <p style={{ fontWeight: "700", fontSize: "16px" }}>#{order.id}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Date</p>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>
                  {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Total</p>
                <p style={{ fontWeight: "700", fontSize: "16px", color: "var(--secondary)" }}>
                  ₹{(order.totalAmount || order.total).toLocaleString()}
                </p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Status</p>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    backgroundColor: getStatusColor(order.status),
                    color: getStatusTextColor(order.status),
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </div>
            </div>

            {order.items && order.items.length > 0 ? (
              <div style={{ marginBottom: "15px" }}>
                <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Items Ordered</p>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "6px",
                          objectFit: "cover",
                          border: "1px solid var(--border)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{item.name || item.productName}</p>
                          <p style={{ fontSize: "12px", color: "#94a3b8" }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--secondary)", whiteSpace: "nowrap" }}>₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "2px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", color: "#64748b" }}>
                    <span>Subtotal</span>
                    <span>₹{(order.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", color: "#64748b" }}>
                    <span>Shipping</span>
                    <span>₹{(order.shipping || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px", color: "#64748b" }}>
                    <span>Tax (5%)</span>
                    <span>₹{(order.tax || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: "15px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "6px", color: "#666", fontSize: "14px" }}>
                No items found in this order
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => navigate(`/order-confirmation/${order.id}`, { state: { order } })}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;

