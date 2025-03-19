// import AboutSection from '@/components/paragon/about/about'
// import AboutBoard from '@/components/paragon/about/aboutBoard'
// import React from 'react'

// const About = () => {
//   return (
//     <div>
//       <AboutSection/>
//       <AboutBoard/>
//     </div>
//   )
// }

// export default About




import AboutSection from '@/components/paragon/about/about'
import AboutBoard from '@/components/paragon/about/aboutBoard'
import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header space */}
      <div className="py-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">About Us</h1>
          <p className="text-blue-100 text-center mt-2 max-w-2xl mx-auto">
            Learn more about our organization and board information
          </p>
        </div>
      </div>
      
      {/* Main content with proper spacing */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* About Section Component with container */}
        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <AboutSection />
        </section>
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm text-gray-500">Board Information</span>
          </div>
        </div>
        
        {/* Board Component */}
        <section>
          <AboutBoard />
        </section>
      </div>
      
      {/* Footer space */}
      <div className="mt-16"></div>
    </div>
  )
}

export default About