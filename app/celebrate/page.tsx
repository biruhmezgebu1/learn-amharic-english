'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useAudio } from '@/lib/audio'
import Soli from '@/components/Soli'
import { Confetti } from '@/components/UI'
import Link from 'next/link'

export default function CelebratePage() {
  const { state } = useStore()
  const audio = useAudio()
  const [confetti, setConfetti] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    setConfetti(true)
    setTimeout(() => audio.speak(`${state.name || 'You'}! You spoke English today! Hello, Thank you, My name is! I am so proud!`, 'en-US', 0.75), 800)
    setTimeout(() => setStep(1), 1500)
    setTimeout(() => setStep(2), 3500)
    setTimeout(() => setConfetti(false), 4000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-cream flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <Confetti active={confetti} />
      <div className="warm-glow fixed inset-0" />

      <div className="relative z-10 text-center max-w-sm">
        <div className="mb-6 soli-bounce">
          <Soli mood="celebrate" size="xl" speaking={audio.speaking} />
        </div>

        <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl font-bold text-coffee-800 mb-1">
            የመጀመሪያ እንግሊዝኛ ቃሎትን ተናገሩ!
          </h1>
          <p className="text-sm text-coffee-400">You spoke your first English words!</p>
        </div>

        {/* Seeds planted */}
        <div className={`mt-8 transition-all duration-700 delay-300 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand">
            <p className="text-xs text-coffee-400 uppercase tracking-wider mb-3">🌱 Your first seeds</p>
            <div className="flex justify-around">
              {[
                { en: 'Hello', am: 'ሰላም', emoji: '🌻' },
                { en: 'Thank you', am: 'አመሰግናለሁ', emoji: '🌷' },
                { en: 'My name is', am: 'ስሜ...ነው', emoji: '🌹' },
              ].map((w, i) => (
                <div key={i} className="text-center animate-scale-pop" style={{ animationDelay: `${0.5 + i * 0.2}s`, opacity: 0 }}>
                  <p className="text-2xl mb-1">{w.emoji}</p>
                  <p className="text-sm font-bold text-coffee-800">{w.en}</p>
                  <p className="text-[10px] text-coffee-400">{w.am}</p>
                  <p className="text-amber-500 text-xs mt-0.5">✓</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <div className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 flex items-center gap-1">
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold text-amber-700">+13 stars!</span>
            </div>
          </div>
        </div>

        <Link href="/"
          className={`block mt-8 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl py-4 text-lg font-bold shadow-lg tap-scale transition-all duration-700 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          ወደ ጉዞው → / To the Adventure Map
        </Link>
      </div>
    </div>
  )
}
