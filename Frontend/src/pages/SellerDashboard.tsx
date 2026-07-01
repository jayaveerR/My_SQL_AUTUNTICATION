import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Store, TrendingUp, PackageSearch } from 'lucide-react';
import { slideUp } from '../ux/transitions';
import { Button } from '../ui/Button';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Hardcoded for now. Will be fetched from backend later.
  const hasStore = false; 

  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col p-10 md:p-16 max-w-7xl mx-auto w-full"
    >
      <div className="glass-panel p-10 md:p-16 w-full mb-10 border-brand-emerald/30">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Seller Portal
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl">
          Manage your products, track sales, and grow your business on EcommHub.
        </p>
      </div>

      {!hasStore ? (
        <div className="glass-panel p-16 text-center flex flex-col items-center">
          <Store size={64} className="text-brand-lime mb-6" />
          <h2 className="text-3xl font-bold mb-4">Become a Seller</h2>
          <p className="text-neutral-400 text-lg max-w-2xl mb-8">
            You don't have an active seller profile yet. Apply now to start selling your products to thousands of customers.
          </p>
          <Button variant="primary" className="!px-10 !py-4 text-lg">
            Apply Now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 flex items-center gap-6 border-brand-emerald/20">
            <div className="p-4 bg-brand-emerald/20 rounded-2xl text-brand-lime">
              <TrendingUp size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">$0.00</h3>
              <p className="text-neutral-400 font-medium">Total Sales</p>
            </div>
          </div>
          
          <div className="glass-panel p-8 flex items-center gap-6 border-brand-emerald/20">
            <div className="p-4 bg-brand-emerald/20 rounded-2xl text-brand-lime">
              <PackageSearch size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-neutral-400 font-medium">Active Products</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SellerDashboard;
