import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, PackageOpen, 
  Users, Star, Ticket, Megaphone, DollarSign, 
  Wallet, Bell, Store, Settings, LifeBuoy, FileText
} from 'lucide-react';

const mainLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
  { name: 'Analytics', icon: FileText, path: '/seller/analytics' },
  { name: 'Products', icon: PackageOpen, path: '/seller/products' },
  { name: 'Orders', icon: ShoppingBag, path: '/seller/orders' },
  { name: 'Customers', icon: Users, path: '/seller/customers' },
  { name: 'Reviews', icon: Star, path: '/seller/reviews' },
];

const marketingLinks = [
  { name: 'Coupons', icon: Ticket, path: '/seller/coupons' },
  { name: 'Marketing', icon: Megaphone, path: '/seller/marketing' },
];

const financeLinks = [
  { name: 'Revenue', icon: DollarSign, path: '/seller/revenue' },
  { name: 'Withdraw', icon: Wallet, path: '/seller/withdraw' },
];

const settingLinks = [
  { name: 'Notifications', icon: Bell, path: '/seller/notifications' },
  { name: 'Profile', icon: Store, path: '/seller/profile' },
  { name: 'Settings', icon: Settings, path: '/seller/settings' },
  { name: 'Support', icon: LifeBuoy, path: '/seller/support' },
];

export const SellerSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-[#076653]/30 hidden lg:flex flex-col z-40 overflow-y-auto custom-scrollbar">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 shrink-0 border-b border-white/5 sticky top-0 bg-neutral-950 z-10">
        <Link to="/seller/dashboard" className="text-2xl font-black text-white tracking-tight">
          Ecomm<span className="text-[#E3EF26]">Hub</span>
          <span className="text-xs ml-2 text-neutral-500 font-medium tracking-widest uppercase">Seller</span>
        </Link>
      </div>

      <div className="p-4 flex flex-col gap-8">
        
        {/* Main Section */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Main</span>
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#076653]/30 text-[#E3EF26]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Marketing */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Marketing</span>
          {marketingLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#076653]/30 text-[#E3EF26]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Finance */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Finance</span>
          {financeLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#076653]/30 text-[#E3EF26]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-1 mb-4">
          <span className="px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">System</span>
          {settingLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#076653]/30 text-[#E3EF26]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

      </div>
    </aside>
  );
};
