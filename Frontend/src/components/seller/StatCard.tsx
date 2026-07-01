import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.FC<any>;
  trend?: number; // e.g. 5.4 for +5.4%, or -2.1 for -2.1%
  trendLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendLabel = 'vs last month' }) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-neutral-400">
          <Icon size={24} />
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        
        {trend !== undefined && (
          <p className="text-xs text-neutral-600 mt-3">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
};
