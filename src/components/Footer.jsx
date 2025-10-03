// src/components/Footer.jsx
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Brand Info */}
          <div className="col-lg-4 mb-4">
            <h5 data-testid="footer-brand">
              <i className="fas fa-coins me-2"></i>LoanPro
            </h5>
            <p data-testid="footer-description">
              Your trusted partner for all loan consulting needs. We make financial dreams come true with expert guidance and competitive rates.
            </p>
            <div className="social-icons">
              <a href="#" data-testid="social-facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" data-testid="social-twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" data-testid="social-linkedin">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" data-testid="social-instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#home" data-testid="footer-link-home">Home</a></li>
              <li><a href="#services" data-testid="footer-link-services">Services</a></li>
              <li><a href="#about" data-testid="footer-link-about">About</a></li>
              <li><a href="#contact" data-testid="footer-link-contact">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Services</h5>
            <ul className="list-unstyled">
              <li><a href="#services" data-testid="footer-service-personal-loans">Personal Loans</a></li>
              <li><a href="#services" data-testid="footer-service-home-loans">Home Loans</a></li>
              <li><a href="#services" data-testid="footer-service-business-loans">Business Loans</a></li>
              <li><a href="#services" data-testid="footer-service-car-loans">Car Loans</a></li>
              <li><a href="#services" data-testid="footer-service-educational-loans">Educational Loans</a></li>
              <li><a href="#contact" data-testid="footer-service-consultation">Consultation</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 mb-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li data-testid="contact-address">
                <i className="fas fa-map-marker-alt me-2"></i>
                3-129 / Near Ramalayam , Back Side Post Office Road
                Zion Fellowship Chruch Road , Kunchanapalli - 522501
              </li>
              <li data-testid="contact-phone">
                <i className="fas fa-phone me-2"></i>
                +91 9885990001
              </li>
              <li data-testid="contact-email">
                <i className="fas fa-envelope me-2"></i>
                amarnathmyneedi.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p data-testid="copyright">
            &copy; 2025 LoanPro Consulting. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
