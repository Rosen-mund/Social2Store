import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AmazonListingGenerator from './components/AmazonListingGenerator';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/amazon-generator" element={<AmazonListingGenerator />} />
            </Routes>
        </Router>
    );
};

export default App;
