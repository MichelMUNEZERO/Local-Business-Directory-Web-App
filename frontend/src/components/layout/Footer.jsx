import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Local Business Directory</h5>
            <p className="text-light">
              Connecting communities with local businesses. Find services near
              you or list your business to reach more customers.
            </p>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link className="text-light text-decoration-none" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/businesses"
                >
                  Businesses
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/submit-business"
                >
                  Add Business
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h6>Categories</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/businesses/category/1"
                >
                  Salon & Beauty
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/businesses/category/2"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/businesses/category/3"
                >
                  Retail
                </Link>
              </li>
              <li>
                <Link
                  className="text-light text-decoration-none"
                  to="/businesses/category/4"
                >
                  Health
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6>Contact Us</h6>
            <p className="text-light mb-1">
              Email: info@localbusinessdirectory.com
            </p>
            <p className="text-light mb-1">Phone: +123 456 7890</p>
            <div className="mt-3">
              <a href="#" className="text-light me-3 fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3 fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3 fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light mt-4" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-light mb-0">
              &copy; {currentYear} Local Business Directory. All rights
              reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link
              className="text-light text-decoration-none me-3"
              to="/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-light text-decoration-none"
              to="/terms-of-service"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
