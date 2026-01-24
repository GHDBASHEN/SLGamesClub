'use client';

import { useState, useEffect, useRef } from "react";
import { FaCommentDots, FaPaperPlane, FaTimes } from "react-icons/fa";
import { getChatMessages, sendChatMessage } from "@/lib/actions";

interface MessageType {
    _id: string;
    content: string;
    author: { name: string; image: string; _id: string };
    createdAt: string;
}

export default function WorldChat({ currentUser }: { currentUser: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial fetch function
    const fetchMessages = async () => {
        const msgs = await getChatMessages();
        setMessages(msgs);
    };

    // Polling effect
    useEffect(() => {
        if (isOpen) {
            fetchMessages(); // Fetch immediately when opened
            const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        setLoading(true);
        const tempContent = newMessage;
        setNewMessage(""); // Clear input immediately

        // Optimistic update
        const optimisticMsg: MessageType = {
            _id: Math.random().toString(),
            content: tempContent,
            author: {
                name: currentUser.name,
                image: currentUser.image,
                _id: currentUser._id
            },
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        await sendChatMessage(tempContent);
        setLoading(false);
        fetchMessages(); // Refresh to ensure sync
    };

    if (!currentUser) return null; // Only for logged-in users

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Trigger Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
                    title="World Chat"
                >
                    <FaCommentDots size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-gray-900 border border-gray-700 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <h3 className="font-bold text-white">World Chat</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-900/95">
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm mt-4">Say hello to the world! 👋</p>
                        ) : (
                            messages.map((msg) => {
                                const isMe = msg.author._id === currentUser._id;
                                return (
                                    <div key={msg._id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <img
                                            src={msg.author.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"}
                                            className="w-8 h-8 rounded-full bg-gray-800 object-cover mt-1"
                                            title={msg.author.name}
                                        />
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                            {!isMe && <p className="text-xs text-indigo-300 font-bold mb-0.5">{msg.author.name}</p>}
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={loading || !newMessage.trim()}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            <FaPaperPlane size={14} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
