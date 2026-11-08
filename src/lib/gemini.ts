import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
    throw new Error("GEMINI API KEY is not set environment variables")
}
const ai = new GoogleGenAI({ apiKey })

export async function analyzeWithGemini(
    text: string,
    analysisType: "summary" | "qna" | "sentiment" | "entities" | "extract",
) {
    try {
        const prompts = {
            summary: `Please provide a comprehensive summary of the following document. Include main points, key findings, and conclusions:\n\n${text}`,
            qna: `Based on the following document, generate 5 important questions and their answers:\n\n${text}`,
            sentiment: `Analyze the sentiment and tone of the following document. Provide overall sentiment (positive/negative/neutral) and key emotional tones detected:\n\n${text}`,
            entities: `Extract all named entities (people, organizations, locations, dates, etc.) from the following document:\n\n${text}`,
            extract: `Extract key information from the following document in structured format:\n\n${text}`,
        }

        const prompt = prompts[analysisType]
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt
        })

        return response.text
    } catch (error) {
        console.error("Gemini error:", error)
        return `Could not analyze for ${analysisType}`
    }
}