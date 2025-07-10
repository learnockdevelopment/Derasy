'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Bot, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

export function AssistantChat({ avatar, token }: { avatar?: string, token?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  async function sendMessage() {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }])
    setInput('')
    setIsTyping(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      })

      const data = await res.json()
      setMessages((prev) => [...prev, { from: 'bot', text: data.reply }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '⚠️ حدث خطأ أثناء التواصل مع مساعد Gemini. حاول مرة أخرى لاحقًا.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <button
        className="fixed bottom-6 end-6 z-50 p-4 rounded-full bg-pink-500 text-white shadow-xl hover:bg-pink-600 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat Assistant"
      >
        <Bot className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 end-6 z-50 w-100 h-[550px] backdrop-blur-md bg-white/70 border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden animate-fade-in-up text-right font-[Cairo]">
          {/* Header */}
          <div onClick={() => setIsOpen(!isOpen)} className="p-4 bg-pink-100 text-pink-800 font-bold flex justify-between items-center">
            مساعد دراسي
            <X className="w-5 h-5 cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-sm flex flex-col">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2',
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.from === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold">
                    🤖
                  </div>
                )}

                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl max-w-[75%] shadow-sm whitespace-pre-wrap prose prose-sm dark:prose-invert',
                    msg.from === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  )}
                >
                  {msg.from === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>

                {msg.from === 'user' && avatar && (
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8"
                  />
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-200 text-pink-800 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl text-sm text-gray-500 animate-pulse">
                  يكتب...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex items-center gap-2 border-t border-gray-200 p-2 bg-white"
          >
            <input
              type="text"
              placeholder="اكتب رسالتك..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-full bg-gray-100 px-3 py-1"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
