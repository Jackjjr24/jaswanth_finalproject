import ProductCard from "../components/ProductCard";
import "./Home.css";
import { useState, useMemo, useContext, useEffect } from "react";
import { ProductContext } from "../context/ProductContext";

function Home() {
  const { products, categories, loading, error, fetchProducts } = useContext(ProductContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts({ category: selectedCategory === "All" ? "" : selectedCategory, search: searchTerm, minPrice, maxPrice });
  }, [selectedCategory, searchTerm, minPrice, maxPrice, fetchProducts]);

  const categoryOptions = ["All", ...(categories || [])];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice =
        (minPrice === "" || product.price >= parseInt(minPrice)) &&
        (maxPrice === "" || product.price <= parseInt(maxPrice));
      return matchCategory && matchSearch && matchPrice;
    });
  }, [products, selectedCategory, searchTerm, minPrice, maxPrice]);

  return (
    <div className="home">
      <div className="banner">
        <h1>Mega Sale</h1>
        <p>Up to 50% OFF on selected items</p>
      </div>

      <div style={{ margin: "30px 0", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid var(--border)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid var(--border)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>
        <div style={{ minWidth: "150px" }}>
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid var(--border)",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--dark)", marginBottom: "12px" }}>
          Categories
        </h3>
        <div className="categories">
          {categoryOptions.map((category) => (
            <span
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category ? "var(--primary)" : "white",
                color: selectedCategory === category ? "white" : "var(--dark)",
                fontWeight: selectedCategory === category ? "600" : "500",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                border: "1px solid var(--border)",
              }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", marginTop: "40px" }}>
        <h2>
          {selectedCategory === "All" ? "All Products" : selectedCategory}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading && <p style={{ textAlign: "center", padding: "40px" }}>Loading products...</p>}

      {error && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", color: "var(--danger)", textAlign: "center" }}>
          {error}
        </div>
      )}

      {!loading && filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : !loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "12px" }}>
          <p style={{ fontSize: "18px", color: "#94a3b8" }}>No products found</p>
          <p style={{ fontSize: "14px", color: "#cbd5e1", marginTop: "10px" }}>
            Try adjusting your search or filters
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Home;