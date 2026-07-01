import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export const Newsletter: React.FC = () => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-16 border-[#076653]/30 text-center relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#E3EF26]/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Join Our Newsletter</h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Get the latest updates on new sellers, exclusive deals, and premium products delivered straight to your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row items-end justify-center gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                label="" 
                type="email" 
                placeholder="Enter your email address" 
                required 
                className="w-full flex-1"
              />
              <Button type="submit" className="!px-8 !h-[56px] font-bold group shrink-0">
                Subscribe
                <Send size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
            <p className="text-xs text-neutral-500 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
