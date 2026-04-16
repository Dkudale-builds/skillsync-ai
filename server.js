import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
    res.send("🚀 Server is running");
});

// ================= TEST ROUTE (FOR BROWSER) =================
app.get("/analyze", (req, res) => {
    res.send("✅ Analyze route is working (use POST for real request)");
});

// ================= GROQ SETUP =================
if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY missing (check Render env)");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ================= ANALYZE ROUTE =================
app.post("/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        // ✅ Validation
        if (!text || text.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Resume text is required"
            });
        }

        console.log("📥 Request received");

        // 🔥 AI CALL
        const chat = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume analyzer. Give clean structured output."
                },
                {
                    role: "user",
                    content: `
Analyze this resume:

1. List key skills
2. Suggest improvements
3. Give FINAL score STRICTLY in format: XX/100

Resume:
${text}
`
                }
            ],
            temperature: 0.7,
            max_tokens: 800
        });

        const aiText = chat?.choices?.[0]?.message?.content || "No response";

        console.log("✅ AI response sent");

        res.json({
            success: true,
            output: aiText
        });

    } catch (err) {
        console.error("❌ ERROR:", err.message);

        res.status(500).json({
            success: false,
            error: "AI processing failed"
        });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});