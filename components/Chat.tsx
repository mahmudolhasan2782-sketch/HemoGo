import React, { useState } from 'react';
import { ChatSession, Message } from '../types';
import { Send, Phone, Video, Paperclip, ChevronLeft, MoreVertical, Search, MessageSquare } from 'lucide-react';
import { VideoCallModal } from './VideoCallModal';

const MOCK_SESSIONS: ChatSession[] = [
  { id: '1', participantId: 'u2', participantName: 'Sarah Chen', participantAvatar: 'https://picsum.photos/100/100?random=1', lastMessage: 'Thanks for the notes!', unreadCount: 2 },
  { id: '2', participantId: 'u3', participantName: 'Mike Ross', participantAvatar: 'https://picsum.photos/100/100?random=3', lastMessage: 'Are we studying tonight?', unreadCount: 0 },
  { id: '3', participantId: 'u4', participantName: 'Jessica Li', participantAvatar: 'https://picsum.photos/100/100?random=4', lastMessage: 'Can you send the PDF?', unreadCount: 0 },
];

export const Chat: React.FC = () => {
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: 'u2', text: 'Hey! Did you finish the module?', timestamp: Date.now() - 100000 },
    { id: '2', senderId: 'me', text: 'Yes, just now. It was tricky.', timestamp: Date.now() - 90000 },
  ]);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: input,
      timestamp: Date.now()
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] md:h-[calc(100vh-64px)] bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
      
      {/* LEFT SIDEBAR - CHAT LIST */}
      <div className={`w-full md:w-80 flex flex-col border-r border-gray-100 bg-white ${activeSession ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 mb-4 hidden md:block">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {MOCK_SESSIONS.map(session => (
            <div 
              key={session.id} 
              onClick={() => setActiveSession(session)} 
              className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 ${activeSession?.id === session.id ? 'bg-indigo-50/50' : ''}`}
            >
              <div className="relative">
                 <img src={session.participantAvatar} className="w-12 h-12 rounded-full mr-4 object-cover ring-2 ring-white shadow-sm" />
                 {session.unreadCount > 0 && (
                   <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                     {session.unreadCount}
                   </div>
                 )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-semibold text-sm ${activeSession?.id === session.id ? 'text-indigo-900' : 'text-gray-900'}`}>{session.participantName}</h3>
                  <span className="text-[10px] text-gray-400">10:42 AM</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CHAT AREA */}
      <div className={`flex-1 flex flex-col bg-gray-50 ${!activeSession ? 'hidden md:flex' : 'flex'}`}>
        {activeSession ? (
          <>
            <VideoCallModal isOpen={isVideoCallOpen} onClose={() => setIsVideoCallOpen(false)} participantName={activeSession.participantName} />
            
            {/* Header */}
            <div className="bg-white p-3 md:p-4 flex items-center justify-between border-b border-gray-200 shadow-sm z-10">
              <div className="flex items-center">
                <button onClick={() => setActiveSession(null)} className="mr-3 md:hidden p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                <div className="relative">
                  <img src={activeSession.participantAvatar} className="w-9 h-9 rounded-full border border-gray-200 mr-3" />
                  <div className="absolute bottom-0 right-3 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                   <span className="font-bold text-gray-800 text-sm block">{activeSession.participantName}</span>
                   <span className="text-xs text-green-600 block">Online</span>
                </div>
              </div>
              <div className="flex space-x-2 text-gray-600">
                <button className="p-2 hover:bg-gray-100 rounded-full"><Phone size={20} /></button>
                <button onClick={() => setIsVideoCallOpen(true)} className="p-2 hover:bg-gray-100 rounded-full"><Video size={20} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-full md:hidden"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.senderId === 'me' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 text-right opacity-70 ${msg.senderId === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>10:30 AM</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
              <button className="text-gray-400 hover:text-indigo-600 p-2"><Paperclip size={20} /></button>
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
              </div>
              <button onClick={handleSend} className="bg-indigo-600 text-white p-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-gray-400" />
            </div>
            <p className="font-medium text-lg text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};