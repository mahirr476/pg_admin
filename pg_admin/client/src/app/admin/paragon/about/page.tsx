import AboutUs1 from '@/components/paragon/about/aboutUs1'
import AboutUs2 from '@/components/paragon/about/aboutUs2'
import AboutUs3 from '@/components/paragon/about/aboutUs3'
import AboutUs4 from '@/components/paragon/about/aboutUs4'
import AboutUs5 from '@/components/paragon/about/aboutUs5'
import AboutUs6 from '@/components/paragon/about/aboutUs6'
import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto px-4 space-y-16 py-16">
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
  )
}

export default About