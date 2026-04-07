'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useAudio } from '@/lib/audio'
import Soli from '@/components/Soli'
import Link from 'next/link'

const STORIES = [
  { am: 'ሶሊ ዛሬ ደክሟት ነበር። ጓደኛዋ "Hello!" አላት። ሶሊ "Hello! Thank you for coming!" አለች። ደስ ብሏት ተኛች።',
    en: 'Soli was tired today. Her friend said "Hello!" Soli said "Hello! Thank you for coming!" She went to sleep happy.',
    words: ['Hello', 'Thank you'] },
  { am: 'ትንሽ ልጅ ቡና ቤት ሄደ። "Coffee, please!" አለ። ቡናውን ጠጣ። "Thank you!" አለ። ደስ ብሎት ተመለሰ።',
    en: 'A little child went to the cafe. "Coffee, please!" he said. He drank the coffee. "Thank you!" he said. He went home happy.',
    words: ['Coffee', 'Please', 'Thank you'] },
  { am: 'ሶሊ አዲስ ጓደኛ አገኘች። "My name is Soli!" አለች። ጓደኛዋ "My name is Lemi!" አለ። ሁለቱም ፈገግ አሉ።',
    en: 'Soli met a new friend. "My name is Soli!" she said. Her friend said "My name is Lemi!" They both smiled.',
    words: ['My name is'] },
]

export default function BedtimePage() {
  const { state } = useStore()
  const audio = useAudio()
  const [storyIdx] = useState(Math.floor(Math.random() * STORIES.length))
  const [phase, setPhase] = useState(0) // 0=intro, 1=story, 2=sleep
  const [dim, setDim] = useState(0)

  const story = STORIES[storyIdx]

  useEffect(() => {
    setTimeout(() => setPhase(1), 2000)
    setTimeout(() => {
      audio.speak(story.en, 'en-US', 0.6)
    }, 2500)
    setTimeout(() => setPhase(2), 12000)
    setTimeout(() => setDim(1), 14000)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative transition-all duration-[3000ms]"
      style={{ background: dim ? '#1A1008' : '#2D2016' }}>

      <div className="absolute top-4 left-4 z-20">
        <Link href="/" className="text-white/30 text-sm tap-scale">✕</Link>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-amber-200" style={{
            width: `${1 + Math.random() * 2}px`, height: `${1 + Math.random() * 2}px`,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`,
            opacity: 0.3 + Math.random() * 0.4,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-sm">
        {/* Moon */}
        <div className="text-5xl mb-6 animate-float">🌙</div>

        <Soli mood="sleepy" size="lg" speaking={audio.speaking} className="mb-6" />

        {phase === 0 && (
          <div className="animate-fade-up">
            <p className="text-white/70 text-base mb-1">መልካም ሌሊት, {state.name}!</p>
            <p className="text-white/40 text-sm">Good night! Here's a short story...</p>
          </div>
        )}

        {phase >= 1 && (
          <div className="animate-fade-up">
            <div className="bg-white/10 rounded-2xl p-5 mb-4 backdrop-blur">
              <p className="text-white/70 text-sm leading-relaxed">{story.am}</p>
              <div className="w-8 h-px bg-white/20 mx-auto my-3" />
              <p className="text-white/40 text-xs leading-relaxed">{story.en}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {story.words.map((w, i) => (
                <span key={i} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs">⭐ {w}</span>
              ))}
            </div>
          </div>
        )}

        {phase >= 2 && (
          <div className="mt-6 animate-fade-up">
            <p className="text-white/40 text-sm mb-4">መልካም ሌሊት! ነገ እንገናኝ! 💤</p>
            <p className="text-white/20 text-xs">Good night! See you tomorrow!</p>
            <Link href="/" className="inline-block mt-4 text-white/30 text-xs tap-scale">← Home</Link>
          </div>
        )}
      </div>
    </div>
  )
}
