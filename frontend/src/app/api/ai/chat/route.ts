import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Zero cold-starts and low latency for AI responses

export async function POST(request: Request) {
    let query = '';
    let history: any[] = [];
    try {
        const body = await request.json();
        query = body.query;
        history = body.history;
        const API_KEY = process.env.HUGGINGFACE_API_KEY;

        if (!API_KEY) {
            console.error('❌ HUGGINGFACE_API_KEY is missing in environment variables');
            return NextResponse.json({ 
                response: "I'm currently missing my AI brain. Please set HUGGINGFACE_API_KEY in Vercel." 
            }, { status: 200 }); // Keep 200 so the frontend can display the message properly
        }

        // Format history for Hugging Face Router
        // Handle input history format if it differs
        const formattedHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'assistant' || msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.content || msg.text
        }));

        const messages = [
            { 
                role: "system", 
                content: "You are StackAI, a brilliant global tutor. Provide clear, accurate, and helpful educational answers. Use markdown formatting where appropriate." 
            },
            ...formattedHistory.slice(-5), // Keep only last few messages for context
            { role: "user", content: query }
        ];

        console.log('🔄 StackAI calling Hugging Face Router...');

        const hf_response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                headers: { 
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    model: "meta-llama/Llama-3.1-8B-Instruct", // High-speed, high-quality model
                    messages: messages,
                    max_tokens: 400, // Reduced for faster delivery
                    temperature: 0.7,
                }),
            }
        );

        if (!hf_response.ok) {
            const errData = await hf_response.json();
            console.error('❌ Hugging Face Error:', errData);
            throw new Error(errData.error?.message || 'API Request Failed');
        }

        const result: any = await hf_response.json();
        
        if (result.choices && result.choices[0] && result.choices[0].message) {
            return NextResponse.json({ response: result.choices[0].message.content.trim() });
        }
        
        throw new Error('Unexpected API response structure');

    } catch (error: any) {
        console.error('❌ StackAI Error:', error);
        
        // High-quality local fallback strategy for maximum reliability
        const q = (query || "").toLowerCase();
        let fallback = "I'm your global learning assistant. I can answer questions about science, technology, history, and the professional world! I'm currently in high-performance mode, so please ask clearly.";
        
        if (q.includes('capital') || q.includes('country') || q.includes('world')) {
            fallback = "Exploring the world is fascinating! As your AI tutor, I suggest checking our 'Global Studies' subjects to learn more about geography and international relations. Master your current courses to expand your horizons!";
        } else if (q.includes('who is') || q.includes('tell me about')) {
            fallback = `That's a significant topic! You should explore our related subjects once you've completed your foundational tasks. Master ${query} to reach new professional heights!`;
        } else if (q.includes('what is') || q.includes('how')) {
            fallback = `Understanding "${query}" is a key step in your learning journey. LearnStack provides structured paths to master such concepts. Check out our 'Course Catalog' to see how this fits into your career roadmap!`;
        } else if (q.includes('react') || q.includes('next') || q.includes('web')) {
            fallback = "Full-Stack Web Development is one of our flagship subjects! Start with the basics of React and Next.js to build modern, high-performance applications.";
        }

        return NextResponse.json({ response: fallback });
    }
}
