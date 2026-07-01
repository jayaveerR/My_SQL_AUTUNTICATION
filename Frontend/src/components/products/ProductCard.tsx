import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const defaultImage = product.images.find(img => img.isDefault)?.url || product.images[0]?.url || 'https://via.placeholder.com/400';
  const price = Number(product.price).toFixed(2);
  const rating = Number(product.averageRating).toFixed(1);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative flex flex-col bg-neutral-900/40 rounded-2xl overflow-hidden border border-[#076653]/30 hover:border-[#E3EF26]/50 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
        <Link to={`/product/${product.slug}`}>
          <img 
            src={defaultImage} 
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-[#E3EF26] text-[10px] font-bold tracking-wider uppercase rounded-md border border-[#E3EF26]/20">
            {product.category?.name}
          </span>
          {product.stock < 10 && product.stock > 0 && (
            <span className="px-2 py-1 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-black/80 transition-colors z-10 border border-white/10">
          <Heart size={16} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link to={`/product/${product.slug}`} className="flex-1">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#E3EF26] transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-[#076653]/30 px-1.5 py-0.5 rounded text-[#E3EF26]">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
        </div>

        {product.brand && (
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-2">
            {product.brand}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-white">${price}</span>
            <span className="text-xs text-neutral-400 line-through">${(Number(price) * 1.2).toFixed(2)}</span>
          </div>
          
          <Link 
            to={`/product/${product.slug}`}
            className="w-10 h-10 rounded-full bg-[#E3EF26] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(227,239,38,0.3)]"
          >
            <span className="font-black text-xl leading-none">+</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
