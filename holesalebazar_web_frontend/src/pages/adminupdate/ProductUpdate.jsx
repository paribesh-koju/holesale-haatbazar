import React, { useState, useEffect } from "react";
import "./UpdateProduct.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProductById, updateProduct } from "../../apis/Api"; // Import API functions
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { productId } = useParams(); // Get productId from URL parameters
  const navigate = useNavigate(); // For navigation after update

  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAvailability, setProductAvailability] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await fetchProductById(productId);
        setStoreName(product.storeName);
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setProductCategory(product.productCategory);
        setProductDescription(product.productDescription);
        setProductAvailability(product.productAvailability);
        setOldImage(
          `http://localhost:3030/public/products/${product.productImage}`
        );
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Error loading product data.");
      }
    };

    loadProduct();
  }, [productId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
      setNewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("storeName", storeName);
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    formData.append("productAvailability", productAvailability);
    if (productImage) {
      formData.append("productImage", productImage);
    }

    try {
      const res = await updateProduct(productId, formData);
      if (res.status === 200) {
        toast.success(res.data.message || "Product updated successfully!");
        navigate("/admin-dashboard"); // Navigate to dashboard after successful update
      } else {
        toast.error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  return (
    <div className="update-product-container">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="storeName">Store Name</label>
          <select
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Luna Store">Luna Store</option>
            <option value="Koju Store">Koju Store</option>
            <option value="Co and Prithvi">Co and Prithvi</option>
            <option value="Gudesh Store">Gudesh Store</option>
            <option value="Rajamati Store">Rajamati Store</option>
            <option value="Intern and permed">Intern and permed</option>
            <option value="Mahendra Store">Mahendra Store</option>
            <option value="thiland Store">thiland Store</option>
            <option value="Sama and magar lmt">Sama and magar lmt</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productPrice">Product Price</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productCategory">Product Category</label>
          <select
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Meats">Meats</option>
            <option value="Cereals">Cereals</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="productImage">Product Image</label>
          <input type="file" id="productImage" onChange={handleImageUpload} />
        </div>
        <div className="image-preview-container">
          {oldImage && (
            <div className="old-image-preview">
              <p>Old Image:</p>
              <img src={oldImage} alt="Old Preview" className="image-preview" />
            </div>
          )}
          {newImage && (
            <div className="new-image-preview">
              <p>New Image:</p>
              <img src={newImage} alt="New Preview" className="image-preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productAvailability">Product Availability</label>
          <select
            id="productAvailability"
            value={productAvailability}
            onChange={(e) => setProductAvailability(e.target.value)}
            required
          >
            <option value="">Select Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Minimum">Minimum</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="update-button">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
