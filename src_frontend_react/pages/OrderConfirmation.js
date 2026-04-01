import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { get } from "../api/apiService";
import { API_ENDPOINTS } from "../api/config";
import "./Auth.css";

function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (location.state?.order) {
          setOrder(location.state.order);
        } else if (id) {
          const data = await get(`${API_ENDPOINTS.orders.list}/${id}`);
          setOrder(data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, location.state?.order]);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ color: "#94a3b8", fontSize: "18px", marginBottom: "20px" }}>Order not found</p>
          <button
            onClick={() => navigate("/orders")}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "var(--success)", marginBottom: "8px" }}>Order Confirmed</h1>
        <p style={{ fontSize: "16px", color: "#94a3b8" }}>Thank you for your purchase</p>
      </div>

      {error && (
        <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--danger)", marginBottom: "20px", border: "1px solid var(--danger)" }}>
          {error}
        </div>
      )}

      <div style={{ border: "1px solid var(--border)", padding: "20px", borderRadius: "8px", marginBottom: "20px", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: "15px" }}>Order Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "15px" }}>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Order ID</p>
            <p style={{ fontSize: "18px", fontWeight: "700" }}>#{order.id}</p>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Total Amount</p>
            <p style={{ fontSize: "18px", fontWeight: "700", color: "var(--secondary)" }}>₹{(order.totalAmount || order.total || order.totalPrice || 0).toLocaleString()}</p>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Order Date</p>
            <p style={{ fontWeight: "600" }}>
              {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Status</p>
            <span style={{
              display: "inline-block",
              padding: "6px 12px",
              backgroundColor: order.status === "Processing" || order.status === "PROCESSING" ? "var(--warning)" : order.status === "Delivered" || order.status === "DELIVERED" ? "var(--success)" : "var(--primary)",
              color: order.status === "Processing" || order.status === "PROCESSING" ? "var(--dark)" : "white",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
            }}>
              {order.status || "Pending"}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Payment Method</p>
          <p style={{ fontWeight: "600" }}>
            {order.paymentMethod === "credit-card" && "Credit/Debit Card"}
            {order.paymentMethod === "creditCard" && "Credit/Debit Card"}
            {order.paymentMethod === "upi" && "UPI"}
            {order.paymentMethod === "cash-on-delivery" && "Cash on Delivery"}
            {order.paymentMethod === "cashOnDelivery" && "Cash on Delivery"}
            {!order.paymentMethod && "Not specified"}
          </p>
        </div>

        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "10px", fontWeight: "500" }}>Items Ordered</p>
          {order.items && order.items.length > 0 ? (
            <div>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "6px",
                        objectFit: "cover",
                        border: "1px solid var(--border)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>{item.name || item.productName}</p>
                        <p style={{ fontSize: "12px", color: "#94a3b8" }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--secondary)" }}>₹{((item.price || item.productPrice) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "2px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px" }}>
                  <span style={{ color: "#64748b" }}>Subtotal</span>
                  <span>₹{(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px" }}>
                  <span style={{ color: "#64748b" }}>Shipping</span>
                  <span>₹{(order.shipping || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "14px" }}>
                  <span style={{ color: "#64748b" }}>Tax (5%)</span>
                  <span>₹{(order.tax || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: "#94a3b8" }}>No items in this order</p>
          )}
        </div>
      </div>

      <div style={{ border: "1px solid var(--border)", padding: "20px", borderRadius: "8px", marginBottom: "20px", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: "15px" }}>Shipping Address</h3>
        {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 ? (
          <div style={{ lineHeight: "1.8", color: "#1e293b" }}>
            <p style={{ marginBottom: "12px", fontWeight: "600" }}>{order.shippingAddress.fullName}</p>
            <p style={{ marginBottom: "8px" }}>{order.shippingAddress.street}</p>
            <p style={{ marginBottom: "8px" }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode || order.shippingAddress.zip}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        ) : (
          <p style={{ color: "#94a3b8" }}>No shipping address provided</p>
        )}
      </div>

      <div style={{ backgroundColor: "#f0f8ff", border: "2px solid var(--primary)", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
        <p style={{ margin: 0, color: "#1e293b" }}>
          <strong>Order Confirmation:</strong> A confirmation email has been sent to your registered email address. Your order will be processed shortly.
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate("/orders")}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          View My Orders
        </button>
        <button
          onClick={() => navigate("/home")}
          style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "white",
            color: "var(--primary)",
            border: "2px solid var(--primary)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
