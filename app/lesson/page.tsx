'use client'
import { useState, useEffect } from 'react'
import { useStore, createCard, loadGarden, saveGarden } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { SoliBubble, Confetti, WordCard } from '@/components/UI'
import { LESSONS, getWord } from '@/content/vocabulary'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Phase = 'story' | 'input' | 'notice' | 'practice' | 'produce' | 'celebrate'

export default function LessonPage() {
  const { state, addStars, learnWord, completeLesson, recordActivity } = useStore()
  const audio = useAudio()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('story')
  const [ready, setReady] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [quizIdx, setQuizIdx] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [score, setScore] = useState(0)

  const lesson = LESSONS[Math.min(state.currentMapStop, LESSONS.length - 1)]
  const words = lesson.words.map(id => getWord(id)).filter(Boolean) as any[]
  const currentWord = words[wordIdx]

  useEffect(() => { setReady(false) }, [phase])

  const celebrate = () => { setConfetti(true); addStars(3); setTimeout(() => setConfetti(false), 2000) }

  const phases: Phase[] = ['story', 'input', 'notice', 'practice', 'produce', 'celebrate']
  const phaseIdx = phases.indexOf(phase)
  const progress = ((phaseIdx + 1) / phases.length) * 100

  return (
    <div className="min-h-screen bg-cream flex flex-col max-w-lg mx-auto relative">
      <div className="alpha-bg" />
      <Confetti active={confetti} />

      {/* Progress */}
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-coffee-400/40 text-sm tap-scale">✕</Link>
          <div className="flex-1 h-2.5 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
        </div>
      </div>

      {/* PHASE: Story (Activation + narrative) */}
      {phase === 'story' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood="smile" size="xl" speaking={audio.speaking} className="mb-4" />
          <SoliBubble text={lesson.storyAm} sub={lesson.storyEn} onDone={() => {
            setReady(true)
            audio.speak(lesson.storyEn, 'en-US', 0.8)
          }} />
          {ready && (
            <button onClick={() => setPhase('input')}
              className="mt-6 bg-amber-500 text-white rounded-2xl py-4 px-8 text-lg font-bold shadow-lg tap-scale">
              {lesson.emoji} እንሂድ! / Let's go!
            </button>
          )}
        </div>
      )}

      {/* PHASE: Input (new words) */}
      {phase === 'input' && currentWord && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood="speak" size="lg" speaking={audio.speaking} className="mb-4" />
          <SoliBubble text={`"${currentWord.en}" ማለት "${currentWord.am}" ነው!`} sub={`"${currentWord.en}" means "${currentWord.am}"`} onDone={() => {
            setReady(true)
            audio.speakEnglish(currentWord.en)
          }} />
          {ready && (
            <div className="mt-4 w-full max-w-xs">
              <WordCard word={currentWord.en} meaning={currentWord.am} onListen={() => audio.speakEnglish(currentWord.en)} />
              <button onClick={() => {
                learnWord(currentWord.id)
                if (wordIdx < words.length - 1) {
                  setWordIdx(prev => prev + 1)
                  setReady(false)
                } else {
                  setPhase('notice')
                  setReady(false)
                }
              }} className="mt-4 w-full bg-coffee-800 text-white rounded-2xl py-3 font-bold tap-scale">
                ቀጥል / Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE: Notice (pattern highlight) */}
      {phase === 'notice' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood="think" size="lg" speaking={audio.speaking} className="mb-4" />
          <SoliBubble text="ልብ ብለዋል? በእንግሊዝኛ ቃላቱ ቅደም ተከተል ይለያል!"
            sub="Did you notice? In English, the word order is different!" onDone={() => {
              setReady(true)
              audio.speak('Did you notice? In English, the word order is different!', 'en-US', 0.8)
            }} />
          {ready && (
            <div className="mt-6 bg-white rounded-2xl p-5 border border-sand w-full max-w-xs">
              <p className="text-sm text-coffee-400 mb-2">አማርኛ: ሰው → ባለሟ → ግስ (SOV)</p>
              <p className="text-sm text-amber-700 font-bold">English: Subject → Verb → Object (SVO)</p>
              <p className="text-xs text-coffee-400 mt-2">Example: "I want coffee" not "I coffee want"</p>
              <button onClick={() => { setPhase('practice'); setReady(false); setQuizIdx(0) }}
                className="mt-4 w-full bg-coffee-800 text-white rounded-xl py-3 font-bold tap-scale">
                ገባኝ! / Got it! →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE: Practice (quiz) */}
      {phase === 'practice' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood={answered ? (correct ? 'celebrate' : 'silly') : 'think'} size="lg" speaking={audio.speaking} className="mb-4" />
          {quizIdx < words.length ? (() => {
            const w = words[quizIdx]
            const options = [w.en, ...words.filter((x: any) => x.id !== w.id).slice(0, 2).map((x: any) => x.en)].sort(() => Math.random() - 0.5)
            return <>
              <SoliBubble text={`"${w.am}" በእንግሊዝኛ?`} sub={`What is "${w.am}" in English?`} onDone={() => setReady(true)} />
              {ready && !answered && (
                <div className="mt-4 w-full max-w-xs space-y-2">
                  {options.map((opt: string, i: number) => (
                    <button key={`${quizIdx}-${i}`} onClick={() => {
                      const isRight = opt === w.en
                      setCorrect(isRight)
                      setAnswered(true)
                      if (isRight) { celebrate(); setScore(prev => prev + 1); audio.speak('Correct!', 'en-US') }
                      else { audio.speak('Almost!', 'en-US') }
                      setTimeout(() => {
                        setAnswered(false)
                        setReady(false)
                        if (quizIdx < words.length - 1) setQuizIdx(prev => prev + 1)
                        else setPhase('produce')
                      }, 1500)
                    }}
                      className={`w-full py-3.5 px-5 rounded-xl border-2 font-semibold tap-scale transition-all ${
                        answered && opt === w.en ? 'border-teal-400 bg-teal-50' :
                        answered ? 'opacity-30 border-sand' :
                        'border-sand bg-white hover:border-amber-300'
                      }`}>{opt}</button>
                  ))}
                </div>
              )}
            </>
          })() : null}
        </div>
      )}

      {/* PHASE: Produce (use in context) */}
      {phase === 'produce' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood="encourage" size="lg" speaking={audio.speaking} className="mb-4" />
          <SoliBubble text={`አሁን ሶሊን ረዱ! "${lesson.titleEn}" ውስጥ ምን ይላሉ?`}
            sub={`Now help Soli! What do you say at "${lesson.titleEn}"?`}
            onDone={() => {
              setReady(true)
              audio.speak(`Help Soli at the ${lesson.titleEn}! What do you say?`, 'en-US', 0.8)
            }} />
          {ready && (
            <div className="mt-4 w-full max-w-xs space-y-2">
              {words.slice(0, 3).map((w: any, i: number) => (
                <button key={i} onClick={() => {
                  audio.speakEnglish(w.en, () => {
                    if (i === 2) {
                      celebrate()
                      setTimeout(() => setPhase('celebrate'), 1500)
                    }
                  })
                }}
                  className="w-full py-3 px-5 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-800 font-semibold tap-scale hover:bg-amber-100 transition-all">
                  🗣️ "{w.en}"
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PHASE: Celebrate (consolidation) */}
      {phase === 'celebrate' && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
          <Soli mood="celebrate" size="xl" speaking={audio.speaking} className="mb-4" />
          <SoliBubble text={`በጣም ጥሩ! ዛሬ ${words.length} ቃላት ተማሩ!`}
            sub={`Great job! You learned ${words.length} words today!`}
            onDone={() => {
              setReady(true)
              audio.speak(`Great job! You learned ${words.length} words today!`, 'en-US', 0.8)
              // Plant seeds in garden
              const garden = loadGarden()
              words.forEach((w: any) => {
                if (!garden.find((c: any) => c.id === w.id)) {
                  garden.push(createCard(w.id))
                }
              })
              saveGarden(garden)
              completeLesson()
              addStars(10)
              recordActivity(5)
            }} />
          {ready && (
            <div className="mt-6">
              <div className="bg-white rounded-2xl p-4 border border-sand mb-4">
                <p className="text-xs text-coffee-400 mb-2">🌱 New seeds planted:</p>
                <div className="flex flex-wrap gap-2">
                  {words.map((w: any, i: number) => (
                    <span key={i} className="bg-leaf-400/10 text-leaf-500 px-3 py-1 rounded-full text-xs font-semibold">{w.en}</span>
                  ))}
                </div>
              </div>
              <Link href="/"
                className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl py-4 text-center text-lg font-bold shadow-lg tap-scale">
                ወደ ጉዞው → / Back to Map
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
