import { createContext, useState, useCallback, useEffect } from "react";
import { API_ENDPOINTS } from "../api/config";
import { get, post, put, delete_ } from "../api/apiService";

export const ProductContext = createContext();

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food",
  "Other",
];

const normalizeProduct = (product) => {
  if (!product) {
    console.warn("Product is null or undefined");
    return null;
  }
  
  console.log("Normalizing product:", product);
  
  const normalized = {
    id: product.productId || product.id,
    name: product.productName || product.name || "Unknown Product",
    category: product.categoryName || product.category || "Other",
    price: product.price || 0,
    stock: product.stock !== undefined ? product.stock : 0,
    description: product.description || "",
    image: product.image || "",
  };
  
  console.log("Normalized to:", normalized);
  return normalized;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await get(API_ENDPOINTS.products.list);
      console.log("API Response:", data);
      let allProducts = Array.isArray(data) ? data : (data.products || data || []);
      
      allProducts = allProducts.map(normalizeProduct);
      console.log("Products after parsing:", allProducts);
      
      const storedProductDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
      allProducts = allProducts.map(product => ({
        ...product,
        description: product.description || storedProductDetails[product.id]?.description || "",
        image: product.image || storedProductDetails[product.id]?.image || "",
      }));
      
      if (filters.category && filters.category !== "All") {
        allProducts = allProducts.filter(p => p.category === filters.category);
      }
      if (filters.search) {
        allProducts = allProducts.filter(p => p.name && p.name.toLowerCase().includes(filters.search.toLowerCase()));
      }
      if (filters.minPrice) {
        allProducts = allProducts.filter(p => p.price >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        allProducts = allProducts.filter(p => p.price <= parseInt(filters.maxPrice));
      }
      
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching product with ID:", id);
      
      const productFromList = products.find(p => p.id === parseInt(id) || p.productId === parseInt(id));
      if (productFromList) {
        console.log("Found product in list:", productFromList);
        const normalizedProduct = normalizeProduct(productFromList);
        
        const storedProductDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
        const enhanced = {
          ...normalizedProduct,
          description: normalizedProduct.description || storedProductDetails[normalizedProduct.id]?.description || "",
          image: normalizedProduct.image || storedProductDetails[normalizedProduct.id]?.image || "",
        };
        
        console.log("Normalized product from list:", enhanced);
        setLoading(false);
        return enhanced;
      }
      
      const data = await get(API_ENDPOINTS.products.detail(id));
      console.log("Raw API response for product:", data);
      
      if (!data) {
        console.error("Product data is empty or null");
        throw new Error("Product not found");
      }
      
      const normalizedProduct = normalizeProduct(data);
      
      const storedProductDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
      const enhanced = {
        ...normalizedProduct,
        description: normalizedProduct.description || storedProductDetails[normalizedProduct.id]?.description || "",
        image: normalizedProduct.image || storedProductDetails[normalizedProduct.id]?.image || "",
      };
      
      console.log("Normalized product from API:", enhanced);
      return enhanced;
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError(err.message || "Failed to fetch product");
      return null;
    } finally {
      setLoading(false);
    }
  }, [products]);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Creating product with data:", productData);
      const data = await post(API_ENDPOINTS.products.create, productData);
      console.log("Product creation response:", data);
      
      const productId = data.productId || data.id;
      
      const allProductsTracker = JSON.parse(localStorage.getItem("allProducts") || "[]");
      if (!allProductsTracker.includes(productId)) {
        allProductsTracker.push(productId);
        localStorage.setItem("allProducts", JSON.stringify(allProductsTracker));
      }
      
      if (productData.image || productData.description) {
        const storedProductDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
        storedProductDetails[productId] = {
          image: productData.image,
          description: productData.description,
        };
        localStorage.setItem("productDetails", JSON.stringify(storedProductDetails));
      }
      
      await fetchProducts();
      return data;
    } catch (err) {
      console.error("Product creation error:", err);
      const errorMsg = err.message || "Failed to create product";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await put(API_ENDPOINTS.products.update(id), productData);
      
      if (productData.image || productData.description) {
        const storedProductDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
        storedProductDetails[id] = {
          ...storedProductDetails[id],
          image: productData.image || storedProductDetails[id]?.image,
          description: productData.description || storedProductDetails[id]?.description,
        };
        localStorage.setItem("productDetails", JSON.stringify(storedProductDetails));
      }
      
      await fetchProducts();
      return data;
    } catch (err) {
      setError(err.message || "Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await delete_(API_ENDPOINTS.products.delete(id));
      await fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
