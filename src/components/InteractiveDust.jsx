import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function CinematicMist({ count = 2000 }) {
  const mesh = useRef()

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 30
      temp[i * 3 + 1] = (Math.random() - 0.5) * 30
      temp[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
    }
    return temp
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Soft, swirling mist
    mesh.current.rotation.z = time * 0.02
    mesh.current.rotation.x = Math.sin(time * 0.1) * 0.05
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#f4ecd8" transparent opacity={0.2} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function ShatteredTimelines({ scrollData, count = 25 }) {
  const group = useRef()
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  // Store initial positions to calculate explosion spread
  const initialData = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        rotation: new THREE.Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: 0.5 + Math.random() * 1.5,
        speed: 0.5 + Math.random() * 1.5
      })
    }
    return data
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // scrollData.current goes from 0 to 1 based on GSAP scrub
    const progress = scrollData.current || 0

    if (meshRef.current) {
      initialData.forEach((data, i) => {
        // Base idle rotation + scroll-driven fast rotation
        dummy.rotation.set(
          data.rotation.x + time * 0.2 * data.speed + progress * Math.PI * 2,
          data.rotation.y + time * 0.3 * data.speed + progress * Math.PI,
          data.rotation.z
        )

        // Explosion effect: push objects outward based on scroll progress
        const explosionFactor = 1 + (progress * 3 * data.speed)
        dummy.position.copy(data.position).multiplyScalar(explosionFactor)
        
        dummy.scale.setScalar(data.scale)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
    
    // Slowly rotate the entire group
    group.current.rotation.y = time * 0.05
  })

  return (
    <group ref={group}>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        {/* We use an octahedron or tetrahedron to simulate shards of glass/film */}
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#1c3826" // Moss green glass
          transparent={true} 
          opacity={0.85} 
          metalness={0.3} 
          roughness={0.2} 
          envMapIntensity={2}
        />
      </instancedMesh>
    </group>
  )
}

export default function InteractiveDust() {
  const sectionRef = useRef()
  // Track scroll progress manually to pass to React Three Fiber
  const scrollData = useRef(0)

  useGSAP(() => {
    // Scrub timeline for the 3D shards explosion
    gsap.to(scrollData, {
      current: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#dust",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    })

    // Parallax and entrance for text
    gsap.fromTo('.dust-text', 
      { y: 150, opacity: 0 },
      { 
        y: -100, 
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "#dust",
          start: "top 80%",
          end: "bottom top",
          scrub: true
        }
      }
    )
  }, { scope: sectionRef })

  return (
    <section id="dust" ref={sectionRef} className="relative w-full h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-forest">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={2} color="#f4ecd8" />
          <pointLight position={[-5, -10, -5]} intensity={1} color="#8b5a2b" />
          
          <fog attach="fog" args={['#1c3826', 2, 20]} />
          <CinematicMist />
          <ShatteredTimelines scrollData={scrollData} />
        </Canvas>
      </div>
      
      {/* Floating Text without any glassmorphism box */}
      <div className="dust-text relative z-10 text-center pointer-events-none max-w-4xl px-4">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-accent to-[#8b5a2b] mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
          FILM EMULATION
        </h2>
        <p className="text-xl md:text-2xl text-accent/90 font-sans max-w-2xl mx-auto drop-shadow-xl font-medium">
          Professional color grading combined with authentic film grain, halation, and subtle lens distortion to give digital footage a true cinematic texture.
        </p>
      </div>
    </section>
  )
}
