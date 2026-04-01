import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import "./Reports.css";

function Reports() {
  const { reports, generateReports, loading } = useContext(AdminContext);

  useEffect(() => {
    generateReports();
  }, [generateReports]);

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="reports-container">
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>System Reports</h1>
        <p>View detailed system statistics and analytics</p>
      </div>

      <div className="reports-grid">
        {/* User Statistics */}
        <div className="report-card users-report">
          <div className="report-title">
            <h2>User Statistics</h2>
          </div>
          <div className="report-content">
            <table className="report-table">
              <tbody>
                <tr>
                  <td className="label">Total Users</td>
                  <td className="value">{reports.users?.total || 0}</td>
                </tr>
                <tr>
                  <td className="label">Customers</td>
                  <td className="value customer">{reports.users?.customers || 0}</td>
                </tr>
                <tr>
                  <td className="label">Sellers</td>
                  <td className="value seller">{reports.users?.sellers || 0}</td>
                </tr>
                <tr>
                  <td className="label">Administrators</td>
                  <td className="value admin">{reports.users?.admins || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Statistics */}
        <div className="report-card products-report">
          <div className="report-title">
            <h2>Product Statistics</h2>
          </div>
          <div className="report-content">
            <table className="report-table">
              <tbody>
                <tr>
                  <td className="label">Total Products</td>
                  <td className="value">{reports.products?.total || 0}</td>
                </tr>
                <tr>
                  <td className="label">Total Categories</td>
                  <td className="value">{reports.products?.categories || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="report-card orders-report">
          <div className="report-title">
            <h2>Order Statistics</h2>
          </div>
          <div className="report-content">
            <table className="report-table">
              <tbody>
                <tr>
                  <td className="label">Total Orders</td>
                  <td className="value">{reports.orders?.total || 0}</td>
                </tr>
                <tr>
                  <td className="label">Total Revenue</td>
                  <td className="value revenue">₹{(reports.orders?.revenue || 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h2>System Summary</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Active Users</span>
            <span className="summary-value">
              {(reports.users?.customers || 0) + (reports.users?.sellers || 0)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg Order Value</span>
            <span className="summary-value">
              ₹{reports.orders?.total > 0 
                ? (reports.orders?.revenue / reports.orders?.total).toFixed(2) 
                : 0}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Product Categories</span>
            <span className="summary-value">{reports.products?.categories || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Revenue</span>
            <span className="summary-value">₹{(reports.orders?.revenue || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
