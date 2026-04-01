import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductContext } from "../../context/ProductContext";
import "../Auth.css";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchProductById, updateProduct, categories, loading } = useContext(ProductContext);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setErrors({ form: "Product ID not found" });
        return;
      }
      const product = await fetchProductById(id);
      if (product) {
        setFormData({
          name: product.name || product.productName || "",
          category: product.category || product.categoryName || "",
          price: product.price || "",
          stock: product.stock || "",
          description: product.description || "",
          image: product.image || "",
        });
        if (product.image) {
          setImagePreview(product.image);
        }
      } else {
        setErrors({ form: "Failed to load product" });
      }
    };
    loadProduct();
  }, [id, fetchProductById]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) newErrors.price = "Price must be a valid number greater than 0";
    if (!formData.stock) newErrors.stock = "Stock quantity is required";
    else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) newErrors.stock = "Stock must be a valid number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const updateData = {
          productName: formData.name,
          categoryName: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description,
        };
        if (formData.image) {
          updateData.image = formData.image;
        }
        await updateProduct(id, updateData);
        navigate("/seller/products");
      } catch (error) {
        setErrors({ form: error.message || "Failed to update product" });
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Edit Product</h1>

      {errors.form && (
        <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--danger)", marginBottom: "20px", border: "1px solid var(--danger)" }}>
          {errors.form}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          style={{ ...inputStyle, borderColor: errors.name ? "var(--danger)" : "var(--border)" }}
        />
        {errors.name && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ ...inputStyle, borderColor: errors.category ? "var(--danger)" : "var(--border)" }}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.category}</p>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          style={{ ...inputStyle, borderColor: errors.price ? "var(--danger)" : "var(--border)" }}
        />
        {errors.price && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.price}</p>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Stock Quantity</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          min="0"
          style={{ ...inputStyle, borderColor: errors.stock ? "var(--danger)" : "var(--border)" }}
        />
        {errors.stock && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.stock}</p>}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows="5"
          style={{
            ...inputStyle,
            borderColor: errors.description ? "var(--danger)" : "var(--border)",
            resize: "vertical",
          }}
        />
        {errors.description && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.description}</p>}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            ...inputStyle,
            borderColor: errors.image ? "var(--danger)" : "var(--border)",
            padding: "8px 12px",
          }}
        />
        {errors.image && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "5px 0 0 0" }}>{errors.image}</p>}
        {imagePreview && (
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>Current/Preview Image</p>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 1,
            padding: "14px",
            backgroundColor: loading ? "#ccc" : "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
        <button
          onClick={() => navigate("/seller/products")}
          style={{
            flex: 1,
            padding: "14px",
            backgroundColor: "white",
            color: "var(--dark)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProduct;
