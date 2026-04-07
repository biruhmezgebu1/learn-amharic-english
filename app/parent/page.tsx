'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { getWord } from '@/content/vocabulary'
import Link from 'next/link'

export default function ParentPage() {
  const { state, reset } = useStore()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <p className="text-lg font-bold text-coffee-800 mb-1">Parent Access</p>
        <p className="text-sm text-coffee-400 mb-6">Enter PIN: 1234</p>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && pin === '1234') setUnlocked(true) }}
          className="w-32 text-center text-2xl tracking-widest bg-cream rounded-xl px-4 py-3 border border-sand outline-none focus:ring-2 focus:ring-amber-400"
          maxLength={4} placeholder="••••" autoFocus />
        <button onClick={() => { if (pin === '1234') setUnlocked(true) }}
          className="mt-4 bg-coffee-800 text-white rounded-xl px-6 py-2.5 font-semibold tap-scale">Enter</button>
        <Link href="/" className="mt-4 text-sm text-coffee-400">← Back</Link>
      </div>
    )
  }

  const words = state.wordsLearned.map(id => getWord(id)).filter(Boolean) as any[]

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-coffee-400 text-sm">← Back</Link>
        <h1 className="font-bold text-lg text-coffee-800 flex-1">Parent Summary</h1>
      </div>

      <div className="bg-cream rounded-2xl p-5 border border-sand mb-4">
        <p className="text-sm text-coffee-400 mb-1">Learner</p>
        <p className="text-xl font-bold text-coffee-800">{state.name || 'Student'}</p>
        <p className="text-sm text-coffee-400 mt-2">Age group: {state.age === 'young' ? '6-9' : state.age === 'preteen' ? '10-14' : '15+'}</p>
      </div>

      <div className="bg-cream rounded-2xl p-5 border border-sand mb-4">
        <p className="text-sm text-coffee-400 mb-3">This week</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-coffee-800">{state.lessonsCompleted}</p>
            <p className="text-[10px] text-coffee-400">Lessons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-coffee-800">{state.wordsLearned.length}</p>
            <p className="text-[10px] text-coffee-400">Words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-coffee-800">{state.streakDays}</p>
            <p className="text-[10px] text-coffee-400">Days</p>
          </div>
        </div>
      </div>

      {words.length > 0 && (
        <div className="bg-cream rounded-2xl p-5 border border-sand mb-4">
          <p className="text-sm text-coffee-400 mb-3">Words learned</p>
          <div className="space-y-2">
            {words.map((w: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-sand/50 last:border-0">
                <span className="font-semibold text-sm text-coffee-800">{w.en}</span>
                <span className="text-sm text-coffee-400">{w.am}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
        <p className="text-xs text-amber-600 uppercase tracking-wider mb-1">Suggested activity</p>
        <p className="text-sm text-amber-800">
          Ask {state.name || 'your child'} to say "Hello" and "Thank you" in English at dinner tonight. Celebrate when they do!
        </p>
      </div>

      <div className="border-t border-sand pt-4">
        <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) { reset(); window.location.href = '/' } }}
          className="text-sm text-coral-500">Reset all progress</button>
      </div>
    </div>
  )
}
