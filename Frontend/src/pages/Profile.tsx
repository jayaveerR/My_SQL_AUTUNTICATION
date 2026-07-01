import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Mail, Calendar, MapPin, Laptop, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { slideUp, staggerContainer } from '../ux/transitions';

const ProfileInfoCard: React.FC<{ label: string, value: string, icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <motion.div variants={slideUp} className="glass-panel p-5 flex items-start gap-4">
    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-neutral-400">{label}</span>
      <span className="text-white font-medium mt-1 truncate">{value}</span>
    </div>
  </motion.div>
);

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10"
    >
      <motion.div variants={slideUp} className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Your Profile</h2>
        <p className="text-neutral-400 mt-2">Manage your account details and view security analytics.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <ProfileInfoCard label="First Name" value={user?.firstName || 'Unknown'} icon={User} />
        <ProfileInfoCard label="Last Name" value={user?.lastName || 'Unknown'} icon={User} />
        <ProfileInfoCard label="Email Address" value={user?.email || 'Unknown'} icon={Mail} />
        <ProfileInfoCard 
          label="Account Status" 
          value="Verified Member" 
          icon={ShieldCheck} 
        />
        <ProfileInfoCard 
          label="Joined Date" 
          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'} 
          icon={Calendar} 
        />
      </div>

      <motion.div variants={slideUp} className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Security Tracking
        </h3>
        <p className="text-neutral-400 text-sm mt-1">Data from your most recent login session.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfoCard label="IP Address" value={user?.lastLoginIp || 'Unknown'} icon={MapPin} />
        <ProfileInfoCard label="Location" value={user?.lastLoginLocation || 'Unknown'} icon={MapPin} />
        <motion.div variants={slideUp} className="glass-panel p-5 flex items-start gap-4 md:col-span-2">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-neutral-400">Device Info</span>
            <span className="text-white font-medium mt-1 truncate text-xs sm:text-sm">{user?.lastLoginDevice || 'Unknown'}</span>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default Profile;
