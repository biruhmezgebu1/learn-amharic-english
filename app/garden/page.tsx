'use client'
import { useState, useEffect } from 'react'
import { useStore, loadGarden, saveGarden, getWiltingCards, waterCard, SRSCard } from '@/lib/store'
import { useAudio, MuteBtn } from '@/lib/audio'
import Soli from '@/components/Soli'
import { Confetti } from '@/components/UI'
import { getWord } from '@/content/vocabulary'
import Link from 'next/link'

const FLOWER_STAGES = ['🌰', '🌱', '🪴', '🌿', '🌸', '🌻']
function flowerStage(reviews: number) { return FLOWER_STAGES[Math.min(reviews, FLOWER_STAGES.length - 1)] }
function isWilting(card: SRSCard) { return new Date(card.due) <= new Date() }

export default function GardenPage() {
  const { state, addStars } = useStore()
  const audio = useAudio()
  const [garden, setGarden] = useState<SRSCard[]>([])
  const [wilting, setWilting] = useState<SRSCard[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [mode, setMode] = useState<'garden' | 'water'>('garden')

  useEffect(() => {
    const g = loadGarden()
    setGarden(g)
    setWilting(getWiltingCards(g))
  }, [])

  const startWatering = () => {
    if (wilting.length === 0) return
    setMode('water')
    setCurrentIdx(0)
    setupQuestion(0)
  }

  const setupQuestion = (idx: number) => {
    const card = wilting[idx]
    if (!card) return
    const word = getWord(card.id)
    if (!word) return
    const allWords = garden.map(c => getWord(c.id)).filter(Boolean) as any[]
    const wrong = allWords.filter((w: any) => w.id !== card.id).slice(0, 2).map((w: any) => w.en)
    const opts = [word.en, ...wrong].sort(() => Math.random() - 0.5)
    setOptions(opts)
    setAnswered(false)
    setCorrect(false)
    audio.speak(word.am, 'am-ET', 0.9)
  }

  const handleAnswer = (opt: string) => {
    const card = wilting[currentIdx]
    const word = getWord(card.id)
    if (!word) return
    const isCorrect = opt === word.en
    setCorrect(isCorrect)
    setAnswered(true)

    if (isCorrect) {
      audio.speak('Correct!', 'en-US')
      setConfetti(true)
      addStars(1)
      setTimeout(() => setConfetti(false), 1500)
      const updated = waterCard(card, 2)
      const newGarden = garden.map(c => c.id === updated.id ? updated : c)
      setGarden(newGarden)
      saveGarden(newGarden)
    } else {
      audio.speak(`It's ${word.en}!`, 'en-US', 0.7)
      const updated = waterCard(card, 1)
      const newGarden = garden.map(c => c.id === updated.id ? updated : c)
      setGarden(newGarden)
      saveGarden(newGarden)
    }

    setTimeout(() => {
      if (currentIdx < wilting.length - 1) {
        setCurrentIdx(prev => prev + 1)
        setupQuestion(currentIdx + 1)
      } else {
        setMode('garden')
        setWilting([])
      }
    }, 1800)
  }

  // GARDEN VIEW
  if (mode === 'garden') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-leaf-400/5 relative">
        <div className="alpha-bg" />
        <Confetti active={confetti} />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-coffee-400/40 text-sm tap-scale">← ተመለስ</Link>
            <h1 className="font-bold text-lg text-coffee-800 flex-1">🌱 የቃላት ግንል / Word Garden</h1>
            <MuteBtn muted={audio.muted} onToggle={audio.toggleMute} />
          </div>

          {/* Soli encouragement */}
          <div className="flex items-center gap-3 mb-4 bg-white rounded-2xl p-3 border border-sand">
            <Soli mood={wilting.length > 0 ? 'encourage' : 'smile'} size="sm" />
            <p className="text-sm text-coffee-700">
              {wilting.length > 0
                ? `${wilting.length} አበቦች ውሃ ይፈልጋሉ! / ${wilting.length} flowers need water!`
                : garden.length > 0
                ? 'ግንላችን ውብ ነው! / Our garden is beautiful!'
                : 'ትምህርት ጀምር ዘሮችን ለመትከል! / Start a lesson to plant seeds!'}
            </p>
          </div>

          {/* Water button */}
          {wilting.length > 0 && (
            <button onClick={startWatering}
              className="w-full bg-sky-400 text-white rounded-2xl py-4 mb-4 text-lg font-bold shadow-lg shadow-sky-400/25 tap-scale flex items-center justify-center gap-2">
              💧 ውሃ ስጥ / Water flowers ({wilting.length})
            </button>
          )}

          {/* Garden grid */}
          {garden.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {garden.map((card, i) => {
                const word = getWord(card.id)
                const wilt = isWilting(card)
                return (
                  <button key={i} onClick={() => { if (word) audio.speakEnglish(word.en) }}
                    className={`bg-white rounded-xl p-3 border text-center tap-scale transition-all ${
                      wilt ? 'border-coral-400/50 opacity-60' : 'border-sand hover:border-leaf-400'
                    }`}>
                    <p className={`text-2xl mb-1 ${wilt ? 'wilting' : ''}`}>{flowerStage(card.reviews)}</p>
                    <p className="text-[10px] font-semibold text-coffee-800 truncate">{word?.en || card.id}</p>
                    <p className="text-[8px] text-coffee-400 truncate">{word?.am}</p>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🌾</p>
              <p className="text-coffee-400">ገና ምንም ዘር አልተከለም</p>
              <p className="text-xs text-coffee-400/60">No seeds planted yet. Complete a lesson!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // WATERING MODE (active retrieval)
  const card = wilting[currentIdx]
  const word = card ? getWord(card.id) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300/10 to-cream flex flex-col max-w-lg mx-auto relative">
      <Confetti active={confetti} />
      <div className="relative z-10 px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('garden')} className="text-coffee-400/40 text-sm tap-scale">✕</button>
          <div className="flex-1 h-2.5 bg-sand rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / wilting.length) * 100}%` }} />
          </div>
          <span className="text-xs text-coffee-400">{currentIdx + 1}/{wilting.length}</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5">
        <Soli mood={answered ? (correct ? 'celebrate' : 'silly') : 'listen'} size="lg" speaking={audio.speaking} className="mb-4" />

        {word && (
          <>
            <div className="bg-white rounded-2xl px-8 py-6 shadow-lg border border-sand text-center mb-4">
              <p className="text-[10px] text-coffee-400 uppercase tracking-wider mb-2">💧 Water this flower</p>
              <p className={`text-3xl mb-1 ${isWilting(card) ? 'wilting' : ''}`}>{flowerStage(card.reviews)}</p>
              <p className="text-2xl font-bold text-coffee-800 font-serif">{word.am}</p>
              <p className="text-xs text-coffee-400 mt-1">{word.phonetic}</p>
            </div>

            {!answered && (
              <div className="w-full max-w-xs space-y-2">
                <p className="text-xs text-coffee-400 text-center mb-2">በእንግሊዝኛ ምን ይባላል? / What is it in English?</p>
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)}
                    className="w-full py-3.5 px-5 rounded-xl border-2 border-sand bg-white font-semibold tap-scale hover:border-sky-300 transition-all">
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {answered && (
              <div className="text-center">
                <p className={`text-lg font-bold ${correct ? 'text-teal-600' : 'text-coral-500'}`}>
                  {correct ? '💧 ✓ ውሃ ሰጠሁ!' : `✗ "${word.en}" ነው!`}
                </p>
                {correct && <p className="text-sm text-coffee-400 mt-1 grow-in">🌱 Flower is growing!</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
