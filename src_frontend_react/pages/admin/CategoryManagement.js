import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import "./CategoryManagement.css";

function CategoryManagement() {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, loading } = useContext(AdminContext);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateForm = () => {
    if (!formData.trim()) {
      setErrors("Category name is required");
      return false;
    }
    if (formData.trim().length < 2) {
      setErrors("Category name must be at least 2 characters");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleAddCategory = async () => {
    if (!validateForm()) return;

    try {
      await addCategory(formData.trim());
      setFormData("");
      alert("Category added successfully");
    } catch (error) {
      setErrors(error.message);
    }
  };

  const handleEditClick = (index, category) => {
    setFormMode("edit");
    setEditingIndex(index);
    setFormData(category);
    setErrors("");
  };

  const handleUpdateCategory = async () => {
    if (!validateForm()) return;

    try {
      const oldName = categoriesList[editingIndex];
      await updateCategory(oldName, formData.trim());
      setFormData("");
      setFormMode("add");
      setEditingIndex(null);
      alert("Category updated successfully");
    } catch (error) {
      setErrors(error.message);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await deleteCategory(category);
      setDeleteConfirm(null);
      alert("Category deleted successfully");
    } catch (error) {
      alert("Failed to delete category: " + error.message);
    }
  };

  const handleCancel = () => {
    setFormData("");
    setFormMode("add");
    setEditingIndex(null);
    setErrors("");
  };

  const categoriesList = Array.isArray(categories) ? categories : [];

  return (
    <div className="category-management-container">
      <div className="category-header">
        <h1>Category Management</h1>
        <p>Add, modify, or remove product categories</p>
      </div>

      <div className="category-form-section">
        <h2>{formMode === "add" ? "Add New Category" : "Edit Category"}</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter category name..."
            value={formData}
            onChange={(e) => {
              setFormData(e.target.value);
              setErrors("");
            }}
            className={errors ? "input-error" : ""}
          />
          {errors && <span className="error-message">{errors}</span>}
        </div>

        <div className="form-buttons">
          <button
            onClick={formMode === "add" ? handleAddCategory : handleUpdateCategory}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : formMode === "add" ? "Add Category" : "Update Category"}
          </button>
          {formMode === "edit" && (
            <button
              onClick={handleCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="categories-list-section">
        <h2>Existing Categories ({categoriesList.length})</h2>

        {loading ? (
          <div className="loading">Loading categories...</div>
        ) : categoriesList.length === 0 ? (
          <div className="no-categories">
            <p>No categories found. Add one to get started!</p>
          </div>
        ) : (
          <div className="categories-list">
            {categoriesList.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-name">
                  <span className="category-number">{index + 1}</span>
                  <span className="category-text">{category}</span>
                </div>
                <div className="category-actions">
                  <button
                    onClick={() => handleEditClick(index, category)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  {deleteConfirm === index ? (
                    <div className="delete-confirm-inline">
                      <span>Confirm delete?</span>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="btn-confirm"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="btn-cancel"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(index)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryManagement;
