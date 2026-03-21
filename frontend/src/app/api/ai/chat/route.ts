import { NextResponse } from 'next/server';

// Standard runtime for maximum compatibility
export async function POST(request: Request) {
    let query = '';
    let history: any[] = [];
    try {
        const body = await request.json();
        query = body.query;
        history = body.history;
        
        let API_KEY = process.env.HUGGINGFACE_API_KEY || "";
        let cleanApiKey = API_KEY.trim().replace(/^Bearer\s+/i, '');

        if (!cleanApiKey) {
            return NextResponse.json({ 
                response: "HUGGINGFACE_API_KEY is missing. Please set it in Vercel settings." 
            });
        }

        // Use the most stable Hugging Face endpoint
        const modelId = "mistralai/Mistral-7B-Instruct-v0.3";
        const endpoint = `https://api-inference.huggingface.co/models/${modelId}/v1/chat/completions`;

        console.log(`🔄 StackAI calling stable endpoint: ${modelId}`);

        const response = await fetch(endpoint, {
            headers: { 
                "Authorization": `Bearer ${cleanApiKey}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                model: modelId,
                messages: [
                    { role: "system", content: "You are StackAI, a helpful tutor. Give short, concise answers." },
                    ...history.slice(-3).map((m: any) => ({
                        role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
                        content: m.content || m.text
                    })),
                    { role: "user", content: query }
                ],
                max_tokens: 300,
                temperature: 0.7,
            }),
        });

        // Robust check for JSON response
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error('❌ Non-JSON Response:', text.substring(0, 200));
            return NextResponse.json({ 
                response: `[API Error]: Service returned non-JSON response. Status: ${response.status}. This usually means the API key is invalid or the service is down.` 
            });
        }

        const result = await response.json();
        
        if (result.choices && result.choices[0]?.message) {
            return NextResponse.json({ response: result.choices[0].message.content.trim() });
        }
        
        if (result.error) {
            return NextResponse.json({ response: `[AI Error]: ${result.error.message || result.error}` });
        }

        throw new Error('Unexpected API response structure');

    } catch (error: any) {
        console.error('❌ Critical AI Error:', error);
        return NextResponse.json({ 
            response: `StackAI Connection Issue: ${error.message}. Please verify your Hugging Face API key is correct and not expired.` 
        });
    }
}
