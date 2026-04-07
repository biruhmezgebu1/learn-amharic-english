'use client'
import { useState, useEffect, useRef } from 'react'

// ===== Speech Bubble with typing effect =====
export function SoliBubble({ text, sub, onDone }: { text: string; sub?: string; onDone?: () => void }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    setShown(''); setDone(false)
    let i = 0
    ref.current = setInterval(() => {
      i++; setShown(text.slice(0, i))
      if (i >= text.length) { clearInterval(ref.current); setDone(true); onDone?.() }
    }, 25)
    return () => clearInterval(ref.current)
  }, [text])

  return (
    <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm border border-sand max-w-[85%] relative">
      <div className="absolute -top-2 left-6 w-3 h-3 bg-white border-l border-t border-sand rotate-45" />
      <p className="text-[15px] text-coffee-800 leading-relaxed relative z-10">
        {shown}{!done && <span className="text-amber-400 animate-pulse">|</span>}
      </p>
      {sub && done && <p className="text-[13px] text-coffee-400 mt-1.5">{sub}</p>}
    </div>
  )
}

// ===== Star Counter =====
export function StarCounter({ stars }: { stars: number }) {
  const [pop, setPop] = useState(false)
  const prev = useRef(stars)

  useEffect(() => {
    if (stars > prev.current) { setPop(true); setTimeout(() => setPop(false), 400) }
    prev.current = stars
  }, [stars])

  return (
    <div className={`flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 ${pop ? 'animate-star-earn' : ''}`}>
      <span className="text-sm">⭐</span>
      <span className="text-xs font-bold text-amber-700">{stars}</span>
    </div>
  )
}

// ===== Confetti =====
export function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  const colors = ['#D4942A', '#2DB89F', '#E8664E', '#5BC0EB', '#4CAF50', '#F0C060']
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="absolute animate-confetti" style={{
          left: `${Math.random() * 100}%`,
          top: '-10px',
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          background: colors[i % colors.length],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animationDelay: `${Math.random() * 1}s`,
          animationDuration: `${1.5 + Math.random() * 1.5}s`,
        }} />
      ))}
    </div>
  )
}

// ===== Word Card =====
export function WordCard({ word, meaning, onListen }: { word: string; meaning: string; onListen: () => void }) {
  return (
    <div className="bg-white rounded-2xl px-6 py-5 shadow-lg border border-sand text-center animate-scale-pop">
      <button onClick={onListen} className="text-3xl font-bold text-amber-600 hover:text-amber-500 transition-colors tap-scale">
        {word}
      </button>
      <p className="text-lg text-coffee-400 mt-1.5 font-serif">{meaning}</p>
      <button onClick={onListen} className="mt-3 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-amber-100 transition-colors tap-scale inline-flex items-center gap-1.5">
        <span>🔊</span> ያዳምጡ
      </button>
    </div>
  )
}

// ===== Streak Flame =====
export function StreakFlame({ days }: { days: number }) {
  const rings = days >= 30 ? 3 : days >= 14 ? 2 : days >= 7 ? 1 : 0
  return (
    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
      <span className={`text-sm ${days >= 30 ? 'animate-pulse' : ''}`}>🔥</span>
      {rings > 0 && <span className="text-[8px] text-amber-400">{'◉'.repeat(rings)}</span>}
      <span className="text-xs font-bold text-amber-700">{days}</span>
    </div>
  )
}
