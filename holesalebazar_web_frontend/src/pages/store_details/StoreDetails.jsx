import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchProductsByStore,
  fetchProductsByStoreAndCategory,
  searchProductsInStore,
} from "../../apis/Api";
import "./StoreDetails.css"; // Custom styles

const StoreDetails = () => {
  const { storeName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const storeColor =
    new URLSearchParams(location.search).get("color") || "primary";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByStore(storeName);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, [storeName]);

  const getStoreStatus = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 8 && currentHour < 21) {
      return { status: "Open", nextChange: "Closes 9 PM", color: "green" };
    } else {
      return { status: "Closed", nextChange: "Opens 8 AM", color: "red" };
    }
  };

  const storeStatus = getStoreStatus();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = async (category) => {
    try {
      const data = await fetchProductsByStoreAndCategory(storeName, category);
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const data = await searchProductsInStore(storeName, searchQuery);
      setProducts(data.products);
    } catch (error) {
      console.error("Error searching products in store:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="store-details-container mt-3">
      <header
        className={`d-flex justify-content-between align-items-center bg-${storeColor} text-white p-3 rounded shadow`}
      >
        <Button variant="light" onClick={() => navigate("/dashboard")}>
          &lt;
        </Button>
        <h1 className="h5 mb-0">Store Profile</h1>
        <Button variant="light" onClick={() => navigate("/booked")}>
          🛒
        </Button>
      </header>

      <section className="d-flex flex-column align-items-center bg-white p-3 rounded mt-3 shadow-sm text-center">
        <div className="store-details">
          <h2 className="h6 mb-1">{storeName}</h2>
          <p className="mb-0 text-muted">Vegetable | Superfood | Grocery</p>
          <p className="mb-0 text-muted">Location: Kathmandu, Street-4</p>
        </div>
      </section>

      <section className="d-flex align-items-center bg-white p-3 rounded mt-3 shadow-sm store-status">
        <FontAwesomeIcon icon={faClock} className="mr-2" />
        <span style={{ color: storeStatus.color, fontWeight: "bold" }}>
          {storeStatus.status}
        </span>
        <span className="text-muted ml-2">· {storeStatus.nextChange}</span>
      </section>

      <section className="bg-light p-3 rounded mt-3 text-center shadow-sm">
        <p className="mb-1">Get 10% off groceries with Plus+ Coupon Apply</p>
        <p className="mb-0 text-primary">Spend Rs. 500 to get 10% bonus</p>
      </section>

      <section className="input-group mt-3 shadow-sm search-bar">
        <input
          type="text"
          className="form-control"
          placeholder='Search for "Grocery"'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="input-group-append">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleSearch}
          >
            🔍
          </Button>
        </div>
      </section>

      <section className="d-flex justify-content-between mt-3 category-buttons">
        <Button
          variant="outline-primary"
          className="flex-fill mr-1"
          onClick={() => handleCategoryClick("Fruits")}
        >
          Fruits
        </Button>
        <Button
          variant="outline-primary"
          className="flex-fill mr-1"
          onClick={() => handleCategoryClick("Vegetables")}
        >
          Vegetables
        </Button>
        <Button
          variant="outline-primary"
          className="flex-fill mr-1"
          onClick={() => handleCategoryClick("Meats")}
        >
          Meats
        </Button>
        <Button
          variant="outline-primary"
          className="flex-fill mr-1"
          onClick={() => handleCategoryClick("Cereals")}
        >
          Cereals
        </Button>
      </section>

      <section className="mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h6 mb-0">Best Selling</h2>
          <Button variant="link">View all</Button>
        </div>
        <div className="d-flex flex-wrap justify-content-between mt-3">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                className="flex-fill mb-3 shadow-sm"
                key={product._id}
                style={{ margin: "0 10px", minWidth: "300px" }}
                onClick={() => handleProductClick(product._id)}
              >
                <Card.Body>
                  <Row>
                    <Col md={2}>
                      <Card.Img
                        variant="top"
                        src={`http://localhost:3030/public/products/${product.productImage}`} // Ensure the path is correct
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Title>{product.productName}</Card.Title>
                      <div className="d-flex justify-content-between">
                        <div>
                          <span>रु. {product.productPrice}</span> |{" "}
                          <span className="badge badge-success">
                            Available: {product.productAvailability}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <div>Store: {product.storeName}</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No products available in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StoreDetails;
