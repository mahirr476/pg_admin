import AboutSection from '@/components/paragon/about/about-us/about'
import AboutBoard from '@/components/paragon/about/about-us/aboutBoard'
import BoardDirectors from '@/components/paragon/about/about-us/aboutLeaderShip'
import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header with subtle pattern overlay */}
      <div className="relative py-16 bg-gradient-to-r from-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              About Us
            </h1>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Learn about our mission, vision, and the team behind our organization's success
            </p>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-gray-50">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Main content with improved spacing and containers */}
      <div className="container mx-auto px-4 py-12">
        {/* About Section with enhanced styling */}
        <section className="mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
              <AboutSection />
            </div>
          </div>
        </section>
        
        {/* Stylish divider with icon */}
        <div className="relative max-w-5xl mx-auto my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md">
              Our Leadership
            </span>
          </div>
        </div>
        
        {/* Board Components with container styling */}
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Board of Directors */}
          <section className="bg-white rounded-2xl shadow-xl p-2 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="p-4">
              <AboutBoard />
            </div>
          </section>
          
          {/* Leadership Team */}
          <section className="bg-white rounded-2xl shadow-xl p-2 overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="p-4">
              <BoardDirectors />
            </div>
          </section>
        </div>
      </div>
      
      {/* Decorative bottom wave */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 mt-24">
        <div className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-gray-100 transform rotate-180">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-6 py-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Journey</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Together, we're building a brighter future for our community and beyond.
          </p>
          <button className="bg-white text-indigo-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default About