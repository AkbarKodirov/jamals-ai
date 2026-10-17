import { useState } from 'react'

export function MobileNav({ setView, current }: { setView: (v: string) => void; current: string }) {
  const items = [
    { id: 'dashboard', label: 'Home' },
    { id: 'tutor', label: 'Humo' },
    { id: 'questions', label: 'Practice' },
    { id: 'analytics', label: 'Stats' },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/90 backdrop-blur-xl z-50">
      <div className="flex justify-around py-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center text-xs ${current === item.id ? 'text-amber-400' : 'text-white/50'}`}
          >
            <span className="text-lg mb-1">{item.id === 'tutor' ? '🦤' : '•'}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
