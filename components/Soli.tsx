'use client'
import { useState, useEffect, useRef } from 'react'

export type SoliMood = 'smile' | 'wave' | 'celebrate' | 'think' | 'encourage' | 'listen' | 'speak' | 'silly' | 'surprised' | 'sleepy'

interface Props {
  mood?: SoliMood
  size?: 'sm' | 'md' | 'lg' | 'xl'
  speaking?: boolean
  className?: string
  outfit?: string
}

export default function Soli({ mood = 'smile', size = 'md', speaking = false, className = '', outfit = 'default' }: Props) {
  const [blink, setBlink] = useState(false)
  const [breathe, setBreathe] = useState(0)
  const [mouthOpen, setMouthOpen] = useState(false)
  const frameRef = useRef(0)

  // Breathing
  useEffect(() => {
    let f = 0
    const tick = () => { f++; setBreathe(Math.sin(f * 0.025) * 2); frameRef.current = requestAnimationFrame(tick) }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  // Blinking
  useEffect(() => {
    let t: any
    const doBlink = () => {
      setBlink(true)
      setTimeout(() => setBlink(false), 140)
      t = setTimeout(doBlink, 2500 + Math.random() * 3500)
    }
    t = setTimeout(doBlink, 1500)
    return () => clearTimeout(t)
  }, [])

  // Mouth sync
  useEffect(() => {
    if (!speaking) { setMouthOpen(false); return }
    let t: any
    const cycle = () => {
      setMouthOpen(true)
      t = setTimeout(() => { setMouthOpen(false); t = setTimeout(cycle, 70 + Math.random() * 90) }, 90 + Math.random() * 120)
    }
    cycle()
    return () => clearTimeout(t)
  }, [speaking])

  const active = speaking ? 'speak' : mood
  const W = { sm: 56, md: 100, lg: 140, xl: 180 }[size]
  const skin = '#C68642'
  const skinD = '#A86D2E'
  const hair = '#1A1008'
  const shirtColors: Record<string, string> = { default: '#2DB89F', chef: '#FFFFFF', lab: '#E8E8E8', habesha: '#C9A84C', pilot: '#2C3E6B' }
  const shirt = shirtColors[outfit] || shirtColors.default
  const shirtD = outfit === 'default' ? '#1FA088' : '#999'

  // Arms
  const leftArm = () => {
    switch (active) {
      case 'wave': return 'M 28,82 Q 14,68 8,50 Q 5,42 10,38'
      case 'celebrate': return 'M 28,82 Q 10,62 6,42 Q 3,32 8,26'
      case 'think': return 'M 28,82 Q 24,76 28,68 Q 30,62 34,58'
      case 'encourage': return 'M 28,82 Q 16,72 12,60 Q 9,52 13,46'
      case 'silly': return 'M 28,82 Q 10,75 5,85 Q 2,92 8,96'
      case 'surprised': return 'M 28,82 Q 16,74 14,66 Q 12,60 16,56'
      default: return 'M 28,82 Q 22,90 19,100'
    }
  }
  const rightArm = () => {
    switch (active) {
      case 'wave': return 'M 72,82 Q 78,90 81,100'
      case 'celebrate': return 'M 72,82 Q 90,62 94,42 Q 97,32 92,26'
      case 'silly': return 'M 72,82 Q 90,75 95,85 Q 98,92 92,96'
      case 'surprised': return 'M 72,82 Q 84,74 86,66 Q 88,60 84,56'
      case 'encourage': return 'M 72,82 Q 84,72 88,60 Q 90,52 87,46'
      default: return 'M 72,82 Q 78,90 81,100'
    }
  }

  // Eyes
  const renderEyes = () => {
    if (blink || active === 'sleepy') {
      const y = active === 'sleepy' ? 40 : 38
      return <><path d={`M 37,${y} Q 42,${y-2} 47,${y}`} stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round"/><path d={`M 53,${y} Q 58,${y-2} 63,${y}`} stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round"/></>
    }
    if (active === 'celebrate') {
      return <><path d="M 36,38 Q 42,33 48,38" stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M 52,38 Q 58,33 64,38" stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/></>
    }
    if (active === 'surprised') {
      return <><circle cx="42" cy="38" r="5.5" fill="white" stroke={hair} strokeWidth="1.5"/><circle cx="42" cy="38" r="3" fill={hair}/><circle cx="58" cy="38" r="5.5" fill="white" stroke={hair} strokeWidth="1.5"/><circle cx="58" cy="38" r="3" fill={hair}/></>
    }
    if (active === 'silly') {
      return <><ellipse cx="42" cy="38" rx="4" ry="4.5" fill="white"/><ellipse cx="42" cy="39" rx="2.5" ry="3" fill={hair}/><path d="M 54,36 Q 58,34 62,37" stroke={hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/></>
    }
    const px = active === 'think' ? -1.5 : active === 'listen' ? 0.5 : 0
    const py = active === 'think' ? -1 : 0
    return <>
      <ellipse cx="42" cy="38" rx="4.5" ry="5" fill="white"/>
      <ellipse cx="58" cy="38" rx="4.5" ry="5" fill="white"/>
      <ellipse cx={42 + px} cy={38 + py} rx="2.8" ry="3.2" fill={hair}/>
      <ellipse cx={58 + px} cy={38 + py} rx="2.8" ry="3.2" fill={hair}/>
      <circle cx={43 + px} cy={36.5 + py} r="1.2" fill="white"/>
      <circle cx={59 + px} cy={36.5 + py} r="1.2" fill="white"/>
    </>
  }

  // Mouth
  const renderMouth = () => {
    if (speaking && mouthOpen) return <ellipse cx="50" cy="50" rx="4.5" ry="3.5" fill="#CC5544" stroke={skinD} strokeWidth="0.5"/>
    switch (active) {
      case 'celebrate': return <path d="M 43,48 Q 50,56 57,48" stroke={hair} strokeWidth="2" fill="#E87B6B" strokeLinecap="round"/>
      case 'think': return <path d="M 46,50 Q 50,51 54,50" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round"/>
      case 'surprised': return <ellipse cx="50" cy="50" rx="4" ry="5" fill="#CC5544" stroke={skinD} strokeWidth="0.5"/>
      case 'silly': return <><path d="M 42,48 Q 50,58 58,48" stroke={hair} strokeWidth="2" fill="#E87B6B" strokeLinecap="round"/><circle cx="50" cy="54" r="2" fill="#CC5544"/></>
      case 'sleepy': return <path d="M 46,50 Q 50,48 54,50" stroke={hair} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      case 'listen': return <ellipse cx="50" cy="50" rx="3" ry="2.5" fill="#CC5544" stroke={skinD} strokeWidth="0.5"/>
      default: return <path d="M 43,48 Q 50,54 57,48" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round"/>
    }
  }

  // Eyebrows
  const brows = () => {
    if (active === 'surprised') return <><path d="M 35,28 Q 42,24 48,29" stroke={hair} strokeWidth="2" fill="none"/><path d="M 52,29 Q 58,24 65,28" stroke={hair} strokeWidth="2" fill="none"/></>
    if (active === 'think') return <><path d="M 36,30 Q 42,27 47,32" stroke={hair} strokeWidth="2" fill="none"/><path d="M 53,30 Q 58,27 64,30" stroke={hair} strokeWidth="1.5" fill="none"/></>
    if (active === 'silly') return <><path d="M 36,30 Q 42,28 47,31" stroke={hair} strokeWidth="1.5" fill="none"/><path d="M 53,34 Q 58,28 64,33" stroke={hair} strokeWidth="1.5" fill="none"/></>
    return <><path d="M 37,31 Q 42,29 46,32" stroke={hair} strokeWidth="1.5" fill="none"/><path d="M 54,32 Q 58,29 63,31" stroke={hair} strokeWidth="1.5" fill="none"/></>
  }

  const showBlush = ['smile', 'wave', 'celebrate', 'encourage', 'speak'].includes(active)

  // Extras
  const extras = () => {
    switch (active) {
      case 'wave': return <text x="3" y="36" fontSize="14" style={{ transition: 'all 0.3s' }}>👋</text>
      case 'celebrate': return <><text x="6" y="24" fontSize="11" className="animate-confetti">✨</text><text x="82" y="22" fontSize="11">✨</text><text x="44" y="14" fontSize="14">🎉</text></>
      case 'think': return <text x="66" y="24" fontSize="13">💭</text>
      case 'encourage': return <text x="8" y="44" fontSize="13">💪</text>
      case 'silly': return <text x="70" y="20" fontSize="12">🐦</text>
      case 'surprised': return <text x="72" y="18" fontSize="14">❗</text>
      case 'sleepy': return <text x="66" y="22" fontSize="10">💤</text>
      default: return null
    }
  }

  // Outfit details
  const outfitExtras = () => {
    if (outfit === 'chef') return <><ellipse cx="50" cy="14" rx="16" ry="10" fill="white" stroke="#DDD" strokeWidth="0.5"/><rect x="42" y="22" width="16" height="3" rx="1" fill="white" stroke="#DDD" strokeWidth="0.5"/></>
    if (outfit === 'pilot') return <rect x="40" y="22" width="20" height="4" rx="2" fill="#1A2740" stroke="#4A6080" strokeWidth="0.5"/>
    return null
  }

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`} style={{ width: W }}>
      {speaking && <div className="absolute inset-0 rounded-full speak-glow" style={{ transform: 'scale(1.2)' }}/>}
      <svg viewBox="0 0 100 115" style={{ width: W, height: W * 1.15, transition: 'all 0.3s ease' }}>
        {/* Body */}
        <g transform={`translate(0,${breathe * 0.3})`}>
          <path d={`M 30,74 Q 30,67 36,65 Q 43,62 50,61 Q 57,62 64,65 Q 70,67 70,74 L 73,110 Q 73,114 66,114 L 34,114 Q 27,114 27,110 Z`} fill={shirt}/>
          <path d="M 43,64 Q 50,69 57,64" fill={shirtD} stroke={shirt} strokeWidth="0.5"/>
          <path d="M 46,65 L 50,74 L 54,65" fill="none" stroke={shirtD} strokeWidth="1.2"/>
          <rect x="45" y="55" width="10" height="12" rx="3" fill={skin}/>
          <path d={leftArm()} stroke={shirt} strokeWidth="7.5" fill="none" strokeLinecap="round" style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}/>
          <path d={rightArm()} stroke={shirt} strokeWidth="7.5" fill="none" strokeLinecap="round" style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}/>
          {active === 'wave' && <circle cx="10" cy="36" r="4.5" fill={skin}/>}
          {active === 'celebrate' && <><circle cx="8" cy="24" r="4.5" fill={skin}/><circle cx="92" cy="24" r="4.5" fill={skin}/></>}
          {active === 'think' && <circle cx="34" cy="56" r="3.5" fill={skin}/>}
          {active === 'encourage' && <circle cx="13" cy="44" r="4.5" fill={skin}/>}
          {!['wave', 'celebrate', 'think', 'encourage', 'silly', 'surprised'].includes(active) && <><circle cx="19" cy="100" r="3.5" fill={skin}/><circle cx="81" cy="100" r="3.5" fill={skin}/></>}
          {active === 'silly' && <><circle cx="8" cy="96" r="3.5" fill={skin}/><circle cx="92" cy="96" r="3.5" fill={skin}/></>}
          {active === 'surprised' && <><circle cx="16" cy="54" r="4" fill={skin}/><circle cx="84" cy="54" r="4" fill={skin}/></>}
        </g>

        {/* Head */}
        <g transform={`translate(0,${breathe}) ${active === 'silly' ? 'rotate(5,50,40)' : active === 'sleepy' ? 'rotate(8,50,40)' : ''}`} style={{ transition: 'transform 0.4s ease' }}>
          <ellipse cx="50" cy="24" rx="25" ry="13" fill={hair}/>
          <ellipse cx="50" cy="38" rx="22" ry="23" fill={skin}/>
          <ellipse cx="28" cy="38" rx="4" ry="6" fill={skinD}/><ellipse cx="29" cy="38" rx="2" ry="3" fill={skin}/>
          <ellipse cx="72" cy="38" rx="4" ry="6" fill={skinD}/><ellipse cx="71" cy="38" rx="2" ry="3" fill={skin}/>
          <path d="M 30,30 Q 36,14 50,11 Q 64,14 70,30 Q 64,20 50,18 Q 36,20 30,30" fill={hair}/>
          <path d="M 38,16 Q 44,12 50,13" stroke="#2A1A0A" strokeWidth="0.7" fill="none" opacity="0.3"/>
          <path d="M 50,13 Q 56,12 62,16" stroke="#2A1A0A" strokeWidth="0.7" fill="none" opacity="0.3"/>
          {brows()}
          {renderEyes()}
          <path d="M 48,43 Q 50,46 52,43" stroke={skinD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          {showBlush && <><ellipse cx="36" cy="46" rx="4.5" ry="2.2" fill="#E8A07A" opacity="0.3"/><ellipse cx="64" cy="46" rx="4.5" ry="2.2" fill="#E8A07A" opacity="0.3"/></>}
          {renderMouth()}
          {outfitExtras()}
        </g>
        {extras()}
      </svg>
      {size !== 'sm' && <span className="text-[11px] font-bold text-coffee-700 -mt-0.5">Soli ሶሊ</span>}
    </div>
  )
}
