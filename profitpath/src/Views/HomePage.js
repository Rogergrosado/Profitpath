// src/Views/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
    const [isBlue, setIsBlue] = useState(false);

    const toggleColor = () => {
        setIsBlue(!isBlue);
    };

    return (
        <div className="profit-homepage">
            <h1>Welcome to ProfitPath</h1>
            <p>Charting the Best Path to Profitability.</p>
            <div className={`profit-color-box ${isBlue ? 'profit-blue' : 'profit-red'}`}></div>
            <button className="profit-button" onClick={toggleColor}>Change Color</button>
        </div>
    );
};

export default HomePage;