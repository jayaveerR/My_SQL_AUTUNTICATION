import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';
import { slideUp } from '../../ux/transitions';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const platformData = [
  { name: 'Mon', active: 1200 },
  { name: 'Tue', active: 2100 },
  { name: 'Wed', active: 1800 },
  { name: 'Thu', active: 3400 },
  { name: 'Fri', active: 2800 },
  { name: 'Sat', active: 4900 },
  { name: 'Sun', active: 4300 },
];

const pendingApprovals = [
  { id: 'APP-092', store: 'Tech Haven', owner: 'John Doe', date: '2 hours ago', status: 'Pending Review' },
  { id: 'APP-093', store: 'Fashion Nova', owner: 'Jane Smith', date: '5 hours ago', status: 'Action Required' },
];

const AdminDashboard: React.FC = () => {
  return (
    <motion.div 
      variants={slideUp}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            System Overview <ShieldAlert className="text-red-500" size={28} />
          </h1>
          <p className="text-neutral-400 mt-1">Platform metrics and administrative controls.</p>
        </div>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <Activity size={18} />
          System Health
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <motion.div whileHover={{ y: -4 }} className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white mb-1">12,453</h3>
          <p className="text-sm font-medium text-neutral-500">Total Active Users</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <FileCheck size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-400">
              2 Action Required
            </span>
          </div>
          <h3 className="text-3xl font-black text-white mb-1">2</h3>
          <p className="text-sm font-medium text-neutral-500">Pending Seller Approvals</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
              <Activity size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
              Stable
            </span>
          </div>
          <h3 className="text-3xl font-black text-white mb-1">99.9%</h3>
          <p className="text-sm font-medium text-neutral-500">Platform Uptime</p>
        </motion.div>
        
      </div>

      {/* Traffic Chart & Approvals Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Users Chart */}
        <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Platform Traffic</h2>
              <p className="text-sm text-neutral-400">Concurrent active connections</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="active" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Required Board */}
        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Action Required</h2>
            <p className="text-sm text-neutral-400">Manual review pipeline</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3">
            {pendingApprovals.map((app, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-red-500/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-neutral-500">{app.id}</span>
                  <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-red-400 transition-colors" />
                </div>
                <h4 className="font-bold text-white text-sm">{app.store}</h4>
                <p className="text-xs text-neutral-400 mt-1">{app.owner}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] text-neutral-500">{app.date}</span>
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default AdminDashboard;
