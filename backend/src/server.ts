import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoute from "./routes/chat";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.use('/api/chat', chatRoute)

app.get('/health', (req, res) => {
    res.json({ status: "Finnio backend is running" })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})