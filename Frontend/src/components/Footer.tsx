import React from 'react';
import { Globe, MessageCircle, Mail, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#06231D] border-t border-[#076653]/30 pt-16 pb-8 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight mb-4 inline-block">
              Ecomm<span className="text-[#E3EF26]">Hub</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              The premier destination for high-quality products from verified sellers globally. Secure, fast, and reliable.
            </p>
            <div className="flex items-center gap-4 text-neutral-400">
              <a href="#" className="hover:text-[#E3EF26] transition-colors"><Globe size={20} /></a>
              <a href="#" className="hover:text-[#E3EF26] transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-[#E3EF26] transition-colors"><Mail size={20} /></a>
              <a href="#" className="hover:text-[#E3EF26] transition-colors"><Share2 size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/deals" className="hover:text-white transition-colors">Daily Deals</Link></li>
              <li><Link to="/sellers" className="hover:text-white transition-colors">Popular Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Customer Service</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-[#076653]/30 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} EcommHub Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
