// src/components/providers/WebsiteProvider.tsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react';

export type Website = {
  id: number;
  name: string;
  slug: string;
};

type WebsiteContextType = {
  selectedWebsite: Website | null;
  setSelectedWebsite: (website: Website | null) => void;
};

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);

  useEffect(() => {
    const savedWebsite = localStorage.getItem('selectedWebsite');
    if (savedWebsite) {
      setSelectedWebsite(JSON.parse(savedWebsite));
    }
  }, []);

  const handleSetWebsite = (website: Website | null) => {
    setSelectedWebsite(website);
    if (website) {
      localStorage.setItem('selectedWebsite', JSON.stringify(website));
    } else {
      localStorage.removeItem('selectedWebsite');
    }
  };

  return (
    <WebsiteContext.Provider value={{ 
      selectedWebsite, 
      setSelectedWebsite: handleSetWebsite 
    }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within WebsiteProvider');
  }
  return context;
};