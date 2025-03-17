"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'

const Loading = () => {
  // Path to your logo in the public directory
  const logoSrc = "/loader.gif";
  
  useEffect(() => {
    // Add the animation for dots
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes dots {
        0%, 20% {
          content: '.';
        }
        40% {
          content: '..';
        }
        60%, 80% {
          content: '...';
        }
        100% {
          content: '';
        }
      }
      .loading-dots::after {
        content: '';
        animation: dots 1.5s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white">
      <div className="flex flex-col items-center">
        {/* Logo with Next.js Image component */}
        <div className="w-48 h-48 flex items-center justify-center relative">
          <Image 
            src={logoSrc}
            alt="Loading" 
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            priority
            className="object-contain"
          />
        </div>
        
        {/* Animated Dots */}
        <div className="mt-6">
          <p className="text-lg font-medium text-blue-600 loading-dots"></p>
        </div>
      </div>
    </div>
  )
}

export default Loading