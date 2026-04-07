'use client'
import { useState, useCallback, useRef, useEffect } from 'react'

export function useAudio() {
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const timeoutRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMuted(localStorage.getItem('soli_muted') === 'true')
    }
  }, [])

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) speechSynthesis.cancel()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setSpeaking(false)
  }, [])

  const speak = useCallback((text: string, lang = 'en-US', rate = 0.75) => {
    if (muted || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    u.rate = rate
    u.pitch = 1.1
    setSpeaking(true)
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    speechSynthesis.speak(u)
  }, [muted, cancel])

  const speakEnglish = useCallback((text: string, onDone?: () => void) => {
    if (muted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onDone?.()
      return
    }
    cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.65
    u.pitch = 1.1
    setSpeaking(true)
    u.onend = () => { setSpeaking(false); onDone?.() }
    u.onerror = () => { setSpeaking(false); onDone?.() }
    speechSynthesis.speak(u)
  }, [muted, cancel])

  const speakThen = useCallback((text: string, lang: string, rate: number, delayMs: number, next: () => void) => {
    if (muted) { timeoutRef.current = setTimeout(next, 300); return }
    speak(text, lang, rate)
    timeoutRef.current = setTimeout(next, Math.max(text.length * 70, 800) + delayMs)
  }, [muted, speak])

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    if (typeof window !== 'undefined') localStorage.setItem('soli_muted', next ? 'true' : 'false')
    if (next) cancel()
  }, [muted, cancel])

  return { speaking, muted, speak, speakEnglish, speakThen, cancel, toggleMute }
}

export function MuteBtn({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tap-scale ${
        muted ? 'bg-coffee-100 text-coffee-400' : 'bg-amber-50 text-amber-600 border border-amber-200'
      }`}>
      <span>{muted ? '🔇' : '🔊'}</span>
    </button>
  )
}
