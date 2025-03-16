'use client';

import HeroSection from '@/components/paragon/home/heroSection';
import ImpactSection from '@/components/paragon/home/impactSection';
import React from 'react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <HeroSection />
      <ImpactSection />
    </div>
  );
};

export default Home;