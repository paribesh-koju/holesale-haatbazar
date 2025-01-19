import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Navbar,
  Nav,
  Card,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import {
  FaAppleAlt,
  FaCarrot,
  FaDrumstickBite,
  FaSeedling,
} from "react-icons/fa";
import "./HomePage.css"; // Import the CSS file
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Profile from "../profile/ProfilePage";
import {
  fetchNewArrivals,
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from "../../apis/Api";

const HomePage = () => {
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const loadProducts = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      let data = [];
      if (activeCategory) {
        const response = await fetchProductsByCategory(activeCategory);
        if (response && response.products) {
          data = response.products;
        }
      } else {
        const response = await fetchProducts(pageNumber);
        if (response && response.products) {
          data = response.products;
          setTrendingProducts(shuffleArray(response.products).slice(0, 3));
          setTotalPages(response.totalPages);
        }
      }
      setProducts(Array.isArray(data) ? data : []);
      const newArrivalsData = await fetchNewArrivals();
      setNewArrivals(newArrivalsData.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false); // Stop loading
  }, [activeCategory, pageNumber]);

  const loadSearchedProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchProducts(pageNumber, searchQuery);
      if (response && response.products) {
        setProducts(response.products);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  }, [pageNumber, searchQuery]);

  // useEffect(() => {
  //   loadProducts();
  //   const interval = setInterval(() => {
  //     loadProducts();
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [pageNumber, activeCategory, loadProducts]);
  useEffect(() => {
    if (searchQuery) {
      loadSearchedProducts();
    } else {
      loadProducts();
      const interval = setInterval(() => {
        loadProducts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [pageNumber, searchQuery, loadSearchedProducts, loadProducts]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleStoreClick = (storeName, storeColor) => {
    navigate(`/store-details/${storeName}?color=${storeColor}`);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadSearchedProducts();
    }
  };

  return (
    <>
      <Navbar className="header sticky-top" bg="light" expand="lg">
        <Container>
          <img
            src="/assets/images/highlight.png"
            alt="Logo"
            className="logo1"
          />
          <Navbar.Brand href="#">HolesaleBazar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="d-flex mx-auto">
              <Form.Control
                type="search"
                placeholder="Search for anything"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button variant="outline-success" onClick={loadSearchedProducts}>
                Search
              </Button>
            </Form>
            <Nav>
              <Nav.Link href="/booked">Booked</Nav.Link>
              <Nav.Link onClick={openProfileModal} href="#profile">
                Profile
              </Nav.Link>
              <Nav.Link onClick={handleLogout} href="#logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://www.partstown.com/about-us/wp-content/uploads/2024/02/Most-Profitable-Farmers-Market-Items.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Upto 50% off Product</h5>
              <p>Best quality Products on Market</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://food.unl.edu/newsletters/images/farmers-market_0.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Best Services Provider for Loyal Customer</h5>
              <p>Quality is unpredictable</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://www.grocery.coop/sites/default/files/wp-content/uploads/2010/06/Getting_Great_Food_Farmers_Markets_1.jpg"
              className="d-block w-100"
              alt="..."
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Healtly and fresh Products Available</h5>
              <p>More and more product on presents</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <Container fluid className="mt-3">
        <Row className="mt-5">
          <Col md={3} sm={12}>
            <h5>Category</h5>
            <div className="category-list">
              <Button
                variant="outline-primary"
                className="w-100 my-1"
                onClick={() => handleCategoryClick("Fruits")}
              >
                <FaAppleAlt className="me-2" />
                Fruits
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 my-1"
                onClick={() => handleCategoryClick("Vegetables")}
              >
                <FaCarrot className="me-2" />
                Vegetables
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 my-1"
                onClick={() => handleCategoryClick("Meats")}
              >
                <FaDrumstickBite className="me-2" />
                Meats
              </Button>
              <Button
                variant="outline-primary"
                className="w-100 my-1"
                onClick={() => handleCategoryClick("Cereals")}
              >
                <FaSeedling className="me-2" />
                Cereals
              </Button>
            </div>

            <Row>
              <h5>Features Stores Available</h5>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="warning"
                onClick={() => handleStoreClick("Luna Store", "warning")}
              >
                Luna Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="secondary"
                onClick={() => handleStoreClick("Koju Store", "secondary")}
              >
                Koju Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="info"
                onClick={() => handleStoreClick("Co and Prithvi", "info")}
              >
                Co and Prithvi
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="success"
                onClick={() => handleStoreClick("Gudesh Store", "success")}
              >
                Gudesh Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="success"
                onClick={() => handleStoreClick("Rajamati Store", "success")}
              >
                Rajamati Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="danger"
                onClick={() => handleStoreClick("Intern and Permed", "danger")}
              >
                Intern and Permed
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="warning"
                onClick={() => handleStoreClick("Mahendra Store", "warning")}
              >
                Mahendra Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="secondary"
                onClick={() => handleStoreClick("thiland Store", "secondary")}
              >
                Thiland Store
              </Button>
              <Button
                className="col-7 mx-auto my-2 btn-custom"
                variant="info"
                onClick={() => handleStoreClick("Sama and magar lmt", "info")}
              >
                Sama and Magar LMT
              </Button>
            </Row>
          </Col>

          <Col md={6} sm={12}>
            {loading ? (
              <Spinner animation="border" />
            ) : activeCategory ? (
              <>
                <h5>{activeCategory}</h5>
                <div className="product-section">
                  {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                      <Card
                        key={product._id}
                        className="mb-4 shadow-sm card-custom"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <Card.Body>
                          <Row>
                            <Col md={2}>
                              <Card.Img
                                variant="top"
                                src={`http://localhost:3030/public/products/${product.productImage}`}
                              />
                            </Col>
                            <Col md={8}>
                              <Card.Title>{product.productName}</Card.Title>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <span>रु. {product.productPrice}</span> |{" "}
                                  <span className="badge">
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
                    <p>No products available</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h5 className="mt-4">Trending</h5>
                <div className="trending-section">
                  {trendingProducts.map((product) => (
                    <Card
                      key={product._id}
                      className="mb-4 shadow-sm mr-2 card-custom"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <Card.Img
                              variant="top"
                              src={`http://localhost:3030/public/products/${product.productImage}`}
                            />
                          </Col>
                          <Col md={8}>
                            <Card.Title>{product.productName}</Card.Title>
                            <div className="d-flex justify-content-between">
                              <div>
                                <span>रु. {product.productPrice}</span> |{" "}
                                <span className="badge">
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
                  ))}
                </div>
                <Tabs
                  defaultActiveKey="latest"
                  id="uncontrolled-tab-example"
                  className="mt-4"
                >
                  <Tab eventKey="latest" title="Latest Uploads">
                    <Row className="mt-3">
                      <Col md={12} sm={12}>
                        <h5>All Products</h5>
                        <div className="product-section">
                          {products.map((product) => (
                            <Card
                              key={product._id}
                              className="mb-4 shadow-sm card-custom"
                              onClick={() => handleProductClick(product._id)}
                            >
                              <Card.Body>
                                <Row>
                                  <Col md={2}>
                                    <Card.Img
                                      variant="top"
                                      src={`http://localhost:3030/public/products/${product.productImage}`}
                                    />
                                  </Col>
                                  <Col md={8}>
                                    <Card.Title>
                                      {product.productName}
                                    </Card.Title>
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <span>रु. {product.productPrice}</span>{" "}
                                        |{" "}
                                        <span className="badge">
                                          Available:{" "}
                                          {product.productAvailability}
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
                          ))}
                        </div>
                        <button
                          className="button"
                          onClick={() => setPageNumber(pageNumber + 1)}
                          disabled={loading || pageNumber >= totalPages}
                        >
                          Next
                        </button>
                        <button
                          className="button"
                          onClick={() => setPageNumber(pageNumber - 1)}
                          disabled={loading || pageNumber <= 1}
                        >
                          Previous
                        </button>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="recommended" title="Recommended">
                    <Row className="mt-3">
                      <Col md={12}>
                        {newArrivals.map((product) => (
                          <Card
                            key={product._id}
                            className="mb-4 shadow-sm card-custom"
                            onClick={() => handleProductClick(product._id)}
                          >
                            <Card.Body>
                              <Row>
                                <Col md={2}>
                                  <Card.Img
                                    variant="top"
                                    src={`http://localhost:3030/public/products/${product.productImage}`}
                                  />
                                </Col>
                                <Col md={8}>
                                  <Card.Title>{product.productName}</Card.Title>
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <span>रु. {product.productPrice}</span> |{" "}
                                      <span className="badge">
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
                        ))}
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </>
            )}
          </Col>
          <Col md={3} sm={12}>
            <h5>Advertisements</h5>
            <div className="advertisement-section">
              <Card className="mb-4 shadow-sm card-custom">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <video width="100%" controls autoPlay muted loop>
                        <source
                          src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/GTYSdDW/chow-kit-fruit-and-vegetable-street-market-kuala-lumpur-malaysia-asia_bj6tz1j4s__6c5a0f10655ec9255b80b96250cc1005__P360.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Col>
                    <Col md={12}>
                      <Card.Title>Market place to buy</Card.Title>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="mb-4 shadow-sm card-custom">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <video width="100%" controls autoPlay muted loop>
                        <source
                          src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/GTYSdDW/chow-kit-fruit-and-vegetable-street-market-kuala-lumpur-malaysia-asia_wkv0zkynh__7468c012cc7a123cf748610f84a59af4__P360.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Col>
                    <Col md={12}>
                      <Card.Title>Croudy market location</Card.Title>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="mb-4 shadow-sm card-custom">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <video width="100%" controls autoPlay muted loop>
                        <source
                          src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/SE6H2xwPmjlia3kue/videoblocks-check-out-at-the-market-time-lapse_b7lyw5nkb__784cb4e89d48b5cadcb82696677dcbc6__P360.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Col>
                    <Col md={12}>
                      <Card.Title>Payment Process inside market</Card.Title>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
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
    </>
  );
};

export default HomePage;
