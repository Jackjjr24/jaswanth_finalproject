import { useState, useEffect } from "react";
import "../Auth.css";

function SalesReports() {
  const [reportData, setReportData] = useState({
    totalSales: 0,
    totalOrders: 0,
    thisMonthSales: 0,
    thisMonthOrders: 0,
  });
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const totalSales = storedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const thisMonthOrders = storedOrders.filter((order) => {
      const orderDate = new Date(order.date);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    });

    setReportData({
      totalSales,
      totalOrders: storedOrders.length,
      thisMonthSales: thisMonthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      thisMonthOrders: thisMonthOrders.length,
    });

    setSales(storedOrders.map((order) => ({
      date: order.date,
      items: order.items,
      quantity: order.items ? order.items.length : 0,
      revenue: order.totalAmount,
    })));

    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading reports...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "30px" }}>Sales Reports</h1>



      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        <div style={{ border: "1px solid var(--border)", padding: "20px", textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Total Sales</p>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>₹{reportData.totalSales?.toLocaleString() || 0}</p>
        </div>
        <div style={{ border: "1px solid var(--border)", padding: "20px", textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Total Orders</p>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)" }}>{reportData.totalOrders || 0}</p>
        </div>
        <div style={{ border: "1px solid var(--border)", padding: "20px", textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>This Month Sales</p>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>₹{reportData.thisMonthSales?.toLocaleString() || 0}</p>
        </div>
        <div style={{ border: "1px solid var(--border)", padding: "20px", textAlign: "center", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>This Month Orders</p>
          <p style={{ fontSize: "24px", fontWeight: "700", color: "var(--success)" }}>{reportData.thisMonthOrders || 0}</p>
        </div>
      </div>

      <h3 style={{ marginBottom: "20px" }}>Recent Sales</h3>
      {sales.length > 0 ? (
        <div style={{ overflowX: "auto", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Date</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Product Name</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Quantity</th>
                <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", fontSize: "14px" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "16px", fontSize: "14px" }}>
                    {sale.date ? new Date(sale.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td style={{ padding: "16px", fontSize: "14px" }}>{sale.productName}</td>
                  <td style={{ padding: "16px", fontSize: "14px" }}>{sale.quantity}</td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "var(--success)" }}>
                    ₹{sale.revenue?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px" }}>
          <p style={{ fontSize: "16px", color: "#94a3b8" }}>No sales data available</p>
        </div>
      )}
    </div>
  );
}

export default SalesReports;
