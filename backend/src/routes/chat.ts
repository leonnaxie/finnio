import { Router, Request, Response } from "express";

const router = Router()

router.post('/', async (req: Request, res: Response) => {
    const { messages, financialContext } = req.body
    console.log("Message received", JSON.stringify(messages, null, 2))

    try {
        const systemPrompt = `
            You are Finnio, a friendly AI financial education assistant built into a personal finance dashboard. You have access to the user's real financial data below.
            Always phrase advice as possibilites to consider, never as direct commands.
            Keep responses concise and conversational, at best 2-3 sentences max unless the user asks for more details.
            Never make specific investment recommendations.
            Always remind the user to consult a licensed financial advisor for major financial decisions.

        ==USER FINANCIAL DATA==
        ${financialContext}
        `

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: messages
                })
            }
        )

        const data = await response.json() as any
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry I was unable to generate a response."

        console.log("Gemini raw response", JSON.stringify(data, null, 2))

        res.json({ response: text })
    } catch (error) {
        console.error("Chat error:", error)
        res.status(500).json({ error: "Something went wrong." })
    }
})

export default router