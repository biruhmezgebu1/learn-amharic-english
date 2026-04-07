'use client'
import { useState, useEffect, useCallback } from 'react'

// ===== Types =====
export type AgeGroup = 'young' | 'preteen' | 'adult'
export type Direction = 'am_to_en' | 'en_to_am'

export interface LearnerState {
  name: string
  age: AgeGroup
  direction: Direction
  isOnboarded: boolean
  hasCompletedFirstAdventure: boolean
  level: number
  stars: number
  streakDays: number
  lastActiveDate: string
  todayMinutes: number
  lessonsCompleted: number
  wordsLearned: string[]
  currentMapStop: number
  soliOutfit: string
  unlockedOutfits: string[]
  muted: boolean
  paid: boolean
}

const DEFAULT: LearnerState = {
  name: '',
  age: 'young',
  direction: 'am_to_en',
  isOnboarded: false,
  hasCompletedFirstAdventure: false,
  level: 1,
  stars: 0,
  streakDays: 0,
  lastActiveDate: '',
  todayMinutes: 0,
  lessonsCompleted: 0,
  wordsLearned: [],
  currentMapStop: 0,
  soliOutfit: 'default',
  unlockedOutfits: ['default'],
  muted: false,
  paid: false,
}

const KEY = 'soli_state'

function load(): LearnerState {
  if (typeof window === 'undefined') return DEFAULT
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return DEFAULT }
}

function save(s: LearnerState) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(s))
}

export function useStore() {
  const [state, setState] = useState(DEFAULT)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const s = load()
    // Check streak
    const today = new Date().toISOString().split('T')[0]
    if (s.lastActiveDate && s.lastActiveDate !== today) {
      s.todayMinutes = 0
    }
    setState(s)
    setLoaded(true)
  }, [])

  const update = useCallback((partial: Partial<LearnerState>) => {
    setState(prev => {
      const next = { ...prev, ...partial }
      save(next)
      return next
    })
  }, [])

  const addStars = useCallback((n: number) => {
    setState(prev => {
      const next = { ...prev, stars: prev.stars + n }
      save(next)
      return next
    })
  }, [])

  const recordActivity = useCallback((minutes: number) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0]
      const isNewDay = prev.lastActiveDate !== today
      const next = {
        ...prev,
        todayMinutes: prev.todayMinutes + minutes,
        lastActiveDate: today,
        streakDays: isNewDay ? prev.streakDays + 1 : prev.streakDays,
      }
      save(next)
      return next
    })
  }, [])

  const learnWord = useCallback((word: string) => {
    setState(prev => {
      if (prev.wordsLearned.includes(word)) return prev
      const next = { ...prev, wordsLearned: [...prev.wordsLearned, word] }
      save(next)
      return next
    })
  }, [])

  const completeLesson = useCallback(() => {
    setState(prev => {
      const next = {
        ...prev,
        lessonsCompleted: prev.lessonsCompleted + 1,
        currentMapStop: prev.currentMapStop + 1,
        level: Math.floor((prev.lessonsCompleted + 1) / 3) + 1,
      }
      save(next)
      return next
    })
  }, [])

  const reset = useCallback(() => { setState(DEFAULT); save(DEFAULT) }, [])

  const getDaysSinceActive = useCallback(() => {
    if (!state.lastActiveDate) return 0
    const last = new Date(state.lastActiveDate)
    const now = new Date()
    return Math.floor((now.getTime() - last.getTime()) / 86400000)
  }, [state.lastActiveDate])

  const sessionLength = state.age === 'young' ? 8 : state.age === 'preteen' ? 12 : 15

  return { state, loaded, update, addStars, recordActivity, learnWord, completeLesson, reset, getDaysSinceActive, sessionLength }
}

// ===== SRS Engine =====
export interface SRSCard { id: string; interval: number; ease: number; due: string; reviews: number }

export function createCard(id: string): SRSCard {
  return { id, interval: 1, ease: 2.5, due: new Date().toISOString(), reviews: 0 }
}

export function loadGarden(): SRSCard[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('soli_garden') || '[]') } catch { return [] }
}

export function saveGarden(cards: SRSCard[]) {
  if (typeof window !== 'undefined') localStorage.setItem('soli_garden', JSON.stringify(cards))
}

export function getWiltingCards(cards: SRSCard[]): SRSCard[] {
  const now = new Date()
  return cards.filter(c => new Date(c.due) <= now)
}

export function waterCard(card: SRSCard, quality: number): SRSCard {
  // quality: 1=hard, 2=good, 3=easy
  const newEase = Math.max(1.3, card.ease + (quality === 3 ? 0.15 : quality === 2 ? 0 : -0.2))
  const newInterval = quality === 1 ? 1 : Math.ceil(card.interval * newEase)
  const due = new Date()
  due.setDate(due.getDate() + newInterval)
  return { ...card, interval: newInterval, ease: newEase, due: due.toISOString(), reviews: card.reviews + 1 }
}
