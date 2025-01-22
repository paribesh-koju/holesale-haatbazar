import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homepage/HomePage";
import RegisterPage from "./pages/registerpage/RegisterPage";
import LoginPage from "./pages/loginpage/LoginPage";
import StartPage from "./pages/startpage/StartPage";
import AdminDashboard from "./pages/adminpage/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import AddProduct from "./pages/addproduct/AddProductDetails";
import UpdateProduct from "./pages/adminupdate/ProductUpdate";
import UserRoutes from "./pages/protected_routes/UserRoutes";
import AdminRoutes from "./pages/protected_routes/AdminRoutes";
import ProductDetails from "./pages/product_details/ProductDetails";
import Cart from "./pages/product_card/Cart";
import StoreDetails from "./pages/store_details/StoreDetails";

const RedirectBasedOnRole = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("Parsed user data:", parsedUser); // Debug log
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
  }, []);

  if (user === null) {
    // Still loading or error in user data
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.isAdmin ? (
    <Navigate to="/admin-dashboard" />
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const getCartKey = (userId) => `cartProducts_${userId}`;

  const [cartProducts, setCartProducts] = useState(() => {
    if (user && user._id) {
      const saved = localStorage.getItem(getCartKey(user._id));
      console.log(`Loaded cart for user ${user._id}:`, saved); // Debug log
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save cart to local storage when user or cartProducts change
  useEffect(() => {
    if (user && user._id) {
      console.log(`Saving cart for user ${user._id}:`, cartProducts); // Debug log
      localStorage.setItem(getCartKey(user._id), JSON.stringify(cartProducts));
    }
  }, [cartProducts, user]);

  const addToCart = (product) => {
    setCartProducts((prevProducts) => [
      ...prevProducts,
      { ...product, timeAdded: Date.now() },
    ]);
    console.log("Product added to cart:", product); // Debugging log
  };

  const removeFromCart = (productId) => {
    setCartProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
    console.log("Product removed from cart:", productId); // Debugging log
  };

  const updateCart = (updatedProducts) => {
    setCartProducts(updatedProducts);
  };

  const checkCartExpiry = () => {
    const now = Date.now();
    setCartProducts((prevProducts) =>
      prevProducts.filter((product) => {
        if (now - product.timeAdded >= 3600000) {
          console.log("Product expired from cart:", product.id); // Debugging log
          return false;
        }
        return true;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(checkCartExpiry, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <HomePage /> : <StartPage />} />
        <Route
          path="/login"
          element={<LoginPage setCartProducts={setCartProducts} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/store-details/:storeName" element={<StoreDetails />} />
        <Route
          path="/product/:productId"
          element={
            <ProductDetails
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartProducts={cartProducts}
            />
          }
        />
        <Route
          path="/booked"
          element={
            <Cart
              cartProducts={cartProducts}
              removeFromCart={removeFromCart}
              updateCart={updateCart}
            />
          }
        />
        <Route element={<UserRoutes />}>
          <Route path="/dashboard" element={<HomePage />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/updateproduct/:productId" element={<UpdateProduct />} />
          <Route path="/addproduct" element={<AddProduct />} />
        </Route>
        <Route path="/redirect" element={<RedirectBasedOnRole />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
