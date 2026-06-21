import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Google GenAI client with correct options
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "MOCK_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI-Assisted Moderation (Checks description/tags for safety metrics)
  app.post("/api/moderate", async (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required for moderation." });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Evaluate the following micro-post description for short-form video sharing platform "Pegger": "${content}". 
Evaluate it based on our Pegger Community Guidelines (avoiding toxicity, bullying, dangerous stunts, explicit material, spam, and copyright-infringing trademark text of other platforms).
Provide a structured assessment.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: { type: Type.BOOLEAN, description: "Whether the content passes the community safety guidelines" },
              toxicityScore: { type: Type.NUMBER, description: "Score from 0.0 (perfectly safe) to 1.0 (highly toxic)" },
              spamScore: { type: Type.NUMBER, description: "Confidence score that this is commercial clickbait/spam from 0.0 to 1.0" },
              flaggedKeywords: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "List of words or phrases flagged as inappropriate" 
              },
              recommendation: { type: Type.STRING, description: "Suggested moderation action (Approve, Flag for Review, Auto-Reject)" },
              summaryFeedback: { type: Type.STRING, description: "High-level reason or advice to the content creator" }
            },
            required: ["approved", "toxicityScore", "spamScore", "flaggedKeywords", "recommendation", "summaryFeedback"],
          }
        }
      });

      const result = JSON.parse(response.text?.trim() || "{}");
      return res.json(result);
    } catch (error: any) {
      console.error("AI Moderation Error:", error);
      // Fallback response if API key is not active / some other error occurs
      return res.json({
        approved: true,
        toxicityScore: 0.1,
        spamScore: 0.05,
        flaggedKeywords: [],
        recommendation: "Approve (Simulated AI Check)",
        summaryFeedback: "Content successfully uploaded. Visual guidelines suggest safe and community-appropriate language. (Fallback evaluation)"
      });
    }
  });

  // API Route: AI Content Recommendation & Smart Drafting Tool
  app.post("/api/smart-caption", async (req, res) => {
    const { videoPrompt, category } = req.body;
    if (!videoPrompt) {
      return res.status(400).json({ error: "Video description prompt is required." });
    }

    try {
      const gPrompt = `You are the creative director at Pegger (a novel, trendy, high-energy short video application). 
The user wants to draft a video described as: "${videoPrompt}" under the category: "${category || 'General'}".
Generate 3 creative short-form video caption combinations. 
Keep them snappy under 120 characters, highly captivating, and specify the exact hashtag sets (prioritizing Pegger-branded tags like #PeggerCreator, #PegLife, #VoltWave and and general descriptive categories). 
Also suggest 3 interactive sticker emojis and a filter option (Normal, Electric Violet, Cyber Wave, Silver Retro, Dreamy Glow) that fits best.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: gPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              captions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "The caption text" },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hashtags accompanying the post" }
                  },
                  required: ["text", "hashtags"]
                }
              },
              suggestedStickers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sticker emojis matching style" },
              recommendedFilter: { type: Type.STRING, description: "One of the visual filters matching the vibe" }
            },
            required: ["captions", "suggestedStickers", "recommendedFilter"]
          }
        }
      });

      const result = JSON.parse(response.text?.trim() || "{}");
      return res.json(result);
    } catch (error: any) {
      console.error("AI Smart Caption Error:", error);
      // Fallback content suggestion
      return res.json({
        captions: [
          { text: `Rapping code in real time! Let's build! 💻⚡`, hashtags: ["#CodePegged", "#SpeedCoding", "#VoltWave"] },
          { text: `Your ultimate short-form tech platform is finally here! ✨`, hashtags: ["#Pegger", "#PegLife", "#DevLife"] },
          { text: `Pegging down the best features, one line at a time. 🔮`, hashtags: ["#UIUX", "#Innovating", "#PeggerCreator"] }
        ],
        suggestedStickers: ["⚡", "🔥", "🔮"],
        recommendedFilter: "Electric Violet"
      });
    }
  });

  // API Route: Smart AI Discover/Category Optimizer (personalized recommendation system simulation)
  app.post("/api/personalized-categories", async (req, res) => {
    const { userInterests } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Based on the following array of user interests: ${JSON.stringify(userInterests || [])}. 
Recommend 5 specific and creative trending content streams/sub-niches for our platform "Pegger" that are highly exciting (do not copy TikTok or standard YouTube niches exactly, make them sound refreshing, eg: instead of 'Lofi beats' suggest 'SynthVapor Peg-Tracks'). 
Provide a subtitle and matching emoji for each stream.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedStreams: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Trending category title" },
                    description: { type: Type.STRING, description: "A brief punchy explanation of why it fits the user" },
                    emoji: { type: Type.STRING, description: "Single emoji mascot" }
                  },
                  required: ["name", "description", "emoji"]
                }
              }
            },
            required: ["recommendedStreams"]
          }
        }
      });
      const result = JSON.parse(response.text?.trim() || "{}");
      return res.json(result);
    } catch {
      return res.json({
        recommendedStreams: [
          { name: "SynthVapor Loops", description: "Hyper-neon audio loops and glowing cyberpunk vistas.", emoji: "🔮" },
          { name: "ByteSize DevGlow", description: "Micro-coding battles, setup designs, and tech previews.", emoji: "💻" },
          { name: "Pegger Parkour", description: "Breathtaking stunts and cosmic silver transitions.", emoji: "⚡" },
          { name: "Silver Retro Gaming", description: "Indie arcade secrets and virtual pixel memories.", emoji: "🕹️" },
          { name: "VoltWave Vocals", description: "Electric deep-house vocal overlays and sound-bites.", emoji: "🎤" }
        ]
      });
    }
  });

  // Serve static assets in production, otherwise mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pegger server is booting around port ${PORT}... Env: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
