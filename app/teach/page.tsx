'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { Confetti } from '@/components/UI'
import { getWord, VOCAB } from '@/content/vocabulary'
import Link from 'next/link'

export default function TeachPage() {
  const { state, addStars } = useStore()
  const audio = useAudio()
  const [wordIdx, setWordIdx] = useState(0)
  const [step, setStep] = useState<'pick' | 'show' | 'say' | 'check' | 'done'>('pick')
  const [confetti, setConfetti] = useState(false)
  const [taught, setTaught] = useState(0)

  const knownWords = state.wordsLearned.map(id => getWord(id)).filter(Boolean) as any[]
  const word = knownWords[wordIdx]

  if (knownWords.length < 3) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 relative">
        <div className="alpha-bg" />
        <div className="relative z-10 text-center">
          <Soli mood="think" size="lg" className="mb-4" />
          <p className="text-lg font-bold text-coffee-800 mb-1">ገና ለማስተማር በቂ ቃላት አልተማሩም!</p>
          <p className="text-sm text-coffee-400 mb-6">Learn more words first. Come back after a few lessons!</p>
          <Link href="/" className="bg-coffee-800 text-white rounded-xl px-6 py-3 font-semibold tap-scale">← ተመለስ / Back</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col max-w-lg mx-auto relative">
      <div className="alpha-bg" />
      <Confetti active={confetti} />

      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-coffee-400/40 text-sm tap-scale">← ተመለስ</Link>
          <h1 className="font-bold text-sm text-coffee-800 flex-1">👩‍🏫 Teach Mode</h1>
          <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
        {/* Lemi (the student) - simple SVG */}
        <div className="mb-4">
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <circle cx="40" cy="35" r="20" fill="#D4A76A"/>
            <ellipse cx="40" cy="20" rx="18" ry="10" fill="#2A1A0A"/>
            <path d="M 25,28 Q 32,14 40,12 Q 48,14 55,28 Q 48,20 40,18 Q 32,20 25,28" fill="#2A1A0A"/>
            <circle cx="34" cy="34" r="2.5" fill="#2A1A0A"/>
            <circle cx="46" cy="34" r="2.5" fill="#2A1A0A"/>
            <circle cx="35" cy="33" r="0.8" fill="white"/>
            <circle cx="47" cy="33" r="0.8" fill="white"/>
            {step === 'check' ? <path d="M 36,42 Q 40,46 44,42" stroke="#2A1A0A" strokeWidth="1.5" fill="none" strokeLinecap="round"/> :
              <ellipse cx="40" cy="42" rx="2.5" ry="2" fill="#CC7755"/>}
            <rect x="28" y="52" width="24" height="20" rx="4" fill="#5BC0EB"/>
            <text x="40" y="74" textAnchor="middle" fontSize="8" fill="#2A1A0A" fontWeight="bold">Lemi</text>
          </svg>
        </div>

        {step === 'pick' && (
          <div className="w-full max-w-xs">
            <p className="text-center text-sm text-coffee-400 mb-1">ለሚ ምን ታስተምራለህ?</p>
            <p className="text-center text-xs text-coffee-400/60 mb-4">What will you teach Lemi?</p>
            <div className="space-y-2">
              {knownWords.slice(0, 5).map((w: any, i: number) => (
                <button key={i} onClick={() => { setWordIdx(i); setStep('show'); audio.speakEnglish(w.en) }}
                  className="w-full py-3 px-4 rounded-xl border-2 border-sand bg-white font-semibold tap-scale hover:border-amber-300 transition-all text-left flex justify-between">
                  <span className="text-coffee-800">{w.en}</span>
                  <span className="text-coffee-400 text-sm">{w.am}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'show' && word && (
          <div className="text-center w-full max-w-xs">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3">
              <p className="text-xs text-amber-700">ለሚ: "ይህን ቃል አላውቅም! አስተምረኝ!"</p>
              <p className="text-[10px] text-amber-600">"I don't know this word! Teach me!"</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-sand mb-4">
              <p className="text-3xl font-bold text-amber-700">{word.en}</p>
              <p className="text-lg text-coffee-400 font-serif">{word.am}</p>
            </div>
            <button onClick={() => { setStep('say'); audio.speak(`Now say ${word.en} for Lemi!`, 'en-US', 0.8) }}
              className="w-full bg-amber-500 text-white rounded-2xl py-3 font-bold tap-scale">
              🔊 ለሚን አስተምር / Teach Lemi →
            </button>
          </div>
        )}

        {step === 'say' && word && (
          <div className="text-center w-full max-w-xs">
            <p className="text-sm text-coffee-700 mb-4">"{word.en}" ብለህ ለሚን ንገረው!</p>
            <p className="text-xs text-coffee-400 mb-4">Say "{word.en}" to Lemi!</p>
            <button onClick={() => {
              setStep('check')
              audio.speakEnglish(word.en)
              setConfetti(true)
              addStars(2)
              setTaught(prev => prev + 1)
              setTimeout(() => setConfetti(false), 1500)
            }}
              className="w-full bg-teal-500 text-white rounded-2xl py-4 text-lg font-bold tap-scale">
              ✓ ተናገርኩ! / I said it!
            </button>
          </div>
        )}

        {step === 'check' && word && (
          <div className="text-center w-full max-w-xs">
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 mb-4">
              <p className="text-sm text-teal-800">ለሚ ተማረ! 🎉</p>
              <p className="text-xs text-teal-600">Lemi learned "{word.en}"!</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setStep('pick') }}
                className="flex-1 bg-amber-500 text-white rounded-xl py-3 font-bold tap-scale">
                ሌላ አስተምር / Teach more
              </button>
              <Link href="/"
                className="flex-1 bg-coffee-800 text-white rounded-xl py-3 font-bold tap-scale text-center">
                ጨርሻለሁ / Done
              </Link>
            </div>
            <p className="text-xs text-coffee-400 mt-3">{taught} words taught today</p>
          </div>
        )}
      </div>
    </div>
  )
}
