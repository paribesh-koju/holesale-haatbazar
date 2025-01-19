import React, { useState } from "react";
import "./AddProduct.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createProduct } from "../../apis/Api";

const AddProduct = ({ onProductAdded }) => {
  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAvailability, setProductAvailability] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
      setPreviewImage(URL.createObjectURL(file));
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
    formData.append("productImage", productImage);

    try {
      const res = await createProduct(formData);
      if (res.status === 201 || res.status === 200) {
        toast.success(res.data.message || "Product created successfully!");
        onProductAdded(res.data.data); // Call the callback with the new product
      } else {
        toast.error("Unexpected response status");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 401) {
          toast.error("Unauthorized access");
        } else if (error.response.status === 500) {
          toast.error("Internal server error");
        } else {
          toast.error("Unexpected error response");
        }
      } else {
        toast.error("No response from the server");
      }
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
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
          <input
            type="file"
            id="productImage"
            onChange={handleImageUpload}
            required
          />
        </div>
        {previewImage && (
          <div className="image-preview-container">
            <img src={previewImage} alt="Preview" className="image-preview" />
          </div>
        )}
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
          <button type="submit" className="add-button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
