'use client'
import { useState } from 'react'
import Soli from '@/components/Soli'
import { getAllWordsLearned } from '@/content/chapters'

export default function Paywall({ onUnlock, childName }: { onUnlock: () => void; childName: string }) {
  const [showParent, setShowParent] = useState(false)
  const words = getAllWordsLearned()

  if (showParent) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        <div className="max-w-lg mx-auto px-5 py-6 flex-1 overflow-auto">
          <button onClick={() => setShowParent(false)} className="text-coffee-400 text-sm mb-4 tap-scale">← Back</button>

          <div className="text-center mb-6">
            <Soli mood="smile" size="md" />
            <h1 className="text-xl font-bold text-coffee-800 mt-2">{childName || 'Your child'} learned {words.length} English words</h1>
            <p className="text-sm text-coffee-400 mt-1">in just 10 minutes</p>
          </div>

          <div className="bg-cream rounded-2xl p-4 border border-sand mb-4">
            <p className="text-xs text-coffee-400 uppercase tracking-wider mb-3">Words learned today</p>
            <div className="grid grid-cols-2 gap-2">
              {words.map((w, i) => (
                <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                  <span className="text-sm font-semibold text-coffee-800">{w.en}</span>
                  <span className="text-xs text-coffee-400">{w.am}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">What happens next?</p>
            <p className="text-xs text-amber-700">300+ words in 30 days. Real conversations in 90 days. Soli guides {childName || 'your child'} through the market, school, bus stop, doctor, and more.</p>
          </div>

          <div className="bg-coffee-800 rounded-2xl p-5 mb-4 text-center">
            <p className="text-xs text-white/50 mb-1">3 days free. Cancel anytime.</p>
            <p className="text-3xl font-bold text-white mb-1">Start Free Trial</p>
            <p className="text-sm text-white/60">Then 99 Birr/month</p>
          </div>

          <button onClick={onUnlock}
            className="w-full bg-amber-500 text-white rounded-2xl py-4 text-lg font-bold shadow-lg shadow-amber-500/25 tap-scale mb-3">
            Start 3-Day Free Trial →
          </button>

          <p className="text-center text-[10px] text-coffee-400/40 mb-6">Payment via Telebirr, CBE Birr, or card. Cancel anytime.</p>

          {/* Dev bypass */}
          <button onClick={onUnlock} className="block mx-auto text-[10px] text-coffee-400/20">
            [Dev: Skip paywall]
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
      {/* Blurred outside world visible behind */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #87CEEB 0%, #B8E6B8 30%, #F5EBD8 60%, #E8D5B7 100%)',
        filter: 'blur(8px)',
      }} />

      {/* Soli frozen mid-step */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-10">
        <Soli mood="wave" size="xl" />
      </div>

      {/* Warm overlay curtain */}
      <div className="relative z-20 w-full bg-gradient-to-t from-white via-white/98 to-white/80 rounded-t-3xl px-6 pt-6 pb-8 max-w-lg mx-auto"
        style={{ maxHeight: '60vh' }}>
        <div className="text-center">
          <p className="text-lg font-bold text-coffee-800 mb-0.5">ሶሊ ውጫ መሥታት ትፈልጋለች!</p>
          <p className="text-sm text-coffee-400 mb-4">Soli wants to go outside!</p>

          <div className="bg-cream rounded-xl p-3 mb-4 border border-sand">
            <p className="text-[10px] text-coffee-400 uppercase tracking-wider mb-2">{words.length} words learned</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {words.map((w, i) => (
                <span key={i} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[11px] font-semibold">{w.en}</span>
              ))}
            </div>
          </div>

          <button onClick={() => setShowParent(true)}
            className="w-full bg-amber-500 text-white rounded-2xl py-4 text-lg font-bold shadow-lg shadow-amber-500/25 tap-scale mb-2">
            ቀጥል → Continue the Adventure
          </button>

          <p className="text-xs text-coffee-400/50">ወላጆትን ያግኙ / Ask your parent</p>
          <p className="text-[10px] text-coffee-400/30 mt-1">🎁 3 ቀን ነጽ / 3 days free</p>
        </div>
      </div>
    </div>
  )
}
