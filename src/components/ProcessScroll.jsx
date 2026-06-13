import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger)

export default function ProcessScroll() {
  const containerRef = useRef(null)

  useGSAP(() => {
    // Create the master timeline linked to the scroll position
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Pin for 3000px of vertical scroll
        scrub: 1,      // Smooth scrubbing with 1s lag
        pin: true,     // Lock the container in place
        anticipatePin: 1
      }
    })

    // Timeline Sequence:
    
    // Hold Phase 1 for a brief moment
    tl.to({}, { duration: 0.5 })
    tl.to('.timeline-fill', { scaleY: 0.1, duration: 0.1, ease: "none" }, 0)

    // Transition: Phase 1 Out -> Phase 2 In
    tl.to('.phase1', { opacity: 0, y: -50, duration: 1, ease: "power1.inOut" }, "phase1Out")
      .to('.img1', { opacity: 0, duration: 1, ease: "power1.inOut" }, "phase1Out")
      .to('.timeline-fill', { scaleY: 0.5, duration: 1, ease: "none" }, "phase1Out")
      .to('.phase2', { opacity: 1, y: 0, duration: 1, ease: "power1.inOut" }, "phase1Out+=0.2")
      .to('.img2', { opacity: 1, duration: 1, ease: "power1.inOut" }, "phase1Out+=0.2")

    // Hold Phase 2 for reading
    tl.to({}, { duration: 0.8 })

    // Transition: Phase 2 Out -> Phase 3 In
    tl.to('.phase2', { opacity: 0, y: -50, duration: 1, ease: "power1.inOut" }, "phase2Out")
      .to('.img2', { opacity: 0, duration: 1, ease: "power1.inOut" }, "phase2Out")
      .to('.timeline-fill', { scaleY: 1, duration: 1, ease: "none" }, "phase2Out")
      .to('.phase3', { opacity: 1, y: 0, duration: 1, ease: "power1.inOut" }, "phase2Out+=0.2")
      .to('.img3', { opacity: 1, duration: 1, ease: "power1.inOut" }, "phase2Out+=0.2")

    // Hold Phase 3 at the very end
    tl.to({}, { duration: 0.5 })

  }, { scope: containerRef })

  return (
    // Instead of h-[300vh], GSAP ScrollTrigger handles the pinning and padding automatically.
    // We just need a h-screen container.
    <section ref={containerRef} className="relative w-full h-screen bg-dark z-20 flex items-center justify-center overflow-hidden">
        
      {/* Background images that crossfade */}
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/timber_falls_1781372030850.png`} className="img1 absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-20" />
        <img src={`${import.meta.env.BASE_URL}images/whispering_pines_1781372044772.png`} className="img2 absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-0" />
        <img src={`${import.meta.env.BASE_URL}images/deep_roots_1781372057215.png`} className="img3 absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-0" />
        <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm pointer-events-none"></div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Images */}
        <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-accent/10">
          <img src={`${import.meta.env.BASE_URL}images/timber_falls_1781372030850.png`} className="img1 absolute inset-0 w-full h-full object-cover" />
          <img src={`${import.meta.env.BASE_URL}images/whispering_pines_1781372044772.png`} className="img2 absolute inset-0 w-full h-full object-cover opacity-0" />
          <img src={`${import.meta.env.BASE_URL}images/deep_roots_1781372057215.png`} className="img3 absolute inset-0 w-full h-full object-cover opacity-0" />
        </div>

        {/* Right Side: Text Container */}
        <div className="relative min-h-[400px] md:h-96 flex flex-col justify-center bg-dark/60 backdrop-blur-xl p-8 md:p-12 md:pl-20 rounded-[2rem] border border-accent/10 shadow-2xl overflow-hidden">
          
          {/* Visual Timeline Progress Bar */}
          <div className="absolute left-6 md:left-10 top-12 bottom-12 w-1 bg-accent/10 rounded-full overflow-hidden flex flex-col justify-between">
            {/* Dots for phases */}
            <div className="w-3 h-3 bg-accent rounded-full -ml-1 z-10 shadow-[0_0_10px_rgba(205,164,103,0.5)]"></div>
            <div className="w-2 h-2 bg-accent/50 rounded-full -ml-[2px] z-10"></div>
            <div className="w-2 h-2 bg-accent/50 rounded-full -ml-[2px] z-10"></div>
            
            {/* Filling bar */}
            <div className="timeline-fill absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary to-wood-500 origin-top scale-y-0 z-0"></div>
          </div>

          {/* Phase 1 */}
          <div className="phase1 absolute inset-0 p-8 md:p-12 md:pl-24 flex flex-col justify-center pointer-events-none opacity-100 translate-y-0">
            <h3 className="text-sm font-sans tracking-widest text-primary uppercase mb-2 drop-shadow-md">Phase 01</h3>
            <h2 className="text-5xl md:text-7xl font-display font-black text-accent mb-6 drop-shadow-2xl">The Cut</h2>
            <p className="text-xl text-accent/90 font-sans leading-relaxed drop-shadow-lg">
              Finding the story in the raw footage. We sculpt the timeline organically, looking for the natural rhythm of the scene before any effects are applied.
            </p>
          </div>

          {/* Phase 2 */}
          {/* Note: Initial CSS state matches GSAP starting targets (opacity: 0, translate-y: 50px) */}
          <div className="phase2 absolute inset-0 p-8 md:p-12 md:pl-24 flex flex-col justify-center pointer-events-none opacity-0 translate-y-[50px]">
            <h3 className="text-sm font-sans tracking-widest text-primary uppercase mb-2 drop-shadow-md">Phase 02</h3>
            <h2 className="text-5xl md:text-7xl font-display font-black text-accent mb-6 drop-shadow-2xl">The Color</h2>
            <p className="text-xl text-accent/90 font-sans leading-relaxed drop-shadow-lg">
              Breathing life into the shadows. We build complex node trees to pull out rich, earthy tones, ensuring every frame feels like a painting.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="phase3 absolute inset-0 p-8 md:p-12 md:pl-24 flex flex-col justify-center pointer-events-none opacity-0 translate-y-[50px]">
            <h3 className="text-sm font-sans tracking-widest text-primary uppercase mb-2 drop-shadow-md">Phase 03</h3>
            <h2 className="text-5xl md:text-7xl font-display font-black text-accent mb-6 drop-shadow-2xl">The Render</h2>
            <p className="text-xl text-accent/90 font-sans leading-relaxed drop-shadow-lg">
              The final polish. Adding cinematic film grain, subtle lens breathing, and atmospheric mist to deliver a masterpiece ready for the big screen.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
