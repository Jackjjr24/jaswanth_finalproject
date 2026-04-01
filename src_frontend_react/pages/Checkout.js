import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { post } from "../api/apiService";
import { API_ENDPOINTS } from "../api/config";
import "./Auth.css";

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = getTotal();
  const shippingCost = 100;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shippingCost + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.fullName) newErrors.fullName = "Full name is required";
    if (!shippingAddress.street) newErrors.street = "Street address is required";
    if (!shippingAddress.city) newErrors.city = "City is required";
    if (!shippingAddress.state) newErrors.state = "State is required";
    if (!shippingAddress.zipCode) newErrors.zipCode = "Zip code is required";
    if (!shippingAddress.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderId = Math.floor(Math.random() * 10000) + 1000;
      
      // Calculate correct total from cart items
      const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shippingCost = 100;
      const taxAmount = Math.round(cartTotal * 0.05);
      const orderTotal = cartTotal + shippingCost + taxAmount;
      
      // Create order summary for confirmation page
      const orderData = {
        id: orderId,
        customerName: shippingAddress.fullName,
        shippingAddress,
        paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          name: item.name || item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: orderTotal,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: taxAmount,
        date: new Date().toISOString(),
        status: "Processing",
      };
      
      // Create single order record for display in Orders page
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      
      const orderRecord = {
        id: orderId,
        customerName: shippingAddress.fullName,
        items: cart.map(item => ({
          name: item.name || item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: orderTotal,
        subtotal: cartTotal,
        shipping: shippingCost,
        tax: taxAmount,
        shippingAddress,
        paymentMethod,
        date: new Date().toISOString(),
        status: "Processing",
      };
      
      existingOrders.push(orderRecord);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      try {
        await post(API_ENDPOINTS.orders.create, {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          paymentMethod,
          totalAmount: orderTotal,
        });
      } catch (apiError) {
      }

      clearCart();
      navigate(`/order-confirmation/${orderId}`, {
        state: { order: orderData },
      });
    } catch (error) {
      setErrors({ form: error.message || "Failed to place order" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Checkout</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px" }}>
        <div>
          <h3 style={{ marginBottom: "20px" }}>Shipping Address</h3>

          {errors.form && (
            <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--danger)", marginBottom: "20px", border: "1px solid var(--danger)" }}>
              {errors.form}
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              style={{ ...inputStyle, borderColor: errors.fullName ? "var(--danger)" : "var(--border)" }}
            />
            {errors.fullName && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.fullName}</p>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Street Address</label>
            <input
              type="text"
              name="street"
              value={shippingAddress.street}
              onChange={handleInputChange}
              placeholder="Enter your street address"
              style={{ ...inputStyle, borderColor: errors.street ? "var(--danger)" : "var(--border)" }}
            />
            {errors.street && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.street}</p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>City</label>
              <input
                type="text"
                name="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
                style={{ ...inputStyle, borderColor: errors.city ? "var(--danger)" : "var(--border)" }}
              />
              {errors.city && (
                <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.city}</p>
              )}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>State</label>
              <input
                type="text"
                name="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                style={{ ...inputStyle, borderColor: errors.state ? "var(--danger)" : "var(--border)" }}
              />
              {errors.state && (
                <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.state}</p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
              placeholder="Enter your zip code"
              style={{ ...inputStyle, borderColor: errors.zipCode ? "var(--danger)" : "var(--border)" }}
            />
            {errors.zipCode && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.zipCode}</p>
            )}
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              style={{ ...inputStyle, borderColor: errors.phone ? "var(--danger)" : "var(--border)" }}
            />
            {errors.phone && (
              <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.phone}</p>
            )}
          </div>

          <h3 style={{ marginBottom: "20px" }}>Payment Method</h3>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                value="credit-card"
                checked={paymentMethod === "credit-card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit/Debit Card
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
              <input type="radio" value="upi" checked={paymentMethod === "upi"} onChange={(e) => setPaymentMethod(e.target.value)} />
              UPI
            </label>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                value="cash-on-delivery"
                checked={paymentMethod === "cash-on-delivery"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
          <div style={{ background: "white", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px" }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: "14px" }}>
                  {item.name} x {item.quantity}
                </span>
                <span style={{ fontWeight: "600" }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                <span>Subtotal:</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                <span>Shipping:</span>
                <span>₹{shippingCost}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", paddingBottom: "15px", borderBottom: "2px solid var(--border)", fontSize: "14px" }}>
                <span>Tax (5%):</span>
                <span>₹{tax}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700", color: "var(--secondary)", marginBottom: "20px" }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#ccc" : "var(--success)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <button
              onClick={() => navigate("/cart")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "white",
                color: "var(--dark)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "10px",
                fontWeight: "600",
              }}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
