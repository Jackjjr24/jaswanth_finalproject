import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } =
    useContext(CartContext);
  const navigate = useNavigate();
  const total = getTotal();

  return (
    <div className="cart">
      <h2> Your Cart</h2>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon"> </div>
          <p>Your cart is empty</p>
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "var(--primary)",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-price">₹{item.price.toLocaleString()}</p>
              </div>

              <div className="item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div style={{ minWidth: "120px", textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                    Subtotal
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "var(--secondary)",
                    }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <div className="cart-actions">
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/home")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;