import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, Package, 
  ShoppingBag, ShieldAlert, Activity, Settings, 
  Database, FileText
} from 'lucide-react';

const mainLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'System Logs', icon: Activity, path: '/admin/logs' },
];

const entityLinks = [
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'Sellers', icon: Store, path: '/admin/sellers' },
  { name: 'Products', icon: Package, path: '/admin/products' },
  { name: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
];

const moderationLinks = [
  { name: 'Approvals', icon: ShieldAlert, path: '/admin/approvals' },
  { name: 'Reports', icon: FileText, path: '/admin/reports' },
];

const systemLinks = [
  { name: 'Database', icon: Database, path: '/admin/database' },
  { name: 'Platform Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-red-500/20 hidden lg:flex flex-col z-40 overflow-y-auto custom-scrollbar">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 shrink-0 border-b border-white/5 sticky top-0 bg-neutral-950 z-10">
        <Link to="/admin/dashboard" className="text-2xl font-black text-white tracking-tight">
          Ecomm<span className="text-red-500">Hub</span>
          <span className="text-xs ml-2 text-neutral-500 font-medium tracking-widest uppercase">Admin</span>
        </Link>
      </div>

      <div className="p-4 flex flex-col gap-8">
        
        {/* Main Section */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2">Platform</span>
          {mainLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Entities */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2">Entities</span>
          {entityLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Moderation */}
        <div className="flex flex-col gap-1">
          <span className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2">Moderation</span>
          {moderationLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* System */}
        <div className="flex flex-col gap-1 mb-4">
          <span className="px-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2">System</span>
          {systemLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-500/20 text-red-400' 
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
