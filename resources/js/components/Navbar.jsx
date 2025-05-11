import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-6">
                <li>
                    <Link to="/" className="text-white hover:text-gray-300 font-semibold">
                        Beranda
                    </Link>
                </li>
                <li>
                    <Link to="/about" className="text-white hover:text-gray-300 font-semibold">
                        Tentang
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
