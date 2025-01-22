import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { confirmAlert } from "react-confirm-alert";

const Cart = ({ cartProducts, removeFromCart, updateCart }) => {
  const [products, setProducts] = useState(cartProducts);

  //using navigate to navigating the page
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      // Update products based on time added
      const now = Date.now();
      setProducts((products) =>
        products.filter((product) => {
          if (now - product.timeAdded < 3600000) {
            return true;
          } else {
            removeFromCart(product.id); // Update the booking state in ProductDetails
            return false;
          }
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [removeFromCart]);

  useEffect(() => {
    setProducts(cartProducts);
  }, [cartProducts]);

  //adding the dynamic logic for the increasing and decreasing quantity of the product
  const updateQuantity = (id, delta) => {
    const updatedProducts = products.map((product) =>
      product.id === id
        ? { ...product, quantity: Math.max(1, product.quantity + delta) }
        : product
    );
    setProducts(updatedProducts); //set the product cart in the parent component
    updateCart(updatedProducts); // Update the cart in the parent component
  };

  //applying the time format to fetch the time dynamically
  const formatTimeRemaining = (timeAdded) => {
    const timeRemaining = 3600000 - (Date.now() - timeAdded);
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const subtotal = products.reduce((total, product) => {
    return (
      total +
      (product.productPrice ? product.productPrice * product.quantity : 0)
    );
  }, 0);
  const salesTax = subtotal * 0.1;
  const grandTotal = subtotal + salesTax;

  //providing the logic for the logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleCheckout = () => {
    // Confirm checkout
    if (window.confirm("Are you sure you want to proceed with the checkout?")) {
      products.forEach((product) => removeFromCart(product.id)); // Clear the cart
      toast.success("Checkout successful!");
      navigate("/"); // Redirect to home page
    }
  };

  const handleRemove = (id) => {
    confirmAlert({
      title: "Confirm to Cancel",
      message: "Are you sure you want to remove this product from the cart?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            removeFromCart(id);
            toast.success("Product removed successfully!");
          },
        },
        {
          label: "No",
        },
      ],
    });
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

      <div className="container my-5">
        <h2>Your Cart ({products.length} products)</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Time Left</th>
              <th scope="col">Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={`http://localhost:3030/public/products/${product.productImage}`}
                      alt={product.productName || "Product"}
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div className="ml-3">
                      <strong>{product.productName || "Product Name"}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  {product.productPrice
                    ? `रु. ${product.productPrice.toFixed(2)}`
                    : "N/A"}
                </td>
                <td>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => updateQuantity(product.id, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => updateQuantity(product.id, 1)}
                  >
                    +
                  </button>
                </td>
                <td>
                  {product.productPrice
                    ? `रु. ${(product.productPrice * product.quantity).toFixed(
                        2
                      )}`
                    : "N/A"}
                </td>
                <td>{formatTimeRemaining(product.timeAdded)}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(product.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right">
          <p>Subtotal: रु. {subtotal.toFixed(2)}</p>
          <p>Sales Tax: रु. {salesTax.toFixed(2)}</p>
          <p>
            Coupon Code:{" "}
            <a href="/" className="text-decoration-none">
              Add Coupon
            </a>
          </p>
          <h3>Grand Total: रु. {grandTotal.toFixed(2)}</h3>
          <p className="text-success">
            Congrats, you're eligible for Free Shipping
          </p>
          <button className="btn btn-success btn-lg" onClick={handleCheckout}>
            Check out
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
