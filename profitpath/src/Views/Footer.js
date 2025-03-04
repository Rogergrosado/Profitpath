import React from "react";
import "./Footer.css";
import ProfitPathLogo from "../assets/images/logo512.png"; // Adjusted path

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Tagline */}
        <div className="footer-brand">
          <img src={ProfitPathLogo} alt="ProfitPath Logo" className="footer-logo" />
          <p className="footer-tagline">Automate Everything.</p>
        </div>

        {/* Navigation Links with Subcategories */}
        <div className="footer-links">
          <div className="footer-category">
            <p className="footer-category-title">Features</p>
            <ul>
              <li><a href="#inventory">Inventory Tracking</a></li>
              <li><a href="#pricing">Automated Pricing</a></li>
              <li><a href="#shipping">Shipping Optimization</a></li>
            </ul>
          </div>

          <div className="footer-category">
            <p className="footer-category-title">How It Works</p>
            <ul>
              <li><a href="#connect">Connect Your Store</a></li>
              <li><a href="#optimize">Optimize & Automate</a></li>
              <li><a href="#growth">Grow Your Sales</a></li>
            </ul>
          </div>

          <div className="footer-category">
            <p className="footer-category-title">Company</p>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright and Socials */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ProfitPath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
