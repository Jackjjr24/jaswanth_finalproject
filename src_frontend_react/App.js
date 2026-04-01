import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { AdminProvider } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import UserProfile from "./pages/UserProfile";

import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/Orders";
import SalesReports from "./pages/seller/SalesReports";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import Reports from "./pages/admin/Reports";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AdminProvider>
          <CartProvider>
            <BrowserRouter>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 70px)" }}>
              <Routes>
                
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <ProductDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-confirmation/:id"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/profile"
                  element={
                    <ProtectedRoute requiredRole="CUSTOMER">
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <SellerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/new"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/edit/:id"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <SellerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/sales-reports"
                  element={
                    <ProtectedRoute requiredRole="SELLER">
                      <SalesReports />
                    </ProtectedRoute>
                  }
                />

                
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <CategoryManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Reports />
                    </ProtectedRoute>
                  }
                />


                <Route path="/unauthorized" element={<h2 style={{ padding: "20px" }}>Access Denied</h2>} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </main>
            </BrowserRouter>
          </CartProvider>
        </AdminProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;