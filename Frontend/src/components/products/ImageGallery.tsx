import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '../../types/product';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-neutral-900 rounded-3xl flex items-center justify-center border border-[#076653]/20">
        <span className="text-neutral-500">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Image */}
      <div className="w-full aspect-square md:aspect-[4/5] bg-black rounded-3xl overflow-hidden border border-[#076653]/30 relative group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={currentImage.url}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </AnimatePresence>
        
        {/* Navigation Overlays (Optional for desktop, good for mobile) */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#E3EF26] hover:text-black transition-colors"
            >
              &larr;
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#E3EF26] hover:text-black transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                currentIndex === idx ? 'border-[#E3EF26] scale-105 shadow-[0_0_15px_rgba(227,239,38,0.2)]' : 'border-transparent hover:border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={img.url} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
