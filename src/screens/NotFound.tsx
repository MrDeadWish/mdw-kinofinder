import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-8">Страница не найдена</p>
            <Link to="/" className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFound;
