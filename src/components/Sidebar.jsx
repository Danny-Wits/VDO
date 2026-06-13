import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const sections = [
  { id: 'hero', label: '01 Intro' },
  { id: 'nodes', label: '02 Nodes' },
  { id: 'dust', label: '03 Grain' },
  { id: 'gallery', label: '04 Work' },
  { id: 'process', label: '05 Process' },
  { id: 'player', label: '06 Flow' },
  { id: 'contact', label: '07 Contact' },
]

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('hero')
  const navRef = useRef()

  useGSAP(() => {
    // Entrance animation for the sidebar
    gsap.from(navRef.current, {
      x: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 1.5 // Wait for Hero text to finish
    })

    // Setup ScrollTriggers for each section to update the active state
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: `#${sec.id}`,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(sec.id)
          }
        }
      })
    })
  }, [])

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav ref={navRef} className="fixed top-1/2 right-6 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-6 bg-dark/30 backdrop-blur-md p-6 rounded-[2rem] border border-accent/10">
      {sections.map((sec) => (
        <button
          key={sec.id}
          onClick={() => scrollTo(sec.id)}
          className="group relative flex items-center justify-end w-full text-right"
        >
          {/* Label (Hidden until hovered or active) */}
          <span 
            className={`mr-4 font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
              activeSection === sec.id ? 'text-primary opacity-100' : 'text-accent/50 opacity-0 group-hover:opacity-100 group-hover:text-accent'
            }`}
          >
            {sec.label}
          </span>
          
          {/* Dot Indicator */}
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === sec.id ? 'bg-primary scale-150 shadow-[0_0_10px_rgba(205,164,103,0.8)]' : 'bg-accent/30 group-hover:bg-accent'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
