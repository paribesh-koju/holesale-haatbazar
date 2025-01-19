import React from "react";

const Header = () => {
  return (
    <header className="header sticky-top">
      <div className="logo-container">
        <img src="/assets/images/highlight.png" alt="Logo" className="logo" />
        <span className="logo-text">HolesaleBazar</span>
      </div>
      <nav className="navbar">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
        <a href="#about">About Us</a>
        <a href="#footer">Contact Us</a>
        <a href="/login" className="btn">
          Login
        </a>
      </nav>
    </header>
  );
};

export default Header;
