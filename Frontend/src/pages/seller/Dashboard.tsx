import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { StatCard } from '../../components/seller/StatCard';
import { slideUp } from '../../ux/transitions';

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 6890 },
  { name: 'Sat', revenue: 8390 },
  { name: 'Sun', revenue: 7490 },
];

const salesData = [
  { name: 'Electronics', sales: 400 },
  { name: 'Clothing', sales: 300 },
  { name: 'Home', sales: 200 },
  { name: 'Books', sales: 150 },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Alex Johnson', date: 'Today, 2:45 PM', amount: '$348.00', status: 'Processing' },
  { id: '#ORD-002', customer: 'Maria Garcia', date: 'Today, 1:15 PM', amount: '$1,999.00', status: 'Shipped' },
  { id: '#ORD-003', customer: 'James Smith', date: 'Yesterday', amount: '$89.99', status: 'Delivered' },
  { id: '#ORD-004', customer: 'Linda Brown', date: 'Yesterday', amount: '$495.00', status: 'Processing' },
];

const Dashboard: React.FC = () => {
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
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-400 mt-1">Welcome back. Here's what's happening with your store today.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#E3EF26] hover:bg-[#c8d41e] text-black px-6 py-2.5 rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(227,239,38,0.2)]">
          <Package size={18} />
          Add Product
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231.89" icon={DollarSign} trend={12.5} />
        <StatCard title="Total Orders" value="1,204" icon={ShoppingBag} trend={8.2} />
        <StatCard title="Total Products" value="84" icon={Package} trend={0} />
        <StatCard title="Total Customers" value="892" icon={Users} trend={-2.4} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
              <p className="text-sm text-neutral-400">Weekly earnings breakdown</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E3EF26" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E3EF26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#E3EF26' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E3EF26" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Sales by Category</h2>
            <p className="text-sm text-neutral-400">Top performing segments</p>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="sales" fill="#076653" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-neutral-900/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            <p className="text-sm text-neutral-400">Your latest transactions</p>
          </div>
          <button className="text-sm text-[#E3EF26] hover:underline font-medium flex items-center gap-1">
            View All <ArrowUpRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-xs uppercase tracking-wider text-neutral-500 font-bold border-b border-white/5">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 pl-6 font-medium text-white">{order.id}</td>
                  <td className="p-4 text-neutral-300">{order.customer}</td>
                  <td className="p-4 text-neutral-400">{order.date}</td>
                  <td className="p-4 font-bold text-white">{order.amount}</td>
                  <td className="p-4 pr-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-purple-500/10 text-purple-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
};

export default Dashboard;
