import React from 'react';
import { motion } from 'framer-motion';

export const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg', text?: string }> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-400 font-medium text-sm animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
