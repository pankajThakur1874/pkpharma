
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Stethoscope, Package, Shield, ShoppingCart } from 'lucide-react';
import { useEnquiry } from '../hooks/useEnquiry';

const Header: React.FC = () => {
    const { enquiryList } = useEnquiry();

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
            <NavLink to="/" className={({ isActive }) => `text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary-dark'}`}>
              Catalog
            </NavLink>
            <NavLink to="/admin" className={({ isActive }) => `text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-500 hover:text-primary-dark'}`}>
              Admin
            </NavLink>
          </nav>
          <div className="flex items-center">
             {/* Enquiry "Cart" - a real cart would be a future feature */}
             <div className="relative">
                <ShoppingCart className="text-gray-500" size={24} />
                {enquiryList.length > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                        {enquiryList.length}
                    </span>
                )}
                <span className="sr-only">Enquiry List</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
