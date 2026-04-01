const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  products: {
    list: `${API_BASE_URL}/products`,
    detail: (id) => `${API_BASE_URL}/products/${id}`,
    create: `${API_BASE_URL}/products`,
    update: (id) => `${API_BASE_URL}/products/${id}`,
    delete: (id) => `${API_BASE_URL}/products/${id}`,
    byCategory: (category) => `${API_BASE_URL}/products/category/${category}`,
  },
  cart: {
    add: `${API_BASE_URL}/cart/add`,
    get: (userId) => `${API_BASE_URL}/cart/${userId}`,
    remove: (id) => `${API_BASE_URL}/cart/${id}`,
  },
  orders: {
    create: `${API_BASE_URL}/orders/place`,
    getProduct: (id) => `${API_BASE_URL}/orders/product/${id}`,
  },
};

export const getToken = () => localStorage.getItem("token");

export const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
