'use client';

import { useState } from 'react';
import { useConcierge } from '@/hooks/useConcierge';
import Navigation from '@/components/Navigation';

export default function ChatPage() {
  const { messages, isLoading, error, language, handleLanguageChange, sendMessage } = useConcierge();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      <Navigation />
      <div className="flex flex-col flex-1 relative bg-black pb-[env(safe-area-inset-bottom)]">
        
        <div className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-lg font-bold">AI Concierge</h1>
          <label htmlFor="language-select" className="sr-only">Select language</label>
          <select 
            id="language-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 border-gray-700 p-2 rounded text-base min-h-[44px] min-w-[44px] text-white"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="Portuguese">Português</option>
          </select>
        </div>

        <div className="flex-1 p-4 overflow-y-auto pb-32" aria-live="polite">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10 text-base">
              Ask me for directions, accessibility routes, or live crowd updates!
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              <div className={`p-3 rounded-lg text-base ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto mb-4 p-3 rounded-lg bg-gray-800 text-gray-100 max-w-[85%] text-base">
              <span className="animate-pulse">Thinking...</span>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mb-4 text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Where's the nearest gate?"
              className="flex-1 bg-gray-800 border-gray-700 p-3 rounded-lg text-base min-h-[44px] text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium min-h-[44px] min-w-[44px] disabled:opacity-50 text-base"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
