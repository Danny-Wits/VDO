import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import VideoCard from './VideoCard'

gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER_PROJECTS = [
  { id: 1, title: 'TIMBER FALLS', category: 'Narrative', color: '#8b5a2b', image: '/images/timber_falls_1781372030850.png' }, // Oak
  { id: 2, title: 'WHISPERING PINES', category: 'Documentary', color: '#1c3826', image: '/images/whispering_pines_1781372044772.png' }, // Moss
  { id: 3, title: 'AUTUMN GLOW', category: 'Commercial', color: '#f4ecd8', image: '/images/autumn_glow_1781372069760.png' }, // Beige
  { id: 4, title: 'DEEP ROOTS', category: 'Short Film', color: '#5c4033', image: '/images/deep_roots_1781372057215.png' } // Dark Brown
]

export default function ShowreelGallery() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    // Background parallax scrub
    gsap.to('.gallery-bg', {
      y: '20%',
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    // Text Header Entrance
    gsap.from('.gallery-header', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })

    // Staggered Video Cards Entrance
    gsap.from('.gallery-card', {
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    })

    // Auto-Highlight feature when section is in view
    const cards = document.querySelectorAll('.gallery-card')
    let currentIndex = 0
    let highlightInterval

    const highlightNext = () => {
      cards.forEach(c => c.classList.remove('active'))
      if (cards.length > 0) {
        cards[currentIndex].classList.add('active')
        currentIndex = (currentIndex + 1) % cards.length
      }
    }

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      end: "bottom 20%",
      onEnter: () => { highlightInterval = setInterval(highlightNext, 2000) },
      onLeave: () => { clearInterval(highlightInterval); cards.forEach(c => c.classList.remove('active')) },
      onEnterBack: () => { highlightInterval = setInterval(highlightNext, 2000) },
      onLeaveBack: () => { clearInterval(highlightInterval); cards.forEach(c => c.classList.remove('active')) }
    })

    return () => clearInterval(highlightInterval)
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-dark overflow-hidden relative">
      <div 
        className="gallery-bg absolute -top-[20%] left-0 w-full h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-forest/30 via-dark to-dark pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="gallery-header mb-20 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-display font-black text-accent">THE TIMELINE</h2>
          <p className="text-primary mt-2 text-xl font-sans uppercase tracking-widest">Select Cuts & Comps</p>
        </div>

        <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col gap-12 md:gap-24">
            {PLACEHOLDER_PROJECTS.filter((_, i) => i % 2 === 0).map((project) => (
              <VideoCard key={project.id} project={project} />
            ))}
          </div>
          <div className="flex flex-col gap-12 md:gap-24 md:mt-32">
            {PLACEHOLDER_PROJECTS.filter((_, i) => i % 2 !== 0).map((project) => (
              <VideoCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
