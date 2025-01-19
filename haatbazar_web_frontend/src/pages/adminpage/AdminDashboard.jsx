import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AddProduct from "../addproduct/AddProductDetails";
import Profile from "../profile/ProfilePage";
import { fetchallProducts, deleteProduct } from "../../apis/Api"; // Import the deleteProduct function
import { confirmAlert } from "react-confirm-alert"; // Import the confirm alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the CSS for the confirmation dialog
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const data = await fetchallProducts();
      setProducts(data.products); // Assuming the response has a `products` field
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    closeModal(); // Close the modal after adding the product
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };

  const confirmDelete = (productId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(productId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleUpdate = (product) => {
    navigate(`/updateproduct/${product._id}`, { state: { product } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="header sticky-top">
        <div className="header-left">
          <img
            src="/assets/images/highlight.png"
            alt="Logo"
            className="logo1"
          />
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <nav className="nav-links">
            <a href="/dashboard">Home</a>
          </nav>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={openModal} className="add-product">
            Add Product
          </button>
          <div className="profile-dropdown">
            <button className="profile-btn">Profile</button>
            <div className="dropdown-content">
              <a href="#settings" onClick={openProfileModal}>
                Settings
              </a>
              <a href="#logout" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </div>
          <button className="hamburger-menu">&#9776;</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Product Description</th>
              <th>Product Category</th>
              <th>Product Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.storeName}</td>
                <td>
                  <img
                    src={`http://localhost:3030/public/products/${product.productImage}`}
                    alt={product.productName}
                    className="product-image"
                  />
                </td>
                <td>{product.productName}</td>
                <td>NPR. {product.productPrice}</td>
                <td>{product.productDescription}</td>
                <td>{product.productCategory}</td>
                <td>{product.productAvailability}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdate(product)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create a new product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <AddProduct onProductAdded={handleProductAdded} />{" "}
                {/* Pass the callback here */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isProfileModalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeProfileModal}
                ></button>
              </div>
              <div className="modal-body">
                <Profile onClose={closeProfileModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
