import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Loader2 } from 'lucide-react';
import { ChatMessage, UserMetrics } from '../types';
import { generateTacticalResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  metrics: UserMetrics;
  integrityScore: number;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ metrics, integrityScore }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Tactical Uplink Established. Awaiting directives.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `Integrity: ${integrityScore}%. Deep Work: ${metrics.deepWorkMinutes}m. Sleep: ${metrics.sleepScore}. HRV: ${metrics.hrv}.`;
    
    try {
      const responseText = await generateTacticalResponse(userMsg.text, context);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-charcoal border border-neutral-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center gap-2 bg-neutral-900/50">
        <Cpu className="w-4 h-4 text-ember" />
        <span className="text-xs font-mono font-bold tracking-wider text-neutral-400">TACTICAL ADVISOR</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-sm border ${
              msg.role === 'user' 
                ? 'bg-neutral-900 border-neutral-700 text-neutral-200' 
                : 'bg-black border-ember/30 text-ember'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black border border-ember/30 p-3 rounded-sm flex items-center gap-2">
              <Loader2 className="w-3 h-3 text-ember animate-spin" />
              <span className="text-ember text-xs">Computing strategy...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-neutral-900/50 border-t border-neutral-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Enter command..."
          className="flex-1 bg-black border border-neutral-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-ember font-mono placeholder-neutral-600"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-ember p-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
