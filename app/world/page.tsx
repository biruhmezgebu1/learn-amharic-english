'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useStore } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import { useTimer } from '@/lib/timer'
import { CHAPTERS, Chapter, Beat } from '@/content/chapters'
import Soli from '@/components/Soli'
import { SoliBubble, Confetti, StarCounter } from '@/components/UI'
import Paywall from '@/components/Paywall'
import { useRouter } from 'next/navigation'

export default function WorldPage() {
  const { state, addStars, learnWord, recordActivity, update } = useStore()
  const audio = useAudio()
  const timer = useTimer()
  const router = useRouter()

  const [chapterIdx, setChapterIdx] = useState(0)
  const [beatIdx, setBeatIdx] = useState(0)
  const [bubbleReady, setBubbleReady] = useState(false)
  const [objectsDone, setObjectsDone] = useState<Set<string>>(new Set())
  const [showWord, setShowWord] = useState<{ en: string; am: string } | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [roomLit, setRoomLit] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [dragItem, setDragItem] = useState<string | null>(null)
  const [sillyMode, setSillyMode] = useState(false)
  const [doorOpened, setDoorOpened] = useState(false)
  const timeoutRef = useRef<any>(null)

  const chapter = CHAPTERS[chapterIdx]
  const beat = chapter?.beats[beatIdx]
  const isLastChapter = chapterIdx >= CHAPTERS.length - 1
  const isExitChapter = chapter?.id === 'exit'

  // Auto-speak on beat change
  useEffect(() => {
    setBubbleReady(false)
    setShowWord(null)
    setSillyMode(false)
    if (beat?.speakEn) {
      const t = setTimeout(() => audio.speak(beat.speakEn as string, 'en-US', 0.75), 600)
      return () => clearTimeout(t)
    }
  }, [chapterIdx, beatIdx])

  // Auto-advance beats
  useEffect(() => {
    if (beat?.autoAdvance && beat.autoAdvance > 0 && bubbleReady) {
      timeoutRef.current = setTimeout(advanceBeat, beat.autoAdvance)
      return () => clearTimeout(timeoutRef.current)
    }
  }, [bubbleReady, beatIdx, chapterIdx])

  const triggerCelebrate = useCallback(() => {
    setConfetti(true)
    setShaking(true)
    addStars(1)
    setTimeout(() => { setConfetti(false); setShaking(false) }, 1500)
  }, [addStars])

  const advanceBeat = useCallback(() => {
    if (beatIdx < chapter.beats.length - 1) {
      setBeatIdx(prev => prev + 1)
    } else {
      // Chapter complete
      chapter.wordsLearned.forEach(w => learnWord(w))
      addStars(10)
      recordActivity(2)

      if (isExitChapter) {
        // Check paywall
        if (timer.expired || !timer.isPaid()) {
          setDoorOpened(true)
          setTimeout(() => setShowPaywall(true), 2000)
        } else {
          // Paid user: go to post-paywall content
          update({ hasCompletedFirstAdventure: true })
          router.push('/celebrate')
        }
      } else if (chapterIdx < CHAPTERS.length - 1) {
        setChapterIdx(prev => prev + 1)
        setBeatIdx(0)
        setObjectsDone(new Set())
        setRoomLit(chapter.id !== 'living') // living room starts dark
      }
    }
  }, [beatIdx, chapter, chapterIdx, isExitChapter, timer, learnWord, addStars, recordActivity, router, update])

  const handleObjectTap = useCallback((objId: string) => {
    if (!beat) return

    // Special: light switch in living room
    if (objId === 'light' && beat.targetObject === 'light') {
      setRoomLit(true)
      audio.speakEnglish('Light')
      if (beat.wordReveal) {
        setShowWord(beat.wordReveal)
        setTimeout(() => setShowWord(null), 2000)
      }
      triggerCelebrate()
      setTimeout(advanceBeat, 1500)
      return
    }

    // Check if this is the target object for the current beat
    if (beat.targetObject === objId && beat.targetAction === 'tap') {
      setObjectsDone(prev => new Set(prev).add(objId))
      audio.speakEnglish(chapter.objects.find(o => o.id === objId)?.en || objId)
      if (beat.wordReveal) {
        setShowWord(beat.wordReveal)
        setTimeout(() => setShowWord(null), 2000)
      }
      triggerCelebrate()
      setTimeout(advanceBeat, 1500)
      return
    }

    // Free exploration: tap any sparkly object
    const obj = chapter.objects.find(o => o.id === objId)
    if (obj && obj.sparkle && !objectsDone.has(objId) && !beat.targetObject) {
      setObjectsDone(prev => new Set(prev).add(objId))
      audio.speakEnglish(obj.en)
      setShowWord({ en: obj.en, am: obj.am })
      setTimeout(() => setShowWord(null), 2000)
      addStars(1)
      // If all sparkly objects tapped, advance
      const sparkly = chapter.objects.filter(o => o.sparkle)
      const allDone = sparkly.every(o => objectsDone.has(o.id) || o.id === objId)
      if (allDone) setTimeout(advanceBeat, 1500)
      return
    }

    // Wrong object
    if (beat.targetObject && beat.targetObject !== objId) {
      setSillyMode(true)
      audio.speak('Oops!', 'en-US', 1)
      setShaking(true)
      setTimeout(() => { setSillyMode(false); setShaking(false) }, 800)
    }
  }, [beat, chapter, objectsDone, audio, triggerCelebrate, advanceBeat, addStars])

  const handleDragToSoli = useCallback((objId: string) => {
    if (!beat) return
    if (beat.targetObject === objId && beat.targetAction === 'drag') {
      setObjectsDone(prev => new Set(prev).add(objId))
      setDragItem(null)
      audio.speakEnglish(chapter.objects.find(o => o.id === objId)?.en || objId)
      if (beat.wordReveal) {
        setShowWord(beat.wordReveal)
        setTimeout(() => setShowWord(null), 2000)
      }
      triggerCelebrate()
      setTimeout(advanceBeat, 1500)
    }
  }, [beat, chapter, audio, triggerCelebrate, advanceBeat])

  const handlePaywallUnlock = useCallback(() => {
    timer.unlock()
    setShowPaywall(false)
    update({ hasCompletedFirstAdventure: true })
    router.push('/celebrate')
  }, [timer, update, router])

  if (!chapter) return null

  // Paywall overlay
  if (showPaywall) {
    return <Paywall onUnlock={handlePaywallUnlock} childName={state.name} />
  }

  // Exit door opened - beautiful outside world reveal
  if (doorOpened && !showPaywall) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: chapter.bgGradient }}>
        <Confetti active={confetti} />
        {/* Beautiful outside world */}
        <div className="absolute inset-0">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100" />
          {/* Mountains */}
          <div className="absolute bottom-[30%] left-0 right-0">
            <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none">
              <path d="M 0,100 L 50,40 L 100,70 L 150,25 L 200,60 L 250,30 L 300,55 L 350,20 L 400,50 L 400,100 Z" fill="#7BAF6E" opacity="0.6"/>
              <path d="M 0,100 L 80,55 L 140,75 L 200,45 L 280,65 L 340,40 L 400,60 L 400,100 Z" fill="#5A8F4E" opacity="0.5"/>
            </svg>
          </div>
          {/* Street */}
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-amber-200 to-amber-100" />
          {/* Market stalls in distance */}
          <div className="absolute bottom-[30%] left-[20%] flex gap-4">
            <div className="text-3xl">🏪</div>
            <div className="text-3xl">🏪</div>
            <div className="text-2xl">🏬</div>
          </div>
          {/* Birds */}
          <div className="absolute top-[15%] left-[30%] text-lg animate-drift">🐦</div>
          <div className="absolute top-[10%] right-[25%] text-sm animate-drift" style={{ animationDelay: '2s' }}>🐦</div>
          {/* Sun */}
          <div className="absolute top-[8%] right-[15%] text-4xl">☀️</div>
        </div>
        {/* Soli mid-step */}
        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 z-10">
          <Soli mood="wave" size="xl" speaking={audio.speaking} />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${shaking ? 'screen-shake' : ''}`}
      style={{ background: chapter.id === 'living' && !roomLit ? '#1A1008' : chapter.bgGradient }}>
      <Confetti active={confetti} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-3 flex items-center gap-2">
        <button onClick={() => router.push('/')} className="text-white/50 text-xs tap-scale bg-black/20 rounded-full px-2 py-1">✕</button>
        <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${((chapterIdx * 10 + beatIdx) / (CHAPTERS.length * 8)) * 100}%` }} />
        </div>
        <StarCounter stars={state.stars} />
        <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
      </div>

      {/* Room title */}
      <div className="absolute top-12 left-0 right-0 z-20 text-center">
        <span className="bg-black/20 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur">{chapter.room}</span>
      </div>

      {/* Interactive objects */}
      <div className="absolute inset-0 z-10">
        {chapter.objects.map(obj => {
          const done = objectsDone.has(obj.id)
          const isTarget = beat?.targetObject === obj.id
          const showSparkle = (obj.sparkle && !done && !beat?.targetObject) || isTarget
          return (
            <button key={obj.id}
              onClick={() => obj.action === 'tap' ? handleObjectTap(obj.id) : setDragItem(obj.id)}
              className={`absolute flex flex-col items-center transition-all duration-300 tap-scale ${done ? 'opacity-40' : ''} ${showSparkle ? 'animate-pulse' : ''}`}
              style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: 'translate(-50%, -50%)' }}>
              <span className={`text-4xl ${isTarget ? 'animate-bounce' : ''}`}>{obj.emoji}</span>
              {showSparkle && <span className="text-[8px] text-amber-400 mt-0.5">✨</span>}
              {done && <span className="text-[10px] font-bold text-amber-700 bg-white/80 px-1.5 rounded-full">{obj.en}</span>}
            </button>
          )
        })}
      </div>

      {/* Drag item follows finger / shows drag prompt */}
      {dragItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
          onClick={() => { handleDragToSoli(dragItem); }}>
          <div className="text-center animate-bounce-in">
            <span className="text-6xl">{chapter.objects.find(o => o.id === dragItem)?.emoji}</span>
            <p className="text-white text-sm font-bold mt-2 bg-black/40 rounded-full px-3 py-1">
              Tap to give to Soli!
            </p>
          </div>
        </div>
      )}

      {/* Soli + speech bubble */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4">
        <div className="flex items-end gap-3">
          <Soli mood={(sillyMode ? 'silly' : beat?.soliMood || 'smile') as any} size="lg" speaking={audio.speaking} />
          <div className="flex-1 mb-2">
            {beat && beat.soliSays && (
              <SoliBubble
                key={`${chapterIdx}-${beatIdx}`}
                text={beat.soliSays}
                sub={beat.soliSub}
                onDone={() => setBubbleReady(true)}
              />
            )}
          </div>
        </div>

        {/* Word reveal card */}
        {showWord && (
          <div className="mt-2 bg-white rounded-2xl px-5 py-3 shadow-lg border border-amber-200 text-center animate-scale-pop">
            <p className="text-2xl font-bold text-amber-700">{showWord.en}</p>
            <p className="text-sm text-coffee-400 font-serif">{showWord.am}</p>
            <span className="text-amber-400 text-sm">⭐ +1</span>
          </div>
        )}

        {/* Continue button for beats with no target object */}
        {bubbleReady && !beat?.targetObject && !beat?.autoAdvance && (
          <button onClick={advanceBeat}
            className="mt-3 w-full bg-amber-500 text-white rounded-2xl py-3.5 font-bold text-base shadow-lg shadow-amber-500/25 tap-scale">
            ቀጥል / Continue →
          </button>
        )}
      </div>
    </div>
  )
}
