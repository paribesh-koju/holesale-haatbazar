import axios from "axios";

const API_URL = "http://localhost:3030"; // Your backend API URL

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/register`,
      userData
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, userData);
    return response; // Return the full response
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/products/create`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      }
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Fetch all products
export const fetchProducts = async (page) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/pagination?page=${page}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch all products without pagination
export const fetchallProducts = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/get_all_products`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch product by ID
export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/get_single_product/${productId}`,
      getAuthHeaders()
    );
    return response.data.product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

//fetching new arrivals
export const fetchNewArrivals = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products/new_arrivals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/products/update_product/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      }
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/products/delete_product/${productId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/profile`,
      getAuthHeaders()
    );
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/users/updateprofile`,
      userData,
      getAuthHeaders()
    );
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Forgot password api
export const forgotPasswordApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/forgot_password`,
      data
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error with forgot password:", error);
    throw error;
  }
};

// Verify OTP
export const verifyOtpApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/verify_otp`, data);
    return response; // Return the full response
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Fetch products by store name
export const fetchProductsByStore = async (storeName) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/by_store?storeName=${storeName}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by store:", error);
    throw error;
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/by_category?category=${category}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

// Search products by name with pagination
export const searchProducts = async (pageNumber, searchQuery = "") => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/search_products?page=${pageNumber}&search=${searchQuery}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Fetch products by store name and category
export const fetchProductsByStoreAndCategory = async (storeName, category) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/by_store_and_category?storeName=${storeName}&category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by store and category:", error);
    throw error;
  }
};

// Fetch products by store name and search query
export const searchProductsInStore = async (storeName, query) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/search_in_store?storeName=${storeName}&query=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products in store:", error);
    throw error;
  }
};
