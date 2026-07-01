import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-4 border-[#076653]/20 rounded-2xl flex flex-col gap-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-white/5 rounded-xl border border-white/5" />
      
      {/* Details Skeleton */}
      <div className="flex flex-col gap-3 mt-2 px-1">
        <div className="w-1/3 h-3 bg-white/10 rounded-full" />
        <div className="w-3/4 h-5 bg-white/20 rounded-full" />
        
        <div className="flex items-center justify-between mt-4">
          <div className="w-1/4 h-6 bg-[#E3EF26]/20 rounded-full" />
          <div className="w-10 h-10 bg-[#076653]/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
