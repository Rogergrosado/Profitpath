// src/Views/HomePage.js
import React, { useState } from 'react';
import './HomePage.css';

import Header from './Header.js';
import Body from './Body.js';
import Footer from './Footer.js';

const HomePage = () => {

    return (
        <div className="profit-homepage">
            <Header />
            <Body />
            <Footer />
       
        </div>
    );
};

export default HomePage;