import { useState, useEffect } from "react";
import "../Auth.css";

function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
    setLoading(false);
  }, []);

  const handleStatusUpdate = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status) => {
    if (status === "Processing" || status === "PROCESSING") return "var(--warning)";
    if (status === "Shipped" || status === "SHIPPED") return "var(--primary)";
    if (status === "Delivered" || status === "DELIVERED") return "var(--success)";
    if (status === "Cancelled" || status === "CANCELLED") return "var(--danger)";
    return "var(--gray)";
  };

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Order Management</h1>

      {orders.length > 0 ? (
        <div>
          {orders.map((order) => (
            <div
              key={`${order.id}-${order.date}`}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                  padding: "20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "500" }}>
                    Order ID
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "700" }}>#{order.id}</p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "500" }}>
                    Customer
                  </p>
                  <p style={{ fontSize: "14px", fontWeight: "500" }}>{order.customerName || "N/A"}</p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "500" }}>
                    Total Amount
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--secondary)" }}>
                    ₹{(order.totalAmount || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "6px", fontWeight: "500" }}>
                    Status
                  </p>
                  <select
                    value={order.status || "Processing"}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    style={{
                      padding: "6px 8px",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      fontSize: "13px",
                      backgroundColor: getStatusColor(order.status),
                      color: order.status === "Processing" ? "var(--dark)" : "white",
                    }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Section */}
              {order.items && order.items.length > 0 ? (
                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", marginBottom: "12px" }}>
                    PRODUCTS ORDERED
                  </p>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "10px 0",
                        borderTop: index === 0 ? "none" : "1px solid var(--border)",
                        paddingTop: index === 0 ? "0" : "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "4px",
                            objectFit: "cover",
                            border: "1px solid var(--border)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>{item.name || item.productName}</p>
                        <p style={{ fontSize: "12px", color: "#64748b" }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "14px", fontWeight: "500" }}>
                          ₹{((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "2px solid var(--border)",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    <div></div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>Subtotal</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600" }}>₹{(order.subtotal || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      gap: "16px",
                      paddingTop: "8px",
                    }}
                  >
                    <div></div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>Shipping</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600" }}>₹{(order.shipping || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      gap: "16px",
                      paddingTop: "8px",
                    }}
                  >
                    <div></div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>Tax (5%)</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", fontWeight: "600" }}>₹{(order.tax || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "16px 20px", color: "#94a3b8" }}>
                  <p style={{ fontSize: "14px" }}>No products in this order</p>
                </div>
              )}

              <div
                style={{
                  padding: "12px 20px",
                  backgroundColor: "#f8fafc",
                  borderTop: "1px solid var(--border)",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                📅 {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "8px" }}>
          <p style={{ fontSize: "18px", color: "#94a3b8" }}>No orders yet</p>
          <p style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "10px" }}>
            Orders will appear here once customers purchase your products
          </p>
        </div>
      )}
    </div>
  );
}

export default SellerOrders;
