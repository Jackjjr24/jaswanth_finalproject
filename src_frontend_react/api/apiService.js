import { getHeaders } from "./config";

export const apiCall = async (url, options = {}) => {
  try {
    const headers = getHeaders();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error = new Error(
        typeof data === "object" && data.message ? data.message : data || `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const get = (url) => apiCall(url, { method: "GET" });

export const post = (url, body) =>
  apiCall(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const put = (url, body) =>
  apiCall(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const delete_ = (url) => apiCall(url, { method: "DELETE" });
