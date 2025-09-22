import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Smile, Reply } from 'lucide-react';
import { Message } from '../../types';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';

interface ChatTabProps {
  projectId: string;
  messages: Message[];
}

const ChatTab: React.FC<ChatTabProps> = ({ projectId, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { addMessage } = useProject();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && user) {
      addMessage(projectId, {
        content: newMessage,
        senderId: user.id,
        sender: user,
        projectId,
        type: 'text',
        replyTo
      });
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = formatDate(message.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);
  const replyToMessage = messages.find(m => m.id === replyTo);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#3c405b]">Project Chat</h3>
        <p className="text-sm text-gray-600">
          {messages.length} messages • Last activity: {
            messages.length > 0 ? formatTime(messages[messages.length - 1].createdAt) : 'No messages'
          }
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => {
              const isOwnMessage = message.senderId === user?.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    {/* Sender Avatar & Name */}
                    {!isOwnMessage && (
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2">
                          {message.sender.avatar && (
                            <img
                              src={message.sender.avatar}
                              alt={message.sender.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {message.sender.name}
                        </span>
                      </div>
                    )}

                    {/* Reply indicator */}
                    {message.replyTo && (
                      <div className="mb-2 px-3 py-2 bg-gray-200 rounded-lg text-xs text-gray-600 border-l-4 border-blue-400">
                        <div className="flex items-center mb-1">
                          <Reply className="h-3 w-3 mr-1" />
                          <span>Replying to message</span>
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? 'bg-[#3c405b] text-white rounded-br-md'
                          : 'bg-white text-[#2E3453] border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      {message.type === 'text' && (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      
                      {message.type === 'image' && (
                        <div>
                          <img
                            src={message.attachmentUrl}
                            alt="Shared image"
                            className="rounded-lg max-w-full h-48 object-cover"
                          />
                          {message.content && (
                            <p className="text-sm mt-2 leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      )}
                      
                      {message.type === 'document' && (
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Document</p>
                            <p className="text-xs opacity-75">{message.content}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                      <span>{formatTime(message.createdAt)}</span>
                      <button
                        onClick={() => setReplyTo(message.id)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="bg-blue-50 px-4 py-2 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-blue-600">
              <Reply className="h-4 w-4 mr-1" />
              <span>Replying to {replyToMessage.sender.name}</span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-1 truncate">
            {replyToMessage.content}
          </p>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              {/* Emoji and attachment buttons */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Image className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-[#3c405b] text-white rounded-full hover:bg-[#2E3453] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;