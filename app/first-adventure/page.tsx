'use client'
import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { SoliBubble, Confetti, WordCard } from '@/components/UI'
import { useRouter } from 'next/navigation'

type GamePhase = 'intro' | 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'done'

const WORDS = [
  { en: 'Hello', am: 'ሰላም' },
  { en: 'Thank you', am: 'አመሰግናለሁ' },
  { en: 'My name is', am: 'ስሜ... ነው' },
]

export default function FirstAdventurePage() {
  const { state, update, addStars, learnWord, recordActivity } = useStore()
  const audio = useAudio()
  const router = useRouter()
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [bubbleReady, setBubbleReady] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [shaking, setShaking] = useState(false)

  // Game 1 state
  const [g1Options] = useState(['ሰላም', 'አመሰግናለሁ', 'ይቅርታ'])
  const [g1Popped, setG1Popped] = useState(-1)

  // Game 2 state
  const [g2WordIndex, setG2WordIndex] = useState(0)
  const [g2Said, setG2Said] = useState(false)

  // Game 3 state
  const [g3Round, setG3Round] = useState(0)
  const [g3Options, setG3Options] = useState(['Hello', 'Thank you', 'Sorry'])
  const [g3Correct, setG3Correct] = useState(-1)
  const [g3Wrong, setG3Wrong] = useState(-1)

  // Game 4 state
  const [g4Words] = useState(['My', 'name', 'is'])
  const [g4Selected, setG4Selected] = useState<string[]>([])
  const [g4Done, setG4Done] = useState(false)

  const totalSteps = 6
  const currentStep = { intro: 0, game1: 1, game2: 2, game3: 3, game4: 4, game5: 5, done: 6 }[phase]

  useEffect(() => { setBubbleReady(false) }, [phase])

  // Auto-speak on phase change
  useEffect(() => {
    const timers: any[] = []
    if (phase === 'intro') {
      timers.push(setTimeout(() => audio.speak("Hello! I need your help today! Let's go to the neighborhood!", 'en-US', 0.8), 2000))
    }
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const triggerShake = () => { setShaking(true); setTimeout(() => setShaking(false), 400) }

  const triggerCelebrate = () => {
    setShowConfetti(true)
    triggerShake()
    addStars(3)
    setTimeout(() => setShowConfetti(false), 2500)
  }

  // ===== GAME 1: Pop the right bubble =====
  const renderGame1 = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <Soli mood={g1Popped >= 0 ? 'celebrate' : 'think'} size="lg" speaking={audio.speaking} className="mb-4" />
      <SoliBubble text='ሰው "Hello!" አለ። "ሰላም" የትኛው ነው? ብትንኳኳ!' sub='Someone said "Hello!" Tap the bubble that means ሰላም!'
        onDone={() => { setBubbleReady(true); audio.speakEnglish('Hello') }} />
      {bubbleReady && g1Popped < 0 && (
        <div className="flex gap-4 mt-8">
          {g1Options.map((opt, i) => (
            <button key={i} onClick={() => {
              if (opt === 'ሰላም') {
                setG1Popped(i)
                audio.speak('Correct! Hello means selam!', 'en-US', 0.8)
                triggerCelebrate()
                setTimeout(() => setPhase('game2'), 2000)
              } else {
                audio.speak('Oops!', 'en-US', 0.9)
                triggerShake()
              }
            }}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold transition-all tap-scale ${
                g1Popped === i ? 'bg-amber-200 scale-125 pop-out' :
                'bg-sky-100 border-2 border-sky-300 hover:bg-sky-200 bubble-float'
              }`} style={{ animationDelay: `${i * 0.3}s` }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  // ===== GAME 2: Echo game (say it loud) =====
  const renderGame2 = () => {
    const w = WORDS[g2WordIndex]
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Soli mood={g2Said ? 'celebrate' : 'encourage'} size="lg" speaking={audio.speaking} className="mb-4" />
        <SoliBubble text={`"${w.en}" ይበሉ! በድምፅ!`} sub={`Say "${w.en}" out loud!`} onDone={() => setBubbleReady(true)} />
        {bubbleReady && (
          <div className="mt-6 text-center">
            <WordCard word={w.en} meaning={w.am} onListen={() => audio.speakEnglish(w.en)} />
            {!g2Said ? (
              <button onClick={() => {
                setG2Said(true)
                audio.speak('Amazing!', 'en-US', 0.9)
                triggerCelebrate()
                learnWord(w.en.toLowerCase().replace(/\s+/g, ''))
                setTimeout(() => {
                  if (g2WordIndex < 2) {
                    setG2WordIndex(prev => prev + 1)
                    setG2Said(false)
                    setBubbleReady(false)
                  } else {
                    setPhase('game3')
                  }
                }, 1800)
              }} className="mt-6 bg-teal-500 text-white rounded-2xl py-4 px-8 text-lg font-bold shadow-lg shadow-teal-500/25 tap-scale">
                ✓ ተናገርኩ! / I said it!
              </button>
            ) : (
              <div className="mt-4">
                <Soli mood="celebrate" size="sm" />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // ===== GAME 3: Bubble pop quiz =====
  const renderGame3 = () => {
    const prompts = [
      { am: 'ሰላም', correct: 'Hello' },
      { am: 'አመሰግናለሁ', correct: 'Thank you' },
    ]
    const current = prompts[g3Round]
    if (!current) { setPhase('game4'); return null }

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Soli mood={g3Correct >= 0 ? 'celebrate' : g3Wrong >= 0 ? 'silly' : 'think'} size="lg" speaking={audio.speaking} className="mb-4" />
        <SoliBubble text={`"${current.am}" በእንግሊዝኛ ምን ይባላል?`} sub={`What is "${current.am}" in English?`}
          onDone={() => { setBubbleReady(true); audio.speak(`What is ${current.am} in English?`, 'en-US', 0.8) }} />
        {bubbleReady && g3Correct < 0 && (
          <div className="flex flex-col gap-2 mt-6 w-full max-w-xs">
            {g3Options.map((opt, i) => (
              <button key={i} onClick={() => {
                if (opt === current.correct) {
                  setG3Correct(i)
                  audio.speak('Correct!', 'en-US')
                  triggerCelebrate()
                  setTimeout(() => {
                    setG3Round(prev => prev + 1)
                    setG3Correct(-1); setG3Wrong(-1)
                    setBubbleReady(false)
                  }, 1800)
                } else {
                  setG3Wrong(i)
                  audio.speak('Almost! Try again!', 'en-US')
                  triggerShake()
                  setTimeout(() => setG3Wrong(-1), 800)
                }
              }}
                className={`py-4 px-5 rounded-xl border-2 text-base font-semibold tap-scale transition-all ${
                  g3Correct === i ? 'border-teal-400 bg-teal-50 text-teal-800' :
                  g3Wrong === i ? 'border-coral-400 bg-coral-50 text-coral-500 animate-wiggle' :
                  'border-sand bg-white text-coffee-800 hover:border-amber-300'
                }`}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ===== GAME 4: Build the sentence =====
  const renderGame4 = () => {
    const scrambled = ['is', 'My', 'name']
    const correct = ['My', 'name', 'is']
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Soli mood={g4Done ? 'celebrate' : 'encourage'} size="lg" speaking={audio.speaking} className="mb-4" />
        <SoliBubble text='ዓረፍተ ነገሩን ያዋቅሩ! "My name is..." ያስቀምጡ!'
          sub='Build the sentence: "My name is..."'
          onDone={() => setBubbleReady(true)} />
        {bubbleReady && !g4Done && (
          <div className="mt-6 w-full max-w-xs">
            {/* Drop zone */}
            <div className="min-h-[56px] bg-white rounded-xl p-3 border-2 border-dashed border-sand mb-4 text-center">
              {g4Selected.length > 0 ? (
                <p className="text-xl font-bold text-coffee-800">{g4Selected.join(' ')}{g4Selected.length === 3 ? ` ${state.name}` : ''}</p>
              ) : (
                <p className="text-coffee-400/40 text-sm">ከታች ቃላት ይምረጡ</p>
              )}
            </div>
            {/* Word blocks */}
            <div className="flex gap-2 justify-center flex-wrap">
              {scrambled.map((w, i) => {
                const used = g4Selected.includes(w)
                return (
                  <button key={i} disabled={used} onClick={() => {
                    const next = [...g4Selected, w]
                    setG4Selected(next)
                    if (next.length === 3) {
                      if (JSON.stringify(next) === JSON.stringify(correct)) {
                        setG4Done(true)
                        audio.speak(`My name is ${state.name}!`, 'en-US', 0.7)
                        triggerCelebrate()
                        setTimeout(() => setPhase('game5'), 2500)
                      } else {
                        audio.speak('Almost! Try again!', 'en-US')
                        triggerShake()
                        setTimeout(() => setG4Selected([]), 800)
                      }
                    }
                  }}
                    className={`px-6 py-3 rounded-xl border-2 font-bold text-lg tap-scale transition-all ${
                      used ? 'opacity-20 border-sand' : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}>
                    {w}
                  </button>
                )
              })}
            </div>
            {g4Selected.length > 0 && !g4Done && (
              <button onClick={() => setG4Selected([])} className="block mx-auto mt-3 text-xs text-coffee-400">↩ ዳግም / Reset</button>
            )}
          </div>
        )}
      </div>
    )
  }

  // ===== GAME 5: The payoff scene =====
  const renderGame5 = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <Soli mood="celebrate" size="xl" speaking={audio.speaking} className="mb-4" />
      <SoliBubble
        text={`አያችሁ! አረዳችሁኝ! "Hello! My name is Soli. Thank you, ${state.name}!"`}
        sub={`You see? You helped me! "Hello! My name is Soli. Thank you, ${state.name}!"`}
        onDone={() => {
          setBubbleReady(true)
          audio.speak(`Hello! My name is Soli. Thank you, ${state.name}!`, 'en-US', 0.7)
          triggerCelebrate()
        }}
      />
      {bubbleReady && (
        <button onClick={() => {
          update({ hasCompletedFirstAdventure: true })
          addStars(10)
          recordActivity(3)
          router.push('/celebrate')
        }} className="mt-8 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl py-4 px-8 text-lg font-bold shadow-lg tap-scale">
          🎉 ጨርሻለሁ! / Finished! →
        </button>
      )}
    </div>
  )

  // ===== INTRO =====
  const renderIntro = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <Soli mood="wave" size="xl" speaking={audio.speaking} className="mb-4" />
      <SoliBubble
        text="እኔ ዛሬ ወደ ሰፈር እየሄድኩ ነው። ግን እንግሊዝኛ አላውቅም! ትረዳኛለህ?"
        sub="I'm going to the neighborhood today. But I don't know English! Will you help me?"
        onDone={() => setBubbleReady(true)}
      />
      {bubbleReady && (
        <button onClick={() => setPhase('game1')}
          className="mt-6 bg-amber-500 text-white rounded-2xl py-4 px-8 text-lg font-bold shadow-lg shadow-amber-500/25 tap-scale">
          አዎ! እረዳሃለሁ! / Yes! I'll help! 💪
        </button>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen bg-cream flex flex-col max-w-lg mx-auto relative ${shaking ? 'screen-shake' : ''}`}>
      <div className="alpha-bg" />
      <Confetti active={showConfetti} />

      {/* Progress */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-coffee-400/40 text-sm tap-scale">✕</button>
          <div className="flex-1 h-2.5 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
          <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
        </div>
      </div>

      {/* Game content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {phase === 'intro' && renderIntro()}
        {phase === 'game1' && renderGame1()}
        {phase === 'game2' && renderGame2()}
        {phase === 'game3' && renderGame3()}
        {phase === 'game4' && renderGame4()}
        {phase === 'game5' && renderGame5()}
      </div>
    </div>
  )
}
