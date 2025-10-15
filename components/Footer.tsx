import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary-dark">
              <img src="/banner-bgwhite.jpeg" alt="Logo"  />
            </Link>
            <p className="text-subtle text-sm">
              Your trusted partner in health and wellness, providing quality pharmaceutical care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-subtle hover:text-primary">Home</Link></li>
              <li><Link to="/medicines" className="text-subtle hover:text-primary">Medicines</Link></li>
              <li><a href="#" className="text-subtle hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-subtle hover:text-primary">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-text mb-4">Contact Us</h3>
            <ul className="space-y-3 text-subtle">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">DANIYAWA BAZAR<br />CHILKA-PAR, HILSA ROAD<br />PATNA-801304</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <a href="tel:+1234567890" className="hover:text-primary"><span className="text-muted-foreground">+91 6200255521</span></a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <a href="mailto:contact@peoplekindpharma.com" className="hover:text-primary">contact@peoplekindpharma.com</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
             <h3 className="text-lg font-semibold text-text mb-4">Follow Us</h3>
             <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-subtle hover:text-primary"><Facebook size={24} /></a>
                <a href="#" aria-label="Twitter" className="text-subtle hover:text-primary"><Twitter size={24} /></a>
                <a href="#" aria-label="Instagram" className="text-subtle hover:text-primary"><Instagram size={24} /></a>
             </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} People Kind Pharma. All Rights Reserved. Powered by <a target="_blank" href="https://www.ascendons.com/">Ascendons</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
