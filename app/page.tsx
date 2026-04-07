'use client'
import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { SoliBubble, StarCounter, StreakFlame } from '@/components/UI'
import { LESSONS } from '@/content/vocabulary'
import Link from 'next/link'

export default function Home() {
  const { state, loaded, getDaysSinceActive } = useStore()
  const audio = useAudio()
  const [ready, setReady] = useState(false)
  const [soliIn, setSoliIn] = useState(false)
  const [bubbleIn, setBubbleIn] = useState(false)
  const [btnIn, setBtnIn] = useState(false)

  useEffect(() => {
    if (!loaded) return
    setTimeout(() => setReady(true), 200)
    setTimeout(() => setSoliIn(true), 500)
    setTimeout(() => setBubbleIn(true), 1800)
    setTimeout(() => setBtnIn(true), 3200)
    // Auto-speak welcome
    if (!state.isOnboarded) {
      setTimeout(() => audio.speak('Hello! I am Soli! Your English teacher!', 'en-US', 0.8), 2200)
    }
  }, [loaded])

  if (!loaded) return <div className="min-h-screen bg-cream" />

  // ==========================================
  // POST-ONBOARD: ADVENTURE MAP
  // ==========================================
  if (state.isOnboarded) {
    const absent = getDaysSinceActive()
    const greeting = getGreeting()
    const currentLesson = LESSONS[Math.min(state.currentMapStop, LESSONS.length - 1)]
    const gardenHasWilting = state.wordsLearned.length > 3

    return (
      <div className="min-h-screen bg-cream relative">
        <div className="alpha-bg" />
        <div className="warm-glow fixed inset-0" />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-4">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Soli mood="smile" size="sm" />
              <div>
                <p className="text-[11px] text-coffee-400">{greeting}</p>
                <p className="text-sm font-bold text-coffee-800">{state.name || 'Soli'} ሶሊ</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
              <StarCounter stars={state.stars} />
              <StreakFlame days={state.streakDays} />
            </div>
          </div>

          {/* Welcome back after absence */}
          {absent >= 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <Soli mood="wave" size="sm" />
              <div>
                <p className="text-sm font-semibold text-amber-800">ናፈቅሁህ!</p>
                <p className="text-xs text-amber-600">I missed you! Let's water our garden first.</p>
              </div>
            </div>
          )}

          {/* First lesson prompt if not completed */}
          {!state.hasCompletedFirstAdventure && (
            <Link href="/world"
              className="block bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-5 mb-4 text-white relative overflow-hidden tap-scale">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
              <div className="flex items-center gap-3 relative z-10">
                <Soli mood="wave" size="md" />
                <div className="flex-1">
                  <p className="font-bold text-lg">የመጀመሪያ ጉዞ!</p>
                  <p className="text-sm text-white/80 mt-0.5">ሶሊ ጋር ይተዋወቁ። 3 ቃላት ይማሩ!</p>
                  <p className="text-xs text-white/60 mt-0.5">Meet Soli. Learn 3 words!</p>
                  <div className="mt-2 bg-white/20 rounded-full px-3 py-1 inline-block">
                    <span className="text-sm font-bold">ጀምር → </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Adventure Map */}
          <div className="bg-white rounded-2xl border border-sand p-4 mb-3">
            <p className="text-xs text-coffee-400 uppercase tracking-wider mb-3">🗺️ {state.name ? state.name + ' \'s' : ''} Journey</p>
            <div className="space-y-2">
              {LESSONS.slice(0, Math.min(state.currentMapStop + 2, LESSONS.length)).map((l, i) => {
                const done = i < state.currentMapStop
                const current = i === state.currentMapStop
                const locked = i > state.currentMapStop
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                      done ? 'bg-amber-100 border-2 border-amber-400' :
                      current ? 'bg-amber-500 border-2 border-amber-300 animate-pulse' :
                      'bg-sand border-2 border-sand opacity-50'
                    }`}>
                      {done ? '✓' : l.emoji}
                    </div>
                    {current && state.hasCompletedFirstAdventure ? (
                      <Link href="/lesson" className="flex-1 tap-scale">
                        <p className="font-semibold text-sm text-coffee-800">{l.titleAm}</p>
                        <p className="text-[11px] text-coffee-400">{l.storyEn}</p>
                      </Link>
                    ) : (
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${locked ? 'text-coffee-400/40' : 'text-coffee-800'}`}>{done ? l.titleEn : l.titleAm}</p>
                        <p className="text-[11px] text-coffee-400">{l.location}</p>
                      </div>
                    )}
                    {done && <span className="text-amber-500 text-xs">⭐</span>}
                  </div>
                )
              })}
              {state.currentMapStop + 2 < LESSONS.length && (
                <div className="text-center py-2">
                  <span className="text-coffee-400/30 text-xs">... more adventures ahead ...</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <Link href="/garden" className="bg-white rounded-xl p-3.5 border border-sand tap-scale hover:border-leaf-400 transition-colors">
              <p className="text-lg mb-1">🌱</p>
              <p className="font-semibold text-sm text-coffee-800">ግንል</p>
              <p className="text-[11px] text-coffee-400">Word Garden</p>
              {gardenHasWilting && <span className="inline-block w-2 h-2 bg-coral-500 rounded-full mt-1" />}
            </Link>
            {state.lessonsCompleted >= 7 && (
              <Link href="/teach" className="bg-white rounded-xl p-3.5 border border-sand tap-scale hover:border-amber-300 transition-colors">
                <p className="text-lg mb-1">👩‍🏫</p>
                <p className="font-semibold text-sm text-coffee-800">አስተምር</p>
                <p className="text-[11px] text-coffee-400">Teach Mode</p>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: state.level, l: 'ደረጃ' },
              { v: state.wordsLearned.length, l: 'ቃላት' },
              { v: state.streakDays, l: 'ቀናት' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-lg p-2.5 text-center border border-sand">
                <p className="text-lg font-bold text-coffee-800">{s.v}</p>
                <p className="text-[9px] text-coffee-400 uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // WELCOME (PRE-ONBOARD)
  // ==========================================
  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      <div className="alpha-bg" />
      <div className="warm-glow fixed inset-0" />

      <div className="absolute top-4 right-4 z-20">
        <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Soli entrance */}
        <div className={`mb-4 transition-all duration-700 ${soliIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
          <div className="animate-float">
            <Soli mood="wave" size="xl" speaking={audio.speaking} />
          </div>
        </div>

        {/* Name */}
        <div className={`text-center transition-all duration-600 ${soliIn ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl font-bold text-coffee-800 tracking-tight">Soli</h1>
          <p className="text-xl text-amber-500/60 font-serif">ሶሊ</p>
          <p className="text-sm text-coffee-400 mt-1">የእንግሊዝኛ መምህርዎ</p>
        </div>

        {/* Speech bubble */}
        <div className={`mt-6 w-full flex justify-center transition-all duration-600 ${bubbleIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {bubbleIn && (
            <SoliBubble
              text="ሰላም! እኔ ሶሊ ነኝ! የእንግሊዝኛ መምህርዎ ነኝ። ዝግጁ ነዎት?"
              sub="Hello! I'm Soli! I'm your English teacher. Ready?"
            />
          )}
        </div>

        {/* CTA */}
        <div className={`mt-8 w-full max-w-xs transition-all duration-600 ${btnIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/onboard"
            className="block w-full bg-amber-500 hover:bg-amber-400 text-white rounded-2xl py-4 text-center text-lg font-bold shadow-lg shadow-amber-500/25 tap-scale transition-all">
            ሰላም ሶሊ! 👋
          </Link>
          <p className="text-center text-coffee-400/40 text-xs mt-4">መለያ አያስፈልግም። ነፃ ነው።</p>
          <p className="text-center text-coffee-400/30 text-[10px] mt-0.5">No account needed. Free.</p>
        </div>

        {/* Flags */}
        <div className={`flex justify-center items-center gap-5 mt-10 transition-all duration-600 delay-500 ${btnIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center"><p className="text-xl">🇪🇹</p><p className="text-[10px] text-coffee-400/30">አማርኛ</p></div>
          <div className="w-6 h-px bg-amber-300/30" />
          <span className="text-amber-300/30 text-[10px]">⟷</span>
          <div className="w-6 h-px bg-amber-300/30" />
          <div className="text-center"><p className="text-xl">🇬🇧</p><p className="text-[10px] text-coffee-400/30">English</p></div>
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'እንደምን አደሩ'
  if (h < 17) return 'እንደምን ዋሉ'
  return 'እንደምን አመሹ'
}
