import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function KeyframeSwarm({ count = 150 }) {
  const meshRef = useRef()
  const { viewport } = useThree()

  // Generate initial random positions and states
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        xFactor: -50 + Math.random() * 100,
        yFactor: -50 + Math.random() * 100,
        zFactor: -50 + Math.random() * 100,
        mx: 0,
        my: 0
      })
    }
    return data
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Normalize mouse coordinates mapped to viewport size
    const mouseX = (state.mouse.x * viewport.width) / 2
    const mouseY = (state.mouse.y * viewport.height) / 2

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)

      // Base swirling position
      let x = (xFactor / 10) + a * 2
      let y = (yFactor / 10) + b * 2
      let z = (zFactor / 10) + s * 2

      // Mouse repel math (Optimized with early bounding box check)
      const dx = x - mouseX
      const dy = y - mouseY
      
      // Fast check before doing Math.sqrt
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) {
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 4) {
          particle.mx += dx * 0.05
          particle.my += dy * 0.05
        }
      }

      // Smooth decay of repel force
      particle.mx *= 0.95
      particle.my *= 0.95

      x += particle.mx
      y += particle.my

      // Update dummy object to calculate matrix
      dummy.position.set(x, y, z)
      
      // Rotate the geometric shapes
      dummy.rotation.set(s * 5, s * 5, s * 5)
      
      // Pulse size
      dummy.scale.setScalar(Math.max(0.2, s * 0.5))
      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Octahedron resembles a digital keyframe diamond */}
      <octahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial 
        color="#f4ecd8" 
        emissive="#8b5a2b" 
        emissiveIntensity={0.5} 
        transparent 
        opacity={0.8} 
        wireframe={true} 
      />
    </instancedMesh>
  )
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark Vignette Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-dark/40 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0d1f15_100%)] opacity-90 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-transparent to-dark pointer-events-none z-0"></div>

      {/* 3D Keyframe Swarm Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#f4ecd8" />
          <KeyframeSwarm />
        </Canvas>
      </div>
    </div>
  )
}
