import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart } from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800">FH Coffee</h2>
                <p className="text-gray-600">Admin Panel</p>
            </div>
            <nav className="mt-4">
                <Link
                    to="/"
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${isActive('/') ? 'bg-gray-100 border-l-4 border-blue-500' : ''
                        }`}
                >
                    <FaHome className="mr-3" />
                    <span>Dashboard</span>
                </Link>
                <Link
                    to="/products"
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${isActive('/products') ? 'bg-gray-100 border-l-4 border-blue-500' : ''
                        }`}
                >
                    <FaBox className="mr-3" />
                    <span>Sản phẩm</span>
                </Link>
                <Link
                    to="/orders"
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${isActive('/orders') ? 'bg-gray-100 border-l-4 border-blue-500' : ''
                        }`}
                >
                    <FaShoppingCart className="mr-3" />
                    <span>Đơn hàng</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar; 