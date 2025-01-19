import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import '../pages/dashboardpage/dashboardNavbar.css'; // Import the CSS file

const DashboardNavbar = () => {
    return (
        <nav className="navbar1 navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
                <img src="/assets/images/highlight.png" alt="Logo" className="logoo" />
                <span className="ms-2">Haat Bazar</span>
            </Link>

            <div className="search-container d-flex mx-auto">
                <button className="btn btn-categoryy">
                    <i className="fas fa-bars"></i>
                </button>
                <input className="form-controll me-2" type="search" placeholder="Search for Anything" aria-label="Search" />
                <button className="btn search-btn" type="submit">
                    <i className="fas fa-search"></i>
                </button>
            </div>
            <div className="d-flex align-items-center">
                <Link className="btn btnn-primary me-2">
                    <i className="fas fa-plus"></i> Post
                </Link>
                <Link className="btn btn-link me-2"><i className="fas fa-user"></i></Link>
                <Link className="btn btn-link me-2"><i className="fas fa-heart"></i></Link>
                <Link className="btn btn-link me-2"><i className="fas fa-shopping-cart"></i></Link>
            </div>
        </nav>
    );
};

export default DashboardNavbar;
