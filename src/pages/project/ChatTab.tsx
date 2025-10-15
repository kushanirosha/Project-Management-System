import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Image,
  Smile,
  Reply,
  RefreshCw,
  X,
  Download,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Message } from "../../types";

interface ChatTabProps {
  projectId: string;
}

const API_URL = "http://localhost:5000/api/chat";

const ChatTab: React.FC<ChatTabProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : { id: "temp-id", name: "User", role: "client" };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/${projectId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    formData.append("senderId", user.id);
    formData.append("senderName", user.name);
    formData.append("senderRole", user.role);
    formData.append("type", file ? getFileType(file) : "text");

    if (replyTo) formData.append("replyTo", replyTo);
    if (file) formData.append("file", file);

    try {
      await axios.post(`${API_URL}/${projectId}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewMessage("");
      setFile(null);
      setReplyTo(null);
      fetchMessages();
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  const getFileType = (file: File): "image" | "document" => {
    if (file.type.startsWith("image/")) return "image";
    return "document";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((m) => {
      const date = formatDate(m.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);
  const replyToMessage = messages.find((m) => m._id === replyTo);
  const lastMessageTime = messages.length
    ? messages[messages.length - 1].createdAt
    : null;

  // Close image zoom with ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-[#3c405b]">Project Chat</h3>
          <p className="text-sm text-gray-600">
            {messages.length} messages • Last activity:{" "}
            {lastMessageTime ? formatTime(lastMessageTime) : "No messages"}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="p-2 text-gray-500 bg-gray-200 hover:bg-gray-500 hover:text-gray-100 rounded-md"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex items-center justify-center my-6">
              <div className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                {date}
              </div>
            </div>

            {dateMessages.map((message) => {
              const isOwnMessage = message.senderId === user.id;
              return (
                <div
                  key={message._id}
                  className={`flex mb-4 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      isOwnMessage ? "order-2" : "order-1"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs font-medium">
                          {message.senderName[0]}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          {message.senderName}
                        </span>
                      </div>
                    )}

                    {/* Reply preview */}
                    {message.replyTo && (
                      <div className="mb-2 px-3 py-2 bg-gray-200 rounded-lg text-xs text-gray-600 border-l-4 border-blue-400">
                        <div className="flex items-center mb-1">
                          <Reply className="h-3 w-3 mr-1" />
                          <span>Replying to message</span>
                        </div>
                        <p className="truncate">
                          {messages.find((m) => m._id === message.replyTo)
                            ?.content || "Message deleted"}
                        </p>
                      </div>
                    )}

                    {/* Message Content */}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-[#3c405b] text-white rounded-br-md"
                          : "bg-white text-[#2E3453] border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      {message.type === "text" && (
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => (
                              <p className="text-sm leading-relaxed" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}

                      {message.type === "image" && (
                        <div className="relative group mt-2">
                          <img
                            src={message.attachmentUrl}
                            alt="Shared"
                            className="rounded-lg max-w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                            onClick={() => setPreviewImage(message.attachmentUrl)}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                            <a
                              href={message.attachmentUrl}
                              download
                              className="bg-black/50 p-1 rounded-full text-white hover:bg-black"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      )}

                      {message.type === "document" && (
                        <div className="flex items-center mt-2 text-sm">
                          <Paperclip className="h-4 w-4 mr-2 text-gray-400" />
                          <a
                            href={message.attachmentUrl}
                            download
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            Download Document
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                      <span>{formatTime(message.createdAt)}</span>
                      <button
                        onClick={() => setReplyTo(message._id)}
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

      {/* Image Zoom Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="bg-blue-50 px-4 py-2 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-blue-600">
              <Reply className="h-4 w-4 mr-1" />
              <span>Replying to {replyToMessage.senderName}</span>
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

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (supports markdown links)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <label className="p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                  <Image className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files && setFile(e.target.files[0])
                    }
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                </label>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !file}
            className="p-3 bg-[#3c405b] text-white rounded-full hover:bg-[#2E3453] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* File Preview */}
        {file && (
          <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
            <Paperclip className="h-4 w-4 mr-2" />
            <span className="truncate">{file.name}</span>
            <button
              className="ml-auto text-gray-500 hover:text-red-500"
              onClick={() => setFile(null)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;
