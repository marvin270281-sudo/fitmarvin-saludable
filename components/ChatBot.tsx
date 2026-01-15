import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/geminiService';
import { ChatMessage, ChatRole } from '../types';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: ChatRole.USER, text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for Gemini
            const history = messages.map(m => ({
                role: m.role === ChatRole.USER ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const responseText = await chatWithGemini(userMsg.text, history);
            const botMsg: ChatMessage = { role: ChatRole.MODEL, text: responseText, timestamp: Date.now() };
            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error("ChatBot Error Details:", error);
            const errorMessage = error.message || "Error desconocido de red";
            const displayError = errorMessage.includes("API Key")
                ? "Error de Configuración: No se encontró la API Key."
                : `Error: ${errorMessage}`;

            const errorMsg: ChatMessage = { role: ChatRole.MODEL, text: displayError, timestamp: Date.now() };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="bg-white dark:bg-surface-dark w-[350px] md:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 dark:border-border-dark flex flex-col overflow-hidden mb-4 pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-primary p-4 flex justify-between items-center text-black">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">smart_toy</span>
                            <span className="font-bold text-lg">Marvin AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-full">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background-light dark:bg-background-dark">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-500 mt-10">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
                                <p className="text-sm">¡Hola! Soy tu asistente Marvin. Pregúntame sobre tus rutinas, nutrición o cualquier duda fitness.</p>
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === ChatRole.USER
                                        ? 'bg-primary text-black rounded-tr-none'
                                        : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark text-slate-800 dark:text-slate-200 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-2 items-center">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-border-dark">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Escribe un mensaje..."
                                className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl pr-12 pl-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-16 w-16 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 pointer-events-auto ${isOpen ? 'bg-slate-800 text-white' : 'bg-primary text-black'}`}
            >
                <span className="material-symbols-outlined text-3xl">{isOpen ? 'close' : 'chat'}</span>
            </button>
        </div>
    );
};

export default ChatBot;
