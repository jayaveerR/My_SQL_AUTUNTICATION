import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Shirt, Sofa, Dumbbell } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Laptop, count: '1.2k+ Products' },
  { name: 'Fashion', icon: Shirt, count: '850+ Products' },
  { name: 'Home & Garden', icon: Sofa, count: '640+ Products' },
  { name: 'Sports', icon: Dumbbell, count: '420+ Products' },
];

export const TrendingCategories: React.FC = () => {
  return (
    <section className="py-20 bg-[#06231D] relative z-10 border-y border-[#076653]/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Trending Categories</h2>
            <p className="text-neutral-400 text-lg">Explore our most popular collections right now.</p>
          </div>
          <a href="/categories" className="hidden md:inline-flex text-[#E3EF26] font-semibold hover:underline">
            View All Categories &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.a
              href={`/categories?c=${cat.name.toLowerCase()}`}
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] flex flex-col justify-end p-6 border border-[#076653]/30 bg-black/20"
            >
              {/* Decorative Background Icon */}
              <cat.icon size={120} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-[#E3EF26]/10 transition-colors duration-500 transform group-hover:-rotate-12" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4 group-hover:bg-[#E3EF26] group-hover:text-black transition-colors duration-300">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-[#E3EF26] text-sm font-medium">{cat.count}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
