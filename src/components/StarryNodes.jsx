import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Line, Icosahedron } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

function NodeCamera() {
  const { camera } = useThree()
  
  // We use GSAP to animate the camera's Z position based on scroll
  useGSAP(() => {
    // Start far away
    camera.position.set(0, 0, 18)
    
    gsap.to(camera.position, {
      z: 2, // Fly right into the tree
      ease: "none",
      scrollTrigger: {
        trigger: "#nodes",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  }, [camera])

  return null
}

function OrganicNodeTree({ count = 40 }) {
  const group = useRef()
  const meshRef = useRef()

  const { positions, lines, dummy } = useMemo(() => {
    const positions = []
    const temp = []
    const dummy = new THREE.Object3D()

    // Create a 3D tunnel/tree structure
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 16 // Spread deep into Z axis
      )
      positions.push(v)
      temp.push([v.x, v.y, v.z])
    }

    const lines = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        // Connect nearby nodes
        if (positions[i].distanceTo(positions[j]) < 4.0) {
          lines.push([positions[i], positions[j]])
        }
      }
    }
    return { positions, lines, dummy }
  }, [count])

  // Initialize instances
  useMemo(() => {
    if (meshRef.current) {
      positions.forEach((pos, i) => {
        dummy.position.copy(pos)
        
        // Random scale for nodes
        const scale = 0.5 + Math.random() * 0.8
        dummy.scale.set(scale, scale, scale)
        
        // Random rotation
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
        
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [positions, dummy])

  // Pre-allocate a vector for extracting scale outside the loop to prevent GC leaks
  const tempScale = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Gentle sway like roots underwater
    group.current.rotation.y = Math.sin(time * 0.1) * 0.05
    group.current.position.y = Math.sin(time * 0.2) * 0.2
    
    // Slowly rotate instances
    if (meshRef.current) {
      positions.forEach((pos, i) => {
        meshRef.current.getMatrixAt(i, dummy.matrix)
        dummy.position.copy(pos)
        
        // Extract scale from existing matrix using pre-allocated vector
        tempScale.setFromMatrixScale(dummy.matrix)
        dummy.scale.copy(tempScale)
        
        dummy.rotation.x = time * 0.2 + i
        dummy.rotation.y = time * 0.3 + i
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={group}>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial 
          color="#f4ecd8"
          transparent={true} 
          opacity={0.85} 
          metalness={0.2} 
          roughness={0.1} 
          envMapIntensity={2}
        />
      </instancedMesh>
      
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color="#8b5a2b" opacity={0.6} transparent lineWidth={1.5} />
      ))}
    </group>
  )
}

export default function StarryNodes() {
  const sectionRef = useRef()

  useGSAP(() => {
    gsap.from('.nodes-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#nodes",
        start: "top 60%",
      }
    })
  }, { scope: sectionRef })

  return (
    <section id="nodes" ref={sectionRef} className="relative w-full h-[150vh] bg-gradient-to-b from-dark to-forest">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* The 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Canvas>
            <NodeCamera />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#f4ecd8" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5a2b" />
            <fog attach="fog" args={['#0d1f15', 5, 20]} />
            <OrganicNodeTree />
          </Canvas>
        </div>

        {/* Overlay Text */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none px-6">
          <div className="nodes-text relative z-10 text-center pointer-events-none bg-dark/40 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border border-primary/20 shadow-2xl max-w-4xl mx-4">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-accent mb-6 drop-shadow-lg">
              ADVANCED COMPOSITING
            </h2>
            <p className="text-primary font-sans text-xl md:text-2xl tracking-wide">
              Industry-standard node-based workflows for seamless visual effects, dynamic motion graphics, and high-end cinematic finishing.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
