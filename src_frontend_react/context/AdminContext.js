import { createContext, useState, useCallback, useEffect } from "react";
import { get, post, put, delete_ } from "../api/apiService";

export const AdminContext = createContext();

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

export function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      try {
        const data = await get("/api/admin/users");
        if (Array.isArray(data)) {
          setUsers(data);
          return;
        }
      } catch (apiError) {
      }
      
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      console.log("fetchAllUsers - Loaded from localStorage:", allUsers);
      setUsers(Array.isArray(allUsers) ? allUsers : []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      try {
        await delete_(`/api/admin/users/${userId}`);
      } catch (apiError) {
        const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
        const filteredUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem("allUsers", JSON.stringify(filteredUsers));
      }
      
      setUsers(users.filter(u => u.id !== userId));
      return { success: true, message: "User deleted successfully" };
    } catch (err) {
      setError(err.message || "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [users]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from API first
      try {
        const data = await get("/api/admin/categories");
        setCategories(Array.isArray(data) ? data : DEFAULT_CATEGORIES);
      } catch (apiError) {
        const savedCategories = JSON.parse(localStorage.getItem("adminCategories") || "null");
        if (Array.isArray(savedCategories) && savedCategories.length > 0) {
          setCategories(savedCategories);
        } else if (!localStorage.getItem("adminCategories")) {
          setCategories(DEFAULT_CATEGORIES);
          localStorage.setItem("adminCategories", JSON.stringify(DEFAULT_CATEGORIES));
        } else {
          setCategories([]);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      if (categories.includes(categoryName)) {
        throw new Error("Category already exists");
      }

      try {
        await post("/api/admin/categories", { name: categoryName });
      } catch (apiError) {
        const updatedCategories = [...categories, categoryName];
        localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
      }

      setCategories([...categories, categoryName]);
      return { success: true, message: "Category added successfully" };
    } catch (err) {
      setError(err.message || "Failed to add category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  const updateCategory = useCallback(async (oldName, newName) => {
    setLoading(true);
    setError(null);
    try {
      if (newName === oldName) {
        throw new Error("New name must be different from old name");
      }
      if (categories.includes(newName)) {
        throw new Error("Category already exists");
      }

      try {
        await put(`/api/admin/categories/${oldName}`, { name: newName });
      } catch (apiError) {
        const updatedCategories = categories.map(c => c === oldName ? newName : c);
        localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
      }

      const updatedCategories = categories.map(c => c === oldName ? newName : c);
      setCategories(updatedCategories);
      return { success: true, message: "Category updated successfully" };
    } catch (err) {
      setError(err.message || "Failed to update category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  const deleteCategory = useCallback(async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategories = (Array.isArray(categories) ? categories : []).filter(c => c !== categoryName);
      
      try {
        await delete_(`/api/admin/categories/${categoryName}`);
      } catch (apiError) {
      }

      localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
      
      setCategories(updatedCategories);
      return { success: true, message: "Category deleted successfully" };
    } catch (err) {
      setError(err.message || "Failed to delete category");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [categories]);

  const generateReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const productDetails = JSON.parse(localStorage.getItem("productDetails") || "{}");
      const allProductsTracker = JSON.parse(localStorage.getItem("allProducts") || "[]");

      const userReport = {
        total: allUsers.length,
        customers: allUsers.filter(u => u.role === "CUSTOMER").length,
        sellers: allUsers.filter(u => u.role === "SELLER").length,
        admins: allUsers.filter(u => u.role === "ADMIN").length,
      };

      const productCount = allProductsTracker.length > 0 ? allProductsTracker.length : Object.keys(productDetails).length;

      const productReport = {
        total: productCount,
        categories: (Array.isArray(categories) ? categories : []).length,
      };

      const orderReport = {
        total: orders.length,
        revenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      };

      setReports({
        users: userReport,
        products: productReport,
        orders: orderReport,
      });
    } catch (err) {
      console.error("Error generating reports:", err);
      setError(err.message || "Failed to generate reports");
    } finally {
      setLoading(false);
    }
  }, [categories]);

  // Initialize users from localStorage on mount
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    if (Array.isArray(allUsers)) {
      setUsers(allUsers);
    }
  }, []);

  // Generate and display reports on mount and when generateReports is called
  useEffect(() => {
    generateReports();
  }, [generateReports]);

  const value = {
    users,
    categories,
    reports,
    loading,
    error,
    fetchAllUsers,
    deleteUser,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    generateReports,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
