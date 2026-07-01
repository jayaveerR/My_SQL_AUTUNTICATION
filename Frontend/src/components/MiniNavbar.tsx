import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Books',
  'Groceries',
  'Toys',
  'Automotive'
];

export const MiniNavbar: React.FC = () => {
  return (
    <div className="w-full bg-[#06231D] border-b border-[#076653]/30 overflow-x-auto scrollbar-hide relative z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center gap-6 whitespace-nowrap py-3">
        {categories.map((category, index) => (
          <motion.a
            key={category}
            href={`/categories?c=${category.toLowerCase()}`}
            className={`text-sm font-medium transition-colors ${
              index === 0 ? 'text-[#E3EF26]' : 'text-neutral-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.a>
        ))}
      </div>
    </div>
  );
};
