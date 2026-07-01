import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`w-full flex gap-3 ${className}`}>
      {Icon && (
        <div className="flex flex-col justify-end">
          <div className="h-[56px] w-[56px] bg-[#0C342C] text-[#E3EF26] rounded-xl flex items-center justify-center border border-[#076653]/50 shadow-md">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <label className="text-sm font-medium text-neutral-300 ml-1 truncate">
          {label}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            className={`glass-input ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
            {...props}
          />
        </div>
        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 ml-1"
          >
            {error}
          </motion.span>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';
