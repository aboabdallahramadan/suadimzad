"use client";
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Chat, Message } from '@/types/chat';

// Mock data for individual chat
const mockChat: Chat = {
  id: '1',
  participants: [
    {
      id: '1',
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Ahmed Mohammed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    }
  ],
  lastMessage: undefined,
  lastMessageTime: new Date(),
  unreadCount: 0,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    content: 'Hello! I saw your ad for the Toyota Camry. Is it still available?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    content: 'Yes, it is still available. Would you like to know more details?',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    chatId: '1',
    senderId: '2',
    content: 'Yes, please. What is the condition of the car? Has it been in any accidents?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '4',
    chatId: '1',
    senderId: '1',
    content: 'The car is in excellent condition. No accidents, regular maintenance, and all documents are available.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    id: '5',
    chatId: '1',
    senderId: '2',
    content: 'That sounds great! Can we schedule a time to see the car?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '6',
    chatId: '1',
    senderId: '1',
    content: 'Of course! I am free tomorrow after 3 PM. Where would you like to meet?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  }
];

export default function ChatPage() {
  const t = useTranslations();
  const params = useParams();
  // const router = useRouter();
  const [chat] = useState<Chat>(mockChat);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatId = params.chatid as string;
  const otherUser = chat.participants.find(p => p.id !== '1'); // Assuming current user ID is '1'

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format time display
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('chat.now');
    if (minutes < 60) return t('chat.minutesAgo', { minutes });
    if (hours < 24) return t('chat.hoursAgo', { hours });
    if (days === 1) return t('chat.yesterday');
    return t('chat.daysAgo', { days });
  };

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: chatId,
      senderId: '1',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: Message[] });

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/chats" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                
                <div>
                  <h1 className="font-semibold text-gray-900">{otherUser?.name}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl p-4">
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date} className="mb-6">
              {/* Date divider */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-xs text-gray-600">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${message.senderId === '1' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.senderId === '1'
                          ? 'bg-primary-accent text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${message.senderId === '1' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-xs ${message.senderId === '1' ? 'text-white/70' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-xs lg:max-w-md">
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{t('chat.typing')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end gap-2"> 
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.typeMessage')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent focus:border-primary-accent resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={newMessage.trim() === ''}
              className={`p-2 rounded-full transition-colors ${
                newMessage.trim() === ''
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-accent text-white hover:bg-primary-dark'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 