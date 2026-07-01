import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { slideUp } from '../ux/transitions';
import { PackageX } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { FeatureCards } from '../components/home/FeatureCards';
import { TrendingCategories } from '../components/home/TrendingCategories';
import { Newsletter } from '../components/home/Newsletter';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductSkeleton } from '../components/ui/ProductSkeleton';

const CustomerDashboard: React.FC = () => {
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Simulate API fetch delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingProducts(false);
    }, 2000); // 2 second delay to show skeletons
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col"
    >
      <Hero />
      <FeatureCards />
      <TrendingCategories />
      
      {/* Featured Products Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10 w-full relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured Products</h2>
            <p className="text-neutral-400 text-lg">Hand-picked selections from top-rated sellers.</p>
          </div>
        </div>
        
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="glass-panel border-[#076653]/30 min-h-[400px] flex items-center justify-center">
            <EmptyState 
              icon={PackageX}
              title="No Products Available Yet"
              description="Our sellers are working hard to stock their shelves with premium products. Check back soon for the grand opening!"
              actionLabel="Refresh Products"
              onAction={() => window.location.reload()}
            />
          </div>
        )}
      </section>

      <Newsletter />
    </motion.div>
  );
};

export default CustomerDashboard;
