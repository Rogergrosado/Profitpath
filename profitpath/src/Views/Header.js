import React from "react";
import "./Header.css";
import ProfitPathLogo from "../assets/images/logo512.png"; // Adjusted path
import LetteringLogo from "../assets/images/lettering_logo_v1.png"; // Adjusted path

const Header = () => {
  return (
    <header className="header">
      {/* Logo & Branding */}
      <div className="logo-container">
        <img src={ProfitPathLogo} alt="ProfitPath Logo" className="brand-logo" />
        <span className="brand-slogan">Path to Profit</span>
      </div>

      {/* Navigation */}
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#resources">Resources</a>
        <a href="#contact">Contact</a>
      </nav>

      {/* CTA Button */}
      <button className="cta-button">Get Started</button>
    </header>
  );
};

export default Header;

