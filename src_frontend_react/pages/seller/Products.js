import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import "../Auth.css";

function SellerProducts() {
  const navigate = useNavigate();
  const { products, fetchProducts, deleteProduct, loading } = useContext(ProductContext);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSellerProducts(products);
  }, [products]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setSellerProducts(sellerProducts.filter((p) => p.id !== id));
      } catch (err) {
        setError(err.message || "Failed to delete product");
      }
    }
  };

  const buttonStyle = {
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>My Products</h1>
        <Link to="/seller/products/new" style={{ textDecoration: "none" }}>
          <button style={{ ...buttonStyle, backgroundColor: "var(--primary)", color: "white", padding: "10px 20px", fontSize: "14px" }}>
            Add New Product
          </button>
        </Link>
      </div>

      {error && (
        <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--danger)", marginBottom: "20px", border: "1px solid var(--danger)" }}>
          {error}
        </div>
      )}

      {loading && <p style={{ textAlign: "center", padding: "40px" }}>Loading products...</p>}

      {!loading && sellerProducts.length > 0 ? (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Product Name</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Category</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Price</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Stock</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "16px", fontSize: "14px" }}>{product.name || product.productName}</td>
                  <td style={{ padding: "16px", fontSize: "14px" }}>{product.category || product.categoryName}</td>
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
                      {product.stock} units
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <Link to={`/seller/products/edit/${product.id}`} style={{ textDecoration: "none", marginRight: "8px" }}>
                      <button style={{ ...buttonStyle, backgroundColor: "var(--primary)", color: "white" }}>Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ ...buttonStyle, backgroundColor: "var(--danger)", color: "white" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "8px" }}>
          <p style={{ fontSize: "18px", color: "#94a3b8" }}>No products yet</p>
          <p style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "10px", marginBottom: "20px" }}>
            Add your first product to start selling
          </p>
          <Link to="/seller/products/new" style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 20px", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Add Product
            </button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default SellerProducts;
