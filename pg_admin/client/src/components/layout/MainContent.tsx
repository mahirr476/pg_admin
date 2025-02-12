// src/components/layout/MainContent.tsx
"use client"

import { useSidebar } from '@/contexts/SidebarContext';
import { motion } from 'framer-motion';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useSidebar();

  return (
    <motion.main
      className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'ml-64' : 'ml-20'}
        pt-16
      `}
    >
      <div className="p-6">
        {children}
      </div>
    </motion.main>
  );
}