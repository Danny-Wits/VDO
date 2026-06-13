import React, { useState, useRef, useEffect } from 'react'
import { ActionIcon, Slider } from '@mantine/core'
import { useFullscreenElement } from '@mantine/hooks'
import { IconPlayerPlayFilled, IconPlayerPauseFilled, IconVolume, IconVolume3, IconMaximize } from '@tabler/icons-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export default function StealthPlayer({ url }) {
  const playerRef = useRef(null)
  const { ref: containerRef, toggle: toggleFullscreen, fullscreen } = useFullscreenElement()
  const [playing, setPlaying] = useState(true)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(true)
  const [played, setPlayed] = useState(0)

  const handlePlayPause = () => {
    if (!playerRef.current) return
    if (playing) {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
    setPlaying(!playing)
  }
  
  const handleVolumeChange = (value) => {
    const newVolume = value / 100
    setVolume(newVolume)
    setMuted(newVolume === 0)
    if (playerRef.current) {
      playerRef.current.volume = newVolume
      playerRef.current.muted = newVolume === 0
    }
  }

  const handleToggleMuted = () => {
    const newMuted = !muted
    setMuted(newMuted)
    if (playerRef.current) {
      playerRef.current.muted = newMuted
    }
  }

  const handleSeek = (value) => {
    if (!playerRef.current) return
    const newTime = (value / 100) * playerRef.current.duration
    playerRef.current.currentTime = newTime
    setPlayed(value / 100)
  }

  const handleTimeUpdate = () => {
    if (!playerRef.current || !playerRef.current.duration) return
    setPlayed(playerRef.current.currentTime / playerRef.current.duration)
  }

  // Ensure video is playing when component mounts
  useEffect(() => {
    if (playerRef.current && playing) {
      playerRef.current.play().catch(e => console.error("Autoplay failed", e))
    }
  }, [playing])

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={`relative w-full bg-forest/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/20 group ${fullscreen ? 'h-screen rounded-none' : 'aspect-video'}`}>
      
      {/* The Player - pointer events disabled to make it "stealth" */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <video
          ref={playerRef}
          src={url}
          className="w-full h-full object-cover"
          autoPlay
          muted={muted}
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
        />
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-dark via-forest/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
        
        {/* Progress Bar (The Timeline) */}
        <div className="w-full mb-4">
          <Slider
            value={played * 100}
            onChange={handleSeek}
            color="#8b5a2b"
            size="sm"
            classNames={{
              thumb: 'border-2 border-accent bg-[#8b5a2b]',
              track: 'bg-accent/20'
            }}
          />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ActionIcon 
              variant="transparent" 
              color="var(--color-accent)" 
              size="xl" 
              onClick={handlePlayPause}
              className="hover:scale-110 hover:text-primary transition-all"
            >
              {playing ? <IconPlayerPauseFilled size={32} /> : <IconPlayerPlayFilled size={32} />}
            </ActionIcon>
            
            <div className="flex items-center gap-2 group/volume w-32">
              <ActionIcon variant="transparent" color="var(--color-accent)" onClick={handleToggleMuted} className="hover:text-primary transition-colors">
                {muted || volume === 0 ? <IconVolume3 size={24} /> : <IconVolume size={24} />}
              </ActionIcon>
              <Slider
                value={muted ? 0 : volume * 100}
                onChange={handleVolumeChange}
                color="#8b5a2b"
                size="xs"
                className="flex-grow opacity-0 group-hover/volume:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ActionIcon variant="transparent" color="var(--color-accent)" onClick={toggleFullscreen} className="hover:text-primary transition-colors">
              <IconMaximize size={24} />
            </ActionIcon>
          </div>
        </div>
      </div>

    </div>
  )
}
