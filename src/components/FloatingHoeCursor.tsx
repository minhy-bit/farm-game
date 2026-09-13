import React, { useEffect, useState, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { HOE_SKINS_MAP, DEFAULT_HOE_SKIN_ID } from '../data/hoeSkins'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  char: string
}

export const FloatingHoeCursor: React.FC = () => {
  const { hoeGacha } = useGame()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [isClicking, setIsClicking] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const particleIdRef = useRef(0)

  const equippedSkin = HOE_SKINS_MAP.get(hoeGacha?.equippedSkinId || DEFAULT_HOE_SKIN_ID) || HOE_SKINS_MAP.get(DEFAULT_HOE_SKIN_ID)!

  useEffect(() => {
    if (!hoeGacha?.isFloatingCursorEnabled) return

    let lastTime = 0
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })

      // 트레일 이펙트 파티클 생성 (너무 빈번하지 않게 60ms 간격 제한)
      const now = Date.now()
      if (equippedSkin.trailEffect !== 'none' && now - lastTime > 60) {
        lastTime = now
        const pId = ++particleIdRef.current
        let char = '✨'
        let pColor = equippedSkin.color

        if (equippedSkin.trailEffect === 'leaf') {
          char = '🍃'
          pColor = '#10b981'
        } else if (equippedSkin.trailEffect === 'gold') {
          char = '🪙'
          pColor = '#f59e0b'
        } else if (equippedSkin.trailEffect === 'rainbow') {
          const colors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6']
          pColor = colors[pId % colors.length]
          char = '🌈'
        }

        setParticles(prev => [
          ...prev.slice(-12),
          { id: pId, x: e.clientX + (Math.random() * 10 - 5), y: e.clientY + 20, color: pColor, char }
        ])

        // 800ms 후 파티클 제거
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== pId))
        }, 700)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [hoeGacha?.isFloatingCursorEnabled, equippedSkin])

  if (!hoeGacha?.isFloatingCursorEnabled || pos.x < 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. 파티클 트레일 잔상 */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute text-xs animate-ping opacity-80 select-none transition-all duration-700"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            color: p.color,
            textShadow: `0 0 8px ${p.color}`
          }}
        >
          {p.char}
        </span>
      ))}

      {/* 2. 마우스를 따라다니는 호미 본체 */}
      <div
        className="fixed transition-transform duration-75 ease-out select-none flex items-center justify-center"
        style={{
          left: `${pos.x + 14}px`,
          top: `${pos.y + 12}px`,
          transform: `translate3d(0, 0, 0) ${isClicking ? 'rotate(-38deg) scale(1.15) translate(-4px, 4px)' : 'rotate(0deg) scale(1)'}`,
          transformOrigin: 'top left'
        }}
      >
        {/* 호미 등급 후광 글로우 */}
        <div
          className="absolute w-8 h-8 rounded-full blur-sm opacity-60 animate-pulse"
          style={{ backgroundColor: equippedSkin.glowColor }}
        />

        {/* 호미 아이콘 그래픽 */}
        <div
          className="relative text-2xl drop-shadow-lg filter flex items-center justify-center p-1 rounded-full bg-slate-900/60 border backdrop-blur-[2px]"
          style={{
            borderColor: equippedSkin.color,
            boxShadow: `0 0 10px ${equippedSkin.glowColor}`
          }}
          title={equippedSkin.name}
        >
          <span>{equippedSkin.icon}</span>
        </div>
      </div>
    </div>
  )
}
