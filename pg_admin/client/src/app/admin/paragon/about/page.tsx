import AboutUs1 from '@/components/paragon/about/aboutUs1'
import AboutUs2 from '@/components/paragon/about/aboutUs2'
import AboutUs3 from '@/components/paragon/about/aboutUs3'
import AboutUs4 from '@/components/paragon/about/aboutUs4'
import AboutUs5 from '@/components/paragon/about/aboutUs5'
import AboutUs6 from '@/components/paragon/about/aboutUs6'
import AboutCSR from '@/components/paragon/about/csr1'
import AboutCSR2 from '@/components/paragon/about/csr2'
import AboutCSR3 from '@/components/paragon/about/csr3'
import AboutCSR4 from '@/components/paragon/about/csr4'
import AboutCSR5 from '@/components/paragon/about/csr5'
import AboutCSR6 from '@/components/paragon/about/csr6'
import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* AboutUs Section */}
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-center mb-16 text-gray-800">About US</h1>
        
        <div className="space-y-16">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutUs1/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutUs2/>
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutUs3/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutUs4/>
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutUs5/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutUs6/>
          </section>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-16"></div>

      {/* CSR Section */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">CSR Page</h2>
        
        <div className="space-y-16">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutCSR/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutCSR2/>
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutCSR3/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutCSR4/>
          </section>
          
          <section className="bg-white rounded-lg shadow-sm p-6">
            <AboutCSR5/>
          </section>
          
          <section className="bg-slate-50 rounded-lg shadow-sm p-6">
            <AboutCSR6/>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About