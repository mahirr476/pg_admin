
import MilestonesHero from '@/components/paragon/milestones/milestones-hero'
import MilestonesMain from '@/components/paragon/milestones/milestones-main'
import React from 'react'

const Milestone = () => {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <section className="bg-white rounded-lg shadow-sm p-6">
        <MilestonesHero/>
      </section>
      
      <section className="bg-slate-50 rounded-lg shadow-sm p-6">
        <MilestonesMain/>
      </section>
    </div>
  )
}

export default Milestone