'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, User, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';

export default function FloatingAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
        { role: 'ai', text: 'Hello! I am your LearnStack AI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-ai', handleOpen);
        return () => window.removeEventListener('open-ai', handleOpen);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const getAIResponse = (query: string): string => {
        const q = query.toLowerCase();

        // AI Definitions
        if (q.includes('what is ai') || q.includes('artificial intelligence')) {
            return "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. On LearnStack, we use AI to personalize your learning paths and help you master complex topics faster.";
        }

        // Subject Specifics
        if (q.includes('java')) {
            return "Java is a high-level, class-based, object-oriented programming language. Our 'Java Full Stack Development' course covers everything from Core Java fundamentals to building robust backends with Spring Boot and integrating them with modern React frontends. It's a great choice for enterprise-level applications.";
        }
        if (q.includes('python') || q.includes('data science')) {
            return "Python is the leading language for Data Science due to its simplicity and powerful libraries. Our 'Data Science with Python' course dives deep into NumPy for numerical data, Pandas for data manipulation, and Scikit-Learn for Machine Learning. You'll learn to build predictive models from scratch!";
        }
        if (q.includes('web development') || q.includes('next.js') || q.includes('react')) {
            return "Web Development is rapidly evolving with frameworks like Next.js. Our 'Full-Stack Web Development' course teaches you how to build fast, SEO-friendly applications using React, Node.js, and modern CSS. You'll master Server Actions, Routing, and Database integration.";
        }

        // Feature & Career Questions
        if (q.includes('payment') || q.includes('enroll') || q.includes('cost') || q.includes('buy')) {
            return "You can enroll in any course for just ₹499. We support secure payments via Google Pay and PhonePe. Once you complete the payment, the course modules and certificates will be instantly unlocked for your account.";
        }
        if (q.includes('certificate') || q.includes('job') || q.includes('placement')) {
            return "Yes! Upon completing any LearnStack course with at least 90% progress, you will receive an industry-recognized certificate. Our curriculum is designed based on current job market requirements to help you land your dream role in tech.";
        }
        if (q.includes('how to start') || q.includes('beginner')) {
            return "If you're new to coding, I recommend starting with 'Python Basics' or 'Introduction to Web Development'. These courses are beginner-friendly and provide a solid foundation. Which area interests you more: Web Apps or Data Analysis?";
        }

        // Greetings & Identity
        if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
            return "Hello! I'm StackAI, your dedicated learning companion. I can help you understand complex concepts, choose the right course, or help with enrollment. What's on your mind today?";
        }
        if (q.includes('who are you') || q.includes('what can you do')) {
            return "I am StackAI, an intelligent assistant built into LearnStack. I can explain coding concepts, provide course roadmaps, help with technical issues, and guide you through your learning journey.";
        }

        return "That's an interesting question! While I'm still learning, I can tell you that following your current LearnStack module is the best way to progress. Would you like me to explain a specific topic from your course or help you with enrollment details?";
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response processing
        setTimeout(() => {
            const aiResponse = getAIResponse(userMessage);
            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110",
                    isOpen ? "bg-white text-black rotate-90" : "bg-primary text-white"
                )}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-white border-2 border-primary"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-[#0f0f13] border border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-primary to-indigo-600 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <Bot className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg leading-none">StackAI</h3>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1 italic flex items-center gap-1">
                                <Sparkles size={10} /> Powered by LearnStack-Engine
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                        {messages.map((msg, i) => (
                            <div key={i} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                                <div className={clsx(
                                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-white/5 text-gray-300 border border-white/10 rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-tighter flex items-center gap-1">
                                    {msg.role === 'user' ? <>YOU <User size={8} /></> : <><Bot size={8} /> STACK-AI</>}
                                </span>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex flex-col items-start bg-white/5 p-4 rounded-2xl border border-white/10 animate-pulse">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer / Input */}
                    <div className="p-6 border-t border-white/5 bg-[#0a0a0c]">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask StackAI anything..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-gray-600"
                            />
                            <button
                                onClick={handleSend}
                                className="absolute right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="flex justify-center gap-6 mt-4 opacity-30 group">
                            <BrainCircuit size={16} className="text-primary grayscale group-hover:grayscale-0 transition duration-500" />
                            <Sparkles size={16} className="text-secondary grayscale group-hover:grayscale-0 transition duration-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
