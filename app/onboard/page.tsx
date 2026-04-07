'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { useRouter } from 'next/navigation'

export default function OnboardPage() {
  const { update } = useStore()
  const audio = useAudio()
  const router = useRouter()
  const [step, setStep] = useState(0) // 0=name, 1=age
  const [name, setName] = useState('')

  const submitName = () => {
    if (!name.trim()) return
    update({ name: name.trim() })
    audio.speak(`Hello ${name.trim()}! Nice to meet you!`, 'en-US', 0.8)
    setStep(1)
  }

  const selectAge = (age: 'young' | 'preteen' | 'adult') => {
    update({ age, isOnboarded: true, direction: 'am_to_en' })
    audio.speak("Let's go on an adventure!", 'en-US', 0.8)
    setTimeout(() => router.push('/world'), 1200)
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex flex-col items-center justify-center px-6">
      <div className="alpha-bg" />
      <div className="warm-glow fixed inset-0" />
      <div className="absolute top-4 right-4 z-20"><MuteBtn muted={audio.muted} onToggle={audio.toggleMute} /></div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-6">
          <Soli mood={step === 0 ? 'smile' : 'celebrate'} size="lg" speaking={audio.speaking} />
        </div>

        {step === 0 && (
          <div className="animate-fade-up">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand mb-4">
              <p className="text-base font-semibold text-coffee-800 mb-1">ስምህ ማን ነው?</p>
              <p className="text-xs text-coffee-400 mb-4">What is your name?</p>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitName()}
                placeholder="ስምዎን ይጻፉ..."
                className="w-full bg-cream rounded-xl px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-amber-400 border border-sand"
                autoFocus />
            </div>
            <button onClick={submitName} disabled={!name.trim()}
              className="w-full bg-amber-500 text-white rounded-2xl py-4 text-lg font-bold shadow-lg shadow-amber-500/25 tap-scale disabled:opacity-30 transition-all">
              ቀጥል →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <p className="text-center text-base font-semibold text-coffee-800 mb-1">ዕድሜህ ስንት ነው?</p>
            <p className="text-center text-xs text-coffee-400 mb-6">How old are you?</p>
            <div className="space-y-3">
              <button onClick={() => selectAge('young')}
                className="w-full bg-white rounded-2xl p-5 border-2 border-sand hover:border-amber-300 tap-scale transition-all flex items-center gap-4">
                <span className="text-4xl">👧</span>
                <div className="text-left">
                  <p className="font-bold text-coffee-800">6-9</p>
                  <p className="text-xs text-coffee-400">ልጅ / Child</p>
                </div>
              </button>
              <button onClick={() => selectAge('preteen')}
                className="w-full bg-white rounded-2xl p-5 border-2 border-sand hover:border-amber-300 tap-scale transition-all flex items-center gap-4">
                <span className="text-4xl">🧑</span>
                <div className="text-left">
                  <p className="font-bold text-coffee-800">10-14</p>
                  <p className="text-xs text-coffee-400">ታዳጊ / Pre-teen</p>
                </div>
              </button>
              <button onClick={() => selectAge('adult')}
                className="w-full bg-white rounded-2xl p-5 border-2 border-sand hover:border-amber-300 tap-scale transition-all flex items-center gap-4">
                <span className="text-4xl">🧑‍💼</span>
                <div className="text-left">
                  <p className="font-bold text-coffee-800">15+</p>
                  <p className="text-xs text-coffee-400">ወጣት / Young adult</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
