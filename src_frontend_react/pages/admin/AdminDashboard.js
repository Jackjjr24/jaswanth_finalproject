import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { reports, generateReports, loading } = useContext(AdminContext);

  useEffect(() => {
    // generateReports is now called automatically by AdminProvider
    // but we can call it again here if needed for manual refresh
    generateReports();
  }, [generateReports]);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, categories, and view system reports</p>
      </div>

      <div className="admin-grid">
        <Link to="/admin/users" className="admin-card">
          <h3>User Management</h3>
          <p>Manage customer and seller accounts</p>
          {reports?.users?.total && (
            <span className="card-stat">{reports.users.total} Users</span>
          )}
        </Link>

        <Link to="/admin/categories" className="admin-card">
          <h3>Categories</h3>
          <p>Add, modify, or remove product categories</p>
          {reports?.products?.categories && (
            <span className="card-stat">{reports.products.categories} Categories</span>
          )}
        </Link>

        <Link to="/admin/reports" className="admin-card">
          <h3>Reports</h3>
          <p>View system statistics and analytics</p>
        </Link>
      </div>

      {!loading && reports && (
        <div className="quick-stats-section">
          <h2>Quick Statistics</h2>
          <div className="stats-grid">
            {reports.users?.total > 0 && (
              <div className="stat-box">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{reports.users.total}</span>
              </div>
            )}
            {reports.users?.customers > 0 && (
              <div className="stat-box">
                <span className="stat-label">Customers</span>
                <span className="stat-value">{reports.users.customers}</span>
              </div>
            )}
            {reports.users?.sellers > 0 && (
              <div className="stat-box">
                <span className="stat-label">Sellers</span>
                <span className="stat-value">{reports.users.sellers}</span>
              </div>
            )}
            {reports.orders?.total > 0 && (
              <div className="stat-box">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{reports.orders.total}</span>
              </div>
            )}
            {reports.products?.total > 0 && (
              <div className="stat-box">
                <span className="stat-label">Total Products</span>
                <span className="stat-value">{reports.products.total}</span>
              </div>
            )}
            {reports.products?.categories > 0 && (
              <div className="stat-box">
                <span className="stat-label">Categories</span>
                <span className="stat-value">{reports.products.categories}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
