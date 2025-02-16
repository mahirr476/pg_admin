// page.tsx
import FirstSection from '@/components/paragon/home/firstSection';
import FifthSection from '@/components/paragon/home/fiveSection';
import FourthSection from '@/components/paragon/home/fourSection';
import SecondSection from '@/components/paragon/home/secondSection';
import SixthSection from '@/components/paragon/home/sixSection';
import ThirdSection from '@/components/paragon/home/thirdSection';
import React from 'react';

export default function HomePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto py-12">
      <div className="space-y-16"> {/* Added container with consistent vertical spacing */}
        <div className="border-b pb-16">
          <FirstSection/>
        </div>
        
        <div className="border-b pb-16">
          <SecondSection/>
        </div>
        
        <div className="border-b pb-16">
          <ThirdSection/>
        </div>
        
        <div className="border-b pb-16">
          <FourthSection/>
        </div>
        
        <div className="border-b pb-16">
          <FifthSection/>
        </div>
        
        <div>
          <SixthSection/>
        </div>
      </div>
    </div>
  );
}