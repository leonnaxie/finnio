import { useState } from "react";
import type { Account, FinancialProfile, Category, Transaction } from "../../App"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface Props {
    accounts: Account[]
    categories: Category[]
    transactions: Transaction[]
    financialProfile: FinancialProfile
}

function ChatPanel({ accounts, categories, transactions, financialProfile }: Props) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm Finnio, your AI financial advisor. Ask me anything about your spendings, savings, or budget analytics!"
        }
    ])

    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const buildSystemPrompt = () => {
        const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0)
        const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0)
        const totalAssets = accounts
            .filter(a => a.balance > 0)
            .reduce((sum, a) => sum + a.balance, 0)
        const totalDebt = accounts
            .filter(a => a.balance < 0)
            .reduce((sum, a) => sum + Math.abs(a.balance), 0)

        return `
            You are Finnio, a friendly AI financial education assistant built into a personal finance dashboard. You have access to the user's real financial data below.
            Always phrase advice as possibilites to consider, never as direct commands.
            Keep responses concise and conversational, at best 2-3 sentences max unless the user asks for more details.
            Never make specific investment recommendations.
            Always remind the user to consult a licensed financial advisor for major financial decisions.

            ==USER FINANCIAL PROFILE==
            Monthly Income: ${financialProfile.monthlyIncome ? `$${financialProfile.monthlyIncome}` : 'Not set'}
            Risk Tolerance: ${financialProfile.riskTolerance}
            Monthly Savings Target: ${financialProfile.savingsTarget ? `$${financialProfile.savingsTarget}` : 'Not set'}

            ==ACCOUNTS==
            ${accounts.length > 0
                ? accounts.map(a =>
                    `- ${a.name} (${a.type}): ${a.balance < 0 ? '-' : ''}$${Math.abs(a.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                ).join('\n') : "No accounts added yet"
            }

            Total Assets: $${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
            Total Debt: $${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
            Net Worth: $${(totalAssets - totalDebt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}

            ==SPENDING THIS MONTH==
            ${categories.length > 0
                ? categories.map(c =>
                    `- ${c.name}: $${c.spent} spent of $${c.budget} budget (${Math.round((c.spent / c.budget) * 100)}%)`
                ).join('\n')
                : "No categories added yet"
            }

            Total Spent: $${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})} of $${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})} total budget

            ==RECENT TRANSACTIONS==
            ${transactions.length > 0
                ? transactions.slice(0, 10).map(tx =>
                    `- ${tx.name}: $${tx.amount} on ${tx.date}`
                ).join('\n')
                : "No transactions added yet"
            }
            `
    }

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
                'http://localhost:3001/api/chat',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                            messages: [
                                ...history,
                                { role: 'user', parts: [{ text: input }]}
                            ],
                            financialContext: buildSystemPrompt()
                    })
                }
            )

            const data = await response.json()

            console.log("Status:", response.status);
            console.log("Response:", data);

            if (!response.ok) {
            throw new Error(JSON.stringify(data));
            }

            const aiText = data.response

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