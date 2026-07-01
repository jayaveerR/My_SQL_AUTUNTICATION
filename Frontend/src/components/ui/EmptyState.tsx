import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../../ui/Button';

interface EmptyStateProps { 
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center w-full"
    >
      <div className="w-24 h-24 mb-8 bg-[#076653]/10 text-[#E3EF26] rounded-full flex items-center justify-center border-2 border-[#076653]/30 shadow-[0_0_30px_rgba(7,102,83,0.15)] relative">
        <Icon size={40} className="relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E3EF26]/10 to-transparent rounded-full" />
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
      <p className="text-neutral-400 text-lg max-w-lg mb-8 leading-relaxed">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="!px-8 !py-4 text-base font-semibold shadow-[0_0_20px_rgba(227,239,38,0.2)]">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
