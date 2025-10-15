import React from 'react';
import { NavLink } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 text-primary-dark">
              <Stethoscope size={32} />
              <span className="text-2xl font-bold">People Kind Pharma</span>
            </NavLink>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink end to="/" className={({ isActive }) => `text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary-dark'}`}>
              Home
            </NavLink>
            <NavLink to="/medicines" className={({ isActive }) => `text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary-dark'}`}>
              Medicines
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;