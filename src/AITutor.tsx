import { useState } from 'react'

function HumoLogo({ size = 8 }: { size?: number }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold" style={{ width: `${size * 4}px`, height: `${size * 4}px`, fontSize: `${size * 2}px` }}>
      🦤
    </div>
  )
}

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm Humo. Your AI tutor for SAT and IELTS. Ask me anything — I can explain concepts, give hints, or walk you through practice questions." }
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Got it. Let me help you with that.\n\n(Connect Gemini in the backend for live Humo responses.)" }])
    }, 800)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HumoLogo />
          <div>
            <h1 className="font-semibold tracking-tight">Humo</h1>
            <p className="text-xs text-white/40">AI Tutor • SAT & IELTS</p>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-white/5 border border-white/10'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask Humo..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50" />
          <button onClick={sendMessage} className="px-5 py-3 bg-amber-500 text-black text-sm font-medium rounded-2xl">Send</button>
        </div>
      </div>
    </div>
  )
}
