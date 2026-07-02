import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Loader2, Minus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const SUGGESTIONS = [
  "What is the meaning of life?",
  "Help me track my order",
  "What is your return policy?",
  "Suggest some premium electronics",
];

export const ChatWidget: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! 👋 I'm the EcommHub AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message immediately
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // We send the entire conversation history context to OpenRouter
      // (Excluding the initial greeting to save tokens)
      const payloadMessages = newMessages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await axios.post(
        `${API_URL}/chat`, 
        { messages: payloadMessages },
        { withCredentials: true }
      );

      const aiReply = response.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: aiReply.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages, 
        { role: 'assistant', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, originY: 1, originX: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] glass-panel bg-neutral-950/90 border-[#076653]/30 shadow-2xl flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#076653]/80 to-neutral-900 px-5 py-4 flex items-center justify-between border-b border-[#E3EF26]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E3EF26] flex items-center justify-center shadow-[0_0_15px_rgba(227,239,38,0.4)]">
                  <Sparkles size={16} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                  <Minus size={20} />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-[#076653] to-[#0a826b] text-white rounded-br-sm shadow-md' 
                      : 'bg-white/5 border border-white/10 text-neutral-200 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 text-neutral-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs ml-1 font-medium">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (Only show if exactly 1 message exists) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-[11px] bg-white/5 hover:bg-[#076653]/30 border border-white/10 hover:border-[#E3EF26]/30 text-neutral-300 rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-neutral-900 border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-black/30 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#E3EF26]/50 transition-colors"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#E3EF26] hover:bg-[#c8d41e] disabled:bg-neutral-600 disabled:text-neutral-400 text-black rounded-full transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[9px] text-neutral-500 font-medium">Powered by OpenRouter AI</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#076653] to-[#E3EF26] p-[2px] shadow-2xl group flex items-center justify-center z-50 cursor-pointer"
          >
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center group-hover:bg-neutral-900 transition-colors relative">
              <MessageSquare size={24} className="text-[#E3EF26]" />
              
              {/* Notification Dot */}
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 border-neutral-950"></span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};
