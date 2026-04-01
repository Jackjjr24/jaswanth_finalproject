import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="card">
      <div
        className="image"
        onClick={() => navigate(`/product/${product.id}`)}
        style={{
          cursor: "pointer",
          backgroundImage: product.image ? `url(${product.image})` : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!product.image && (
          <span style={{ fontSize: "60px", opacity: 0.3 }}>no image available</span>
        )}
      </div>

      <h3>{product.name || product.productName}</h3>
      <p className="price">₹{product.price.toLocaleString()}</p>

      <button onClick={handleAddToCart}>
        {isAdded ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;