import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2 text-primary-dark">
              <img
                src="/pkpharma.jpeg"
                alt="People Kind Pharma Logo"
                width={32}
                height={32}
                className="object-contain rounded"
              />
              <img src="/banner-bgwhite.jpeg" alt="People Kind Pharma" height={32} className="h-8 object-contain"/>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              end
              to="/"
              className={({ isActive }) =>
                `text-lg font-medium ${
                  isActive ? "text-primary" : "text-gray-500 hover:text-primary-dark"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/medicines"
              className={({ isActive }) =>
                `text-lg font-medium ${
                  isActive ? "text-primary" : "text-gray-500 hover:text-primary-dark"
                }`
              }
            >
              Medicines
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center text-gray-700 hover:text-primary focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-4">
            <NavLink
              end
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${
                  isActive ? "text-primary" : "text-gray-700 hover:text-primary-dark"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/medicines"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium ${
                  isActive ? "text-primary" : "text-gray-700 hover:text-primary-dark"
                }`
              }
            >
              Medicines
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
