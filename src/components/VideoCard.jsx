import React from 'react'

export default function VideoCard({ project }) {
  return (
    <div className="gallery-card group relative w-full aspect-video rounded-2xl cursor-pointer hover:scale-[1.02] hover:-translate-y-2 [&.active]:scale-[1.02] [&.active]:-translate-y-2 transition-transform duration-500 ease-out">
      {/* Soft shadow instead of harsh neon glow */}
      <div 
        className="absolute -inset-4 rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 group-[.active]:opacity-40 transition duration-700 pointer-events-none"
        style={{ backgroundColor: project.color }}
      ></div>
      
      {/* Card Content - Glassmorphism & Image */}
      <div className="relative w-full h-full bg-forest/40 backdrop-blur-md rounded-2xl overflow-hidden border border-accent/10 flex items-center justify-center">
        
        {/* The Image Artifact */}
        {project.image && (
          <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 group-[.active]:scale-105 group-[.active]:opacity-100 transition-all duration-700 z-0 mix-blend-luminosity group-hover:mix-blend-normal group-[.active]:mix-blend-normal pointer-events-none" />
        )}

        {/* Subtle texture/gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-dark/90 to-transparent z-10 pointer-events-none"></div>
        
        {/* Soft framing brackets appearing on hover */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/0 group-hover:border-accent/50 group-[.active]:border-accent/50 transition-colors duration-500 z-20 pointer-events-none"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/0 group-hover:border-accent/50 group-[.active]:border-accent/50 transition-colors duration-500 z-20 pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/0 group-hover:border-accent/50 group-[.active]:border-accent/50 transition-colors duration-500 z-20 pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/0 group-hover:border-accent/50 group-[.active]:border-accent/50 transition-colors duration-500 z-20 pointer-events-none"></div>

        <div 
          className="w-32 h-32 rounded-full blur-[60px] opacity-30 mix-blend-screen z-10 pointer-events-none"
          style={{ backgroundColor: project.color }}
        ></div>
        
        {/* Overlay info */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-0 group-hover:opacity-100 group-[.active]:opacity-100 transition duration-500 z-30 pointer-events-none">
          <p className="text-sm font-bold tracking-widest uppercase mb-2" style={{ color: project.color }}>
            {project.category}
          </p>
          <h3 className="text-4xl font-display font-black text-accent drop-shadow-xl">{project.title}</h3>
        </div>
      </div>
    </div>
  )
}
