import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MiniNavbar } from '../components/MiniNavbar';
import { Footer } from '../components/Footer';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative w-full bg-brand-darkest text-brand-lightest overflow-hidden">
      {/* Ambient Background Elements for Premium SaaS Look */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#076653]/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E3EF26]/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-1 w-full">
        <Navbar />
        <MiniNavbar />
        
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};
