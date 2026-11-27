import { useState } from 'react'
import { ArrowUpRight, MessageCircle, Send, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiFetch, isDemoMode } from '../lib/api'
import './RentalAssistant.css'

export default function RentalAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', text: 'Tell me what you need for your next project or occasion, and I’ll look through current rentals.' },
  ])

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text || isLoading) return
    setMessage('')
    setIsLoading(true)
    setMessages(previous => [...previous, { id: `user-${Date.now()}`, role: 'user', text }])
    try {
      const response = await apiFetch('/api/assistant/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Recommendations are unavailable right now.')
      setMessages(previous => [...previous, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        items: data.items,
      }])
    } catch (error) {
      setMessages(previous => [...previous, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: error.message || 'I could not load recommendations. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rental-assistant">
      {isOpen && (
        <section className="assistant-panel" aria-label="Rental recommendations">
          <header className="assistant-header">
            <div><strong>Rental helper</strong><span>Recommendations from current listings</span></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close rental helper"><X size={19} /></button>
          </header>
          <div className="assistant-messages" aria-live="polite">
            {messages.map(entry => (
              <div className={`assistant-message assistant-message-${entry.role}`} key={entry.id}>
                <p>{entry.text}</p>
                {entry.items?.map(item => (
                  <Link className="assistant-item" to={`/item/${item.id}`} key={item.id} onClick={() => setIsOpen(false)}>
                    <img src={item.image} alt="" />
                    <span><strong>{item.title}</strong><small>${Number(item.price).toFixed(0)} / {item.pricePeriod || 'day'}</small></span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ))}
            {isLoading && <p className="assistant-loading" role="status">Looking through listings…</p>}
          </div>
          <form className="assistant-form" onSubmit={sendMessage}>
            <input
              aria-label="Describe what you want to rent"
              placeholder="What are you looking to rent?"
              maxLength={500}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isLoading}
            />
            <button type="submit" aria-label="Send message" disabled={isLoading || !message.trim()}><Send size={17} /></button>
          </form>
          <p className="assistant-disclaimer">{isDemoMode ? 'Demo mode: recommendations use sample listings in your browser.' : 'Your message may be sent to the configured chatbot API. Don’t include sensitive information.'}</p>
        </section>
      )}
      <button
        className="assistant-toggle"
        type="button"
        aria-label={isOpen ? 'Close rental helper' : 'Ask for rental recommendations'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && <span>Need a rental?</span>}
      </button>
    </div>
  )
}
