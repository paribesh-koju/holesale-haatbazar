import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Tabs,
  Tab,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { fetchProductById } from "../../apis/Api"; // Adjust the path accordingly
import { toast } from "react-toastify";

const ProductDetails = ({ addToCart, removeFromCart, cartProducts }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isProductBooked, setIsProductBooked] = useState(false);

  //navigate the page
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        console.log("Fetched product:", data); // Debugging log
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    //provide the loadproduct function to load the product form the id
    loadProduct();
  }, [productId]);

  //implement the use effect
  useEffect(() => {
    if (product && product._id) {
      const booked = cartProducts.some((p) => p.id === product._id);
      setIsProductBooked(booked);
      console.log(`Product ${product._id} booked status:`, booked); // Debugging log
    }
  }, [product, cartProducts]);

  //adding the logic for handling the cart add
  const handleAddToCart = () => {
    confirmAlert({
      title: "Confirm to Book",
      message: "Are you sure you want to book this product?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (!isProductBooked && product && product._id) {
              addToCart({ ...product, id: product._id, quantity: 1 });
              setIsProductBooked(true);
              console.log("Product added to cart:", product); // Debugging log
            } else {
              console.log("Product is already booked or ID is undefined");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  //funtion to cancel the booking system in the applicaiton
  const handleCancelBooking = () => {
    confirmAlert({
      title: "Confirm to Cancel",
      message: "Are you sure you want to cancel this booking?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (product && product._id) {
              removeFromCart(product._id);
              setIsProductBooked(false);
              console.log("Product removed from cart:", product._id); // Debugging log
            } else {
              console.log("Product ID is undefined");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  //logic for logout the application
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
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
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>

              <Nav.Link onClick={handleLogout} href="#logout">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row className="justify-content-center mb-4">
          <Col md={12} className="text-center">
            <h1>Product Details</h1>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <Card className="border-0">
              <Image
                src={`http://localhost:3030/public/products/${product.productImage}`}
                fluid
                className="mb-3"
              />
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0">
              <Card.Body>
                <Card.Title className="display-4">
                  {product.productName}
                </Card.Title>
                <Card.Text className="text-success">
                  <strong> Available: {product.productAvailability}</strong>
                </Card.Text>
                <Card.Text className="h4">
                  रु. {product.productPrice.toFixed(2)}
                </Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {product.productCategory}
                </Card.Text>

                <Col>
                  <Tabs
                    defaultActiveKey="description"
                    id="product-details-tabs"
                  >
                    <Tab eventKey="description" title="Descriptions">
                      <Card className="border-0">
                        <Card.Body>
                          <Card.Text>{product.productDescription}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Tab>
                  </Tabs>
                </Col>

                {isProductBooked ? (
                  <>
                    <Button variant="success" className="mt-3" disabled>
                      Product Booked
                    </Button>
                    <Button
                      variant="danger"
                      className="mt-3 ml-3"
                      onClick={handleCancelBooking}
                    >
                      Cancel Booking
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleAddToCart}
                  >
                    Book Now
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;
