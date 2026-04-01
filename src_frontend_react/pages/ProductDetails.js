import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { fetchProductById } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "var(--danger)", marginBottom: "20px" }}>
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/home")}
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
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", paddingBottom: "40px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{
          padding: "8px 16px",
          backgroundColor: "white",
          color: "var(--primary)",
          border: "2px solid var(--border)",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        ← Back to Home
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ background: product.image ? "transparent" : "var(--bg)", borderRadius: "8px", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ) : (
            <div style={{ fontSize: "18px", color: "#94a3b8" }}>📦 Product Image</div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: "15px", fontSize: "28px" }}>{product.name}</h2>

          <p style={{ color: "var(--secondary)", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>
            ₹{product.price.toLocaleString()}
          </p>

          {product.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: "#ffc107", fontSize: "18px" }}>
                    {i < Math.floor(product.rating) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                {product.rating} ({product.reviews || 0} reviews)
              </span>
            </div>
          )}

          {product.category && (
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "15px" }}>
              <strong>Category:</strong> {product.category}
            </p>
          )}

          {product.stock !== undefined && (
            <p style={{
              fontSize: "14px",
              marginBottom: "20px",
              color: product.stock > 0 ? "var(--success)" : "var(--danger)",
              fontWeight: "600",
            }}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          )}

          <div style={{ marginBottom: "25px", paddingBottom: "25px", borderBottom: "1px solid var(--border)" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#64748b" }}>DESCRIPTION</h4>
            <p style={{ color: "#1e293b", lineHeight: "1.6", fontSize: "14px" }}>
              {product.description || "No description available"}
            </p>
          </div>

          {product.features && product.features.length > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <h4 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: "600" }}>Key Features</h4>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#1e293b" }}>
                {product.features.map((feature, index) => (
                  <li key={index} style={{ marginBottom: "6px", fontSize: "14px" }}>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: "14px",
                backgroundColor: isAdded ? "var(--success)" : product.stock === 0 ? "#ccc" : "var(--secondary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: product.stock === 0 ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {isAdded ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              style={{
                padding: "14px 20px",
                backgroundColor: isWishlisted ? "rgba(251, 100, 27, 0.2)" : "white",
                color: isWishlisted ? "var(--secondary)" : "var(--dark)",
                border: "2px solid " + (isWishlisted ? "var(--secondary)" : "var(--border)"),
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;