import { useState } from "react";

interface Message {
    role: 'user' | 'assistant'
    content: string
}

function ChatPanel() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm Finnio, your AI financial advisor. Ask me anything about your spendings, savings, or budget analytics!"
        }
    ])

    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return
        
        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }))

            const response = await fetch(
                `/gemini/v1beta/models/gemini-3.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_SECRET_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: {
                            parts: [{
                                text: `You are Finnio, a friendly AI financial educational assistant. Give conversational, helpful insights about personal finance that the user asks about. Always phrase advice as possibilities to consider, never as direct commands. Keep responses concise and easy to read. End responses with a reminder to always consult a professional for major decisions.`
                            }]
                        },
                    contents: [
                        ...history,
                        { role: 'user', parts: [{ text: input }]}
                    ]
                    })
                }
            )

            const data = await response.json()

            console.log("Status:", response.status);
            console.log("Response:", data);

            if (!response.ok) {
            throw new Error(JSON.stringify(data));
            }

            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I was unable to generate a response."

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: aiText
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, something went wrong. Please try again."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }


    return (
        <aside className="w-72 min-w-[288px] bg-finnio-ai-chat flex flex-col p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">chat with finnio</h2>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                            msg.role === 'user'
                            ? 'bg-blue-200 text-white'
                            : 'bg-finnio-card-3 text-white'
                        }`}>{msg.content}</div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-finnio-card-1 rounded-xl px-3 py-2 text-sm opacity-70">Finnio is thinking...</div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    placeholder="Ask Finnio..."
                    className="flex-1 bg-gray-200 rounded-lg px-3 py-2 text-finnio-sidebar outline-none text-gray-800"
                />
                <button className="bg-blue-500 rounded-lg px-3 py-2 text-sm"
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}>
                    →
                </button>
            </div>
        </aside>
    )
}

export default ChatPanel