import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import HeroCanvas from './components/HeroCanvas'
import StarryNodes from './components/StarryNodes'
import InteractiveDust from './components/InteractiveDust'
import ShowreelGallery from './components/ShowreelGallery'
import ProcessScroll from './components/ProcessScroll'
import StealthPlayer from './components/StealthPlayer'
import ContactForm from './components/ContactForm'
import Sidebar from './components/Sidebar'

gsap.registerPlugin(ScrollTrigger)
const title = "VISHESH".split("")

export default function App() {
  const containerRef = useRef(null)
  const heroTextRef = useRef(null)
  const bgImgRef = useRef(null)

  useGSAP(() => {
    // 1. Mouse Parallax on Background Image using quickSetter for performance
    const xSet = gsap.quickSetter(bgImgRef.current, "x", "px")
    const ySet = gsap.quickSetter(bgImgRef.current, "y", "px")

    let targetX = 0
    let targetY = 0

    // Native event listener to avoid React re-renders!
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      targetX = (clientX / innerWidth - 0.5) * -40
      targetY = (clientY / innerHeight - 0.5) * -40
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Smooth interpolation towards target mouse pos using GSAP ticker
    const tickerCallback = () => {
      const currentX = gsap.getProperty(bgImgRef.current, "x") || 0
      const currentY = gsap.getProperty(bgImgRef.current, "y") || 0

      xSet(currentX + (targetX - currentX) * 0.1)
      ySet(currentY + (targetY - currentY) * 0.1)
    }

    gsap.ticker.add(tickerCallback)

    // 2. Staggered Cinematic Title Reveal
    gsap.from('.hero-char', {
      y: 100,
      rotateX: -90,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "elastic.out(1, 0.5)",
      delay: 0.2
    })

    gsap.from('.hero-subtitle', {
      opacity: 0,
      duration: 2,
      delay: 1.5,
      ease: "power2.out"
    })

    gsap.from('.hero-scroll', {
      opacity: 0,
      duration: 2,
      delay: 2.5,
      ease: "power2.out"
    })

    // Continuous pulse for the scroll indicator line
    gsap.to('.hero-scroll-line', {
      y: 10,
      opacity: 1,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    })

    // 3. Global Scroll Parallax for Hero Text
    gsap.to(heroTextRef.current, {
      y: 200,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    // Cleanup listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      gsap.ticker.remove(tickerCallback)
    }

  }, { scope: containerRef })

  return (
    <main ref={containerRef} className="w-full min-h-screen bg-dark text-accent selection:bg-primary selection:text-white">

      {/* Custom Global Sidebar */}
      <Sidebar />

      {/* 1. Hero Canvas Section */}
      <section id="hero" className="relative w-full h-screen overflow-hidden">

        {/* Interactive Mouse Parallax Background */}
        <div ref={bgImgRef} className="absolute inset-0 z-0 scale-[1.05] will-change-transform">
          <img
            src={`${import.meta.env.BASE_URL}images/editing_suite_forest_1781372836042.png`}
            alt="Cinematic Editing Suite"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        </div>

        {/* 3D Overlay (Keyframe Swarm & Vignettes) */}
        <HeroCanvas />

        {/* Scroll Parallax Content (Text & Indicator) */}
        <div ref={heroTextRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
          {/* Staggered Cinematic Title Reveal */}
          <div className="flex space-x-2 md:space-x-4 drop-shadow-2xl [perspective:1000px]">
            {title.map((char, index) => (
              <span
                key={index}
                className="hero-char text-7xl md:text-[12rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-accent via-accent/80 to-primary/40 inline-block"
              >
                {char}
              </span>
            ))}
          </div>

          <p className="hero-subtitle mt-8 text-xl md:text-3xl font-sans tracking-[0.3em] text-primary uppercase drop-shadow-lg">
            Organic Cinematic Cuts
          </p>

          {/* Scroll Indicator */}
          <div className="hero-scroll absolute bottom-12 flex flex-col items-center gap-4">
            <span className="text-xs font-sans tracking-widest text-accent/50 uppercase">Explore Timeline</span>
            <div className="hero-scroll-line w-[2px] h-16 bg-gradient-to-b from-primary to-transparent opacity-30" />
          </div>
        </div>
      </section>

      {/* 2. Starry Nodes Section -> The Organic Node Tree */}
      <StarryNodes />

      {/* 3. Interactive Dust Section -> Cinematic Mist */}
      <InteractiveDust />

      {/* 4. Showreel Gallery (Physics Cards) */}
      <div id="gallery">
        <ShowreelGallery />
      </div>

      {/* 5. Sticky Scroll Process Section */}
      <div id="process">
        <ProcessScroll />
      </div>

      {/* 6. Stealth Course Player */}
      <section id="player" className="py-32 px-6 bg-gradient-to-b from-dark to-forest flex flex-col items-center relative z-10">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-accent mb-4">The Editing Flow</h2>
            <p className="text-accent/70 font-sans">Master the rhythm of high-end cinematic editing.</p>
          </div>
          <StealthPlayer url={`${import.meta.env.BASE_URL}video.mp4`} />
        </div>
      </section>

      {/* 7. Contact Form */}
      <div id="contact">
        <ContactForm />
      </div>
    </main>
  )
}
