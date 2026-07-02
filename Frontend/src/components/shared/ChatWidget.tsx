import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Loader2, Minus, Paperclip, FileText } from 'lucide-react';
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi there! 👋 I'm the EcommHub AI Assistant. How can I help you today?" }
  ]);
  const [selectedModel, setSelectedModel] = useState('openrouter/auto');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history on load
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/chat/history`, { withCredentials: true });
        
        if (res.data.sessions && res.data.sessions.length > 0) {
          const latestSession = res.data.sessions[0];
          setSessionId(latestSession.id);
          
          if (latestSession.fileName) {
            setFileName(latestSession.fileName);
          }
          
          if (latestSession.messages.length > 0) {
            // Map DB messages to frontend format
            const history = latestSession.messages.map((m: any) => ({
              role: m.role,
              content: m.content
            }));
            
            // Keep the greeting, append history
            setMessages([
              { role: 'assistant', content: "Hi there! 👋 Welcome back." },
              ...history
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history', error);
      }
    };
    
    fetchHistory();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (sessionId) formData.append('sessionId', sessionId);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/chat/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSessionId(res.data.sessionId);
      setFileName(res.data.fileName);
      
      setMessages(prev => [...prev, { role: 'assistant', content: `I've successfully read your file: ${res.data.fileName}. What would you like to know about it?` }]);
    } catch (error) {
      console.error('Upload failed', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that file." }]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Helper to get CSRF token from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    // Add user message immediately and an empty assistant message for streaming
    const userMsg: Message = { role: 'user', content: text };
    const placeholderMsg: Message = { role: 'assistant', content: '' };
    
    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setInput('');
    setIsTyping(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const maxRetries = 3;
    let attempt = 0;
    let connected = false;

    while (attempt < maxRetries && !connected) {
      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || ''
          },
          body: JSON.stringify({ sessionId, content: text, model: selectedModel }),
          credentials: 'include'
        });

        if (!response.body) throw new Error('No readable stream returned');
        connected = true;

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        
        let isFirstChunk = true;
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            if (trimmed === 'data: [DONE]') continue;
            
            try {
              const data = JSON.parse(trimmed.slice(6));
              
              if (data.type === 'session' && isFirstChunk) {
                if (!sessionId) setSessionId(data.sessionId);
                isFirstChunk = false;
              } else if (data.type === 'content') {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (updated[lastIdx].role === 'assistant') {
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: updated[lastIdx].content + data.content
                    };
                  }
                  return updated;
                });
              }
            } catch (e) {
              // Ignore parsing errors for split chunks
            }
          }
        }
      } catch (error) {
        if (!connected) {
          // Failed to connect, retry with backoff
          attempt++;
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s
            await new Promise(r => setTimeout(r, delay));
          } else {
            console.error('Chat connection failed:', error);
            setMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (updated[lastIdx].role === 'assistant') {
                updated[lastIdx] = { ...updated[lastIdx], content: "⚠️ Connection failed. Please check your network and try again." };
              }
              return updated;
            });
          }
        } else {
          // Connected, but stream dropped mid-way
          console.error('Chat stream dropped:', error);
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx].role === 'assistant') {
              updated[lastIdx] = { ...updated[lastIdx], content: updated[lastIdx].content + "\n\n⚠️ *[Connection Lost. Response saved.]*" };
            }
            return updated;
          });
          break; // Exit loop, don't retry a partial generation natively
        }
      }
    }
    
    setIsTyping(false);
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="bg-transparent text-[9px] text-emerald-400 font-medium uppercase tracking-wider outline-none cursor-pointer appearance-none hover:text-emerald-300 transition-colors"
                    >
                      <option value="openrouter/auto" className="bg-neutral-900">Auto (Default)</option>
                      <option value="openai/gpt-4o" className="bg-neutral-900 text-white">GPT-4o</option>
                      <option value="anthropic/claude-3.5-sonnet" className="bg-neutral-900 text-white">Claude 3.5 Sonnet</option>
                      <option value="google/gemini-1.5-pro" className="bg-neutral-900 text-white">Gemini 1.5 Pro</option>
                      <option value="deepseek/deepseek-chat" className="bg-neutral-900 text-white">DeepSeek V3</option>
                      <option value="meta-llama/llama-3-70b-instruct" className="bg-neutral-900 text-white">Llama 3 (70B)</option>
                    </select>
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
                {(fileName ? [
                  "Summarize this document",
                  "Find key skills",
                  "Generate interview questions"
                ] : SUGGESTIONS).map((s, i) => (
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

            {/* Attachment Indicator */}
            {fileName && (
              <div className="px-4 pb-2">
                <div className="inline-flex items-center gap-2 bg-[#076653]/30 border border-[#076653]/50 text-neutral-300 text-xs px-3 py-1.5 rounded-full">
                  <FileText size={14} className="text-[#E3EF26]" />
                  <span className="truncate max-w-[150px]">{fileName}</span>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-neutral-900 border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="relative flex items-center gap-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,.txt,.docx" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTyping || isUploading}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-white/10 text-neutral-400 rounded-full transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin text-[#E3EF26]" /> : <Paperclip size={16} />}
                </button>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full bg-black/30 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#E3EF26]/50 transition-colors"
                    disabled={isTyping || isUploading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping || isUploading}
                    className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square flex items-center justify-center bg-[#E3EF26] hover:bg-[#c8d41e] disabled:bg-neutral-600 disabled:text-neutral-400 text-black rounded-full transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
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
