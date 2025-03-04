import React from "react";
import "./Body.css";
import LetteringLogo from "../assets/images/lettering_logo_v1.png"; // Adjusted path

const Body = () => {
  return (
    <div className="body-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Unlock Amazon Intelligence at Scale</h1>
          <p>Streamline your Amazon FBA business with automation and insights.</p>
          <button className="hero-cta">Get Started</button>
        </div>
        <img src={LetteringLogo} alt="ProfitPath Hero" className="hero-image" />
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose ProfitPath?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Smart Inventory Tracking</h3>
            <p>Monitor stock levels, prevent shortages, and optimize restocking.</p>
          </div>
          <div className="feature">
            <h3>Automated Pricing</h3>
            <p>Use AI-driven pricing strategies to stay competitive.</p>
          </div>
          <div className="feature">
            <h3>Shipping Cost Optimization</h3>
            <p>Get real-time cost estimates for FedEx, UPS, and more.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Connect Your Amazon Store</h3>
            <p>Sync your inventory, sales data, and pricing automatically.</p>
          </div>
          <div className="step">
            <h3>2. Optimize & Automate</h3>
            <p>Use AI tools to adjust pricing and manage stock levels.</p>
          </div>
          <div className="step">
            <h3>3. Grow Your Sales</h3>
            <p>Maximize profits with real-time insights and automation.</p>
          </div>
        </div>
      </section>

      {/* Call-To-Action Section */}
      <section className="cta-section">
        <h2>Accelerate Your Amazon Business Today</h2>
        <button className="cta-button">Sign Up Now</button>
      </section>
    </div>
  );
};

export default Body;
