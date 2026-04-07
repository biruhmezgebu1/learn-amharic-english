'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const FREE_TIME_MS = 10 * 60 * 1000 // 10 minutes

export function useTimer() {
  const [elapsed, setElapsed] = useState(0)
  const [expired, setExpired] = useState(false)
  const startRef = useRef(Date.now())
  const frameRef = useRef<any>(null)

  useEffect(() => {
    // Check if already paid
    if (typeof window !== 'undefined' && localStorage.getItem('soli_paid') === 'true') {
      return
    }
    startRef.current = Date.now()
    const tick = () => {
      const now = Date.now()
      const e = now - startRef.current
      setElapsed(e)
      if (e >= FREE_TIME_MS) setExpired(true)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [])

  const isPaid = useCallback(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('soli_paid') === 'true'
  }, [])

  const unlock = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.setItem('soli_paid', 'true')
    setExpired(false)
  }, [])

  return { elapsed, expired: expired && !isPaid(), isPaid, unlock, minutesLeft: Math.max(0, Math.ceil((FREE_TIME_MS - elapsed) / 60000)) }
}
