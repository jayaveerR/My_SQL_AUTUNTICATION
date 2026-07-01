import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden py-20 text-center">
      {/* Abstract Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#06231D] via-brand-darkest to-[#0C342C] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E3EF26]/5 rounded-full blur-[120px] z-0 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full px-6 md:px-10 flex flex-col items-center relative z-10">
        
        {/* Centered Text & Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#076653]/20 border border-[#076653]/40 w-fit">
            <Sparkles size={16} className="text-[#E3EF26]" />
            <span className="text-sm font-semibold text-white tracking-wide">The New Standard of eCommerce</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E3EF26] to-[#076653]">Premium</span><br />
            Products Globally.
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed">
            Shop exclusive items from verified top-tier sellers around the world. Secure payments, fast shipping, and guaranteed quality.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Button className="!px-8 !py-4 text-lg font-bold shadow-[0_0_20px_rgba(227,239,38,0.2)] group">
              Start Shopping
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button variant="ghost" className="!px-8 !py-4 text-lg font-bold border border-white/20 hover:bg-white/5">
              Become a Seller
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
