import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API: Diagnose Plant Specimen via Gemini 3.8 Flash Vision / Reasoning
app.post('/api/diagnose', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', symptoms = '', plantHint = '' } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    const systemPrompt = `You are Dr. Leafy, an expert clinical botanical diagnostic physician and plant pathologist.
Analyze this houseplant specimen, determine any diseases, pests, physiological stressors (under/overwatering, light burn, mineral toxicity, pest infestation), and output a clinical care protocol.

You MUST respond strictly in valid JSON matching this schema:
{
  "name": "Plant common name (e.g. Monstera Deliciosa)",
  "commonName": "Common colloquial name (e.g. Swiss Cheese Plant)",
  "latinName": "Full botanical binomial name (e.g. Monstera Deliciosa Liebm.)",
  "matchPct": "Confidence percentage string (e.g. 96% match)",
  "baseVigor": 80, // Number 40-95
  "severity": {
    "text": "Condition name (e.g. Moderate Under-watering & Leaf Blight)",
    "chip": "Triage stage (e.g. Stage 2 Triage)",
    "icon": "warning | bug_report | check_circle | humidity_percentage",
    "colorClass": "text-alert-terracotta | text-tertiary | text-success-leaf",
    "bgClass": "bg-[#FAF0E6] | bg-[#EAF4EE]"
  },
  "prognosis": {
    "prognosisText": "Short prognosis (e.g. Prognosis: Optimistic (14–21 days))",
    "prognosisSummary": "Summary (e.g. High Recovery Likelihood)",
    "prognosisDetail": "HTML string with recovery expected timeframe in <strong> tags",
    "checkinText": "Next check-in: In X days"
  },
  "companionVoice": {
    "speaker": "Name's Voice (e.g. Monstera's Voice)",
    "initialEmoji": "Emoji combo (e.g. 🥺🌿)",
    "happyEmoji": "Happy emoji combo (e.g. 🌿😊)",
    "moodBadge": "! or ⚠️",
    "voiceQuote": "First person quote from the plant describing its distress",
    "happyVoiceQuote": "First person quote from the plant when revived"
  },
  "drNote": "Encouraging clinical advice quote from Dr. Leafy",
  "pathology": {
    "primaryTitle": "Primary diagnosis title (e.g. Primary: Early Chlorosis & Soil Compaction)",
    "priorityBadge": "Priority 1 | Critical Triage | Stabilized",
    "primaryDesc": "Detailed botanical explanation of cellular/foliar distress",
    "diffTags": [
      { "text": "Differential diagnosis with status", "type": "info | cancel" }
    ]
  },
  "phases": [
    {
      "number": 1,
      "title": "Phase 1 • Day 0: Emergency Care",
      "badge": "Immediate action",
      "badgeClass": "text-alert-terracotta bg-[#FAF0E6] border border-alert-terracotta/15",
      "circleBg": "bg-primary-container text-on-primary",
      "tasks": [
        { "id": "t1", "title": "Task title", "time": "e.g. 45 mins", "desc": "Detailed instructional steps", "completed": false },
        { "id": "t2", "title": "Task title", "time": "e.g. 10 mins", "desc": "Detailed instructional steps", "completed": false }
      ]
    },
    {
      "number": 2,
      "title": "Phase 2 • Week 1: Active Treatment",
      "badge": "",
      "circleBg": "bg-secondary text-on-secondary",
      "tasks": [
        { "id": "t3", "title": "Task title", "time": "e.g. 5 mins", "desc": "Detailed instructional steps", "completed": false },
        { "id": "t4", "title": "Task title", "time": "e.g. Daily", "desc": "Detailed instructional steps", "completed": false }
      ]
    },
    {
      "number": 3,
      "title": "Phase 3 • Week 2–4: Recovery & New Growth",
      "badge": "",
      "circleBg": "bg-outline text-surface-card",
      "tasks": [
        { "id": "t5", "title": "Task title", "time": "e.g. Weekly", "desc": "Detailed instructional steps", "completed": false },
        { "id": "t6", "title": "Task title", "time": "e.g. Week 3", "desc": "Detailed instructional steps", "completed": false }
      ]
    }
  ],
  "treatmentProtocols": {
    "organicRemedies": [
      {
        "title": "DIY Homemade Remedy Title",
        "badge": "100% Pet-Safe | Organic Standard | Gentle Tonic",
        "desc": "Recipe and application instruction",
        "usage": "Application frequency"
      }
    ],
    "commercialSolutions": [
      {
        "title": "Commercial Product Solution",
        "badge": "Keep away from pets | Child-safe capped",
        "desc": "Active chemical/mineral ingredient and mode of action",
        "linkText": "Find & Buy"
      }
    ]
  }
}`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      });
    }

    const textContent = `Diagnose this specimen.\nObserved symptoms: ${symptoms || 'None specifically provided'}.\nPlant type hint: ${plantHint || 'Unknown houseplant'}.`;
    parts.push({ text: textContent });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Diagnosis error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to complete diagnosis',
    });
  }
});

// API: Search Grounding via Google Search + Gemini Model
app.post('/api/search-grounding', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    const prompt = `Search for up-to-date botanical, horticultural, and plant care knowledge about: "${query}".
Provide a concise, helpful, and scientifically accurate plant care breakdown including:
1. Plant profile and care essentials (light, moisture, temperature)
2. Common foliar or root issues and remedies
3. Safe treatment protocols and pet toxicity facts.
Keep it formatted cleanly with clear markdown headings and bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    // Format sources
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return res.json({
      text,
      sources,
      webSearchQueries,
    });
  } catch (error: any) {
    console.error('Search grounding error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to run search grounding',
    });
  }
});

// API: Ask Dr. Leafy Consultation / Soil Probe Follow-up
app.post('/api/ask-doctor', async (req, res) => {
  try {
    const { question, patientContext, soilMoisture } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    const prompt = `You are Dr. Leafy, an empathetic, encouraging, and scientifically rigorous plant doctor.
The user is checking in on their patient:
Patient Context: ${JSON.stringify(patientContext || {})}
Current Soil Moisture Reading: ${soilMoisture || 'Not specified'}
User's Observation/Question: ${question || 'Checking in on soil and recovery status'}

Provide a 2-3 sentence reassuring and actionable clinical advice note for the botanist caregiver. Include what immediate next step they should take (e.g. aerating, withholding water, bottom-soaking, misting).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are Dr. Leafy, an expert friendly plant doctor.',
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return res.json({ reply, sources });
  } catch (error: any) {
    console.error('Ask doctor error:', error);
    return res.status(500).json({
      error: error.message || 'Doctor consultation failed',
    });
  }
});

// API: Auth Simulation (Email & Mobile)
app.post('/api/auth/send-otp', async (req, res) => {
  const { type, destination } = req.body; // type: 'mobile' | 'email'
  if (!destination) {
    return res.status(400).json({ error: 'Email or Mobile number is required' });
  }
  // Generate demo 6-digit OTP
  const otp = '882100'; // Recognizable demo OTP matching patient DL-8821
  return res.json({
    success: true,
    message: `Verification code sent to ${destination}`,
    demoOtp: otp,
  });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { destination, otp, type, name } = req.body;
  if (!destination || !otp) {
    return res.status(400).json({ error: 'Destination and verification code are required' });
  }
  // Any 6-digit code or demo OTP is accepted
  const user = {
    id: 'user_leafy_' + Math.random().toString(36).substring(2, 8),
    name: name || (type === 'mobile' ? `Botanist ${destination.slice(-4)}` : destination.split('@')[0]),
    email: type === 'email' ? destination : `${destination.replace(/[^0-9]/g, '')}@botanist.drleafy.ai`,
    phone: type === 'mobile' ? destination : '+1 (555) 234-5678',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBvQfTJJBjWAZkoIL3H6qVdfjNX8MS1aktaurhzzaqpUY5vLSZ0SXF-DGhgzAwtfkXSxpp7xgPzgzeQsGCzziytJKk9ama4gWInS03dQUkLwAmcK5hgVPmTiedfWoc_HjThGbnrefsSKIPlZl-4rolX-1rzTTXXEqKUbvjyz1ulBOkx2ZkEFxUl6Z8OHPUD4v_Yuzpc6lVP9D8N0nUIHovhJhaXrRznDtzAyeOtOHyUtdvEd9LnGRB4w',
    role: 'Lead Conservatory Caregiver',
    joinedDate: 'October 2026',
    activePatientsCount: 3,
  };
  return res.json({ success: true, user });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Dr. Leafy server listening on port ${port}`);
  });
}

startServer();
