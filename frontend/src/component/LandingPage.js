import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/amazon-generator');
    };

    return (
        <div className="relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-400 min-h-screen flex items-center justify-center text-white">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="bg-gradient-to-br from-purple-300 via-transparent to-pink-300 h-full w-full opacity-50 animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="relative text-center z-10">
                <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg animate-fade-in">
                    Social<span className="text-yellow-300">2</span>Store
                </h1>
                <p className="mt-4 text-lg md:text-xl font-light">
                    Transform your social media content into Amazon listings in just a few clicks!
                </p>
                <button
                    onClick={handleGetStarted}
                    className="mt-8 px-6 py-3 text-lg font-semibold bg-yellow-300 text-gray-800 rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300"
                >
                    Get Started
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 h-20 w-20 bg-pink-400 rounded-full filter blur-xl opacity-30"></div>
            <div className="absolute bottom-20 right-20 h-28 w-28 bg-purple-400 rounded-full filter blur-xl opacity-30"></div>
        </div>
    );
};

export default LandingPage;
