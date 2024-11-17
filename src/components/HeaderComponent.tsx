import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-center items-center">
            <div className="flex justify-between w-full max-w-4xl px-4">
                <div className="text-xl font-bold flex">
                    <img
                        src="/icon-kp-inv-orange.svg"
                        alt="KinoFinder Logo"
                        className="h-8 w-8"
                    />
                    <Link to="/">KinoFinder</Link>
                </div>

                <nav className="flex space-x-4">
                    <Link to="/" className="text-white">Главная</Link>
                    <Link to="/about" className="text-white">О нас</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
