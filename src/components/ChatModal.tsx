import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  CheckCheck,
  Sparkles
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { 
    lang, 
    t, 
    chatRecipient, 
    setChatRecipient, 
    chatMessages, 
    sendChatMessage, 
    currentUser, 
    setActiveModal 
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  if (!chatRecipient) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const handleQuickQuestion = (q: string) => {
    sendChatMessage(q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full text-slate-800 overflow-hidden h-[540px] flex flex-col">
        
        {/* Chat Header */}
        <div className="p-3.5 bg-[#007460] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-sm text-white border border-emerald-400">
              {chatRecipient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                <span>{chatRecipient.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>{chatRecipient.phone}</span>
                <span>·</span>
                <span className="text-emerald-200">অনলাইন আছেন</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setChatRecipient(null);
                setActiveModal(null);
              }}
              className="text-white hover:text-emerald-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ad Context Snippet & Direct Buy in Chat */}
        {chatRecipient.adTitle && (
          <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs shrink-0 gap-2">
            <div className="flex items-center gap-2 truncate flex-1">
              <span className="font-semibold text-slate-700 shrink-0">পণ্য:</span>
              <span className="truncate text-slate-900 font-medium">{chatRecipient.adTitle}</span>
            </div>
            <button
              onClick={() => setActiveModal('payment')}
              className="px-2.5 py-1 bg-[#007460] hover:bg-[#005e4e] text-white rounded text-[11px] font-bold shrink-0 transition-colors cursor-pointer shadow-2xs"
            >
              নিরাপদ অর্ডার করুন
            </button>
          </div>
        )}

        {/* Anti-Leakage Platform Protection Warning */}
        <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>সতর্কতা: সরাসরি কোনো বিকাশ বা নগদ নম্বরে টাকা পাঠাবেন না। সাইটের মাধ্যমে অর্ডার করলে ১০০% ক্যাশব্যাক গ্যারান্টি।</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
          
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full font-medium">
              আজকে · নিরাপদ চ্যাট
            </span>
          </div>

          {chatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id || msg.senderId === 'guest';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#007460] text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Chips */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap pl-1">
            {t.quickQuestions}
          </span>
          <button
            onClick={() => handleQuickQuestion(t.q1)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {t.q1}
          </button>
          <button
            onClick={() => handleQuickQuestion(t.q2)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {t.q2}
          </button>
          <button
            onClick={() => handleQuickQuestion(t.q3)}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            {t.q3}
          </button>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.typeMessage}
            className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007460] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-[#007460] hover:bg-[#005e4e] disabled:opacity-40 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
