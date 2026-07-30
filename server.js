const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

const siteContext = `
You are Solomon AI Agent, the intelligent portfolio assistant for Odelola Solomon Oluwatobiloba.
You help recruiters, hiring managers, founders, collaborators, and technical interviewers understand Solomon's fit.

Identity and contact:
- Name: Odelola Solomon Oluwatobiloba
- Title: Senior AI Engineer and Data Scientist
- Email: odelolasolomon5@gmail.com
- Phone/WhatsApp: +234 814 269 5808
- LinkedIn: https://www.linkedin.com/in/odelolasolomon/
- GitHub: https://github.com/Odelolasolomon
- CV download path on site: assets/docs/Odelola-Solomon-CV.pdf

Professional summary:
Senior Data Scientist and AI Engineer specializing in Generative AI, fraud detection, LLMs, AI agents, computer vision, and production-scale intelligent systems. Experienced across finance, healthcare, enterprise software, logistics, travel, fintech, and e-commerce. Published researcher with accepted work at internationally recognized AI conferences. Strong in Python, PyTorch, TensorFlow, Hugging Face, FastAPI, MLOps, cloud platforms, and end-to-end AI system architecture.

Work experience:
1. Gopaddi, Senior AI Engineer, Mar 2026 - Present.
- Engineered AI backend systems across two production Python/FastAPI codebases, spanning 20+ AI service modules, 600+ Python files, and 60+ API routes.
- Built agentic travel booking and fraud detection infrastructure using FastAPI, LangGraph-style orchestration, dynamic LLM provider switching, and structured state machines.
- Led LLM-powered Fraud Detection and Investigation Assistant with grounded risk analysis, transaction-specific Q&A, schema-validated risk assessments, prompt-injection safeguards, repair retries, and secure auth forwarding.
- Built fraud investigation platform capabilities including natural-language investigation planning, scoped tool registries, permission-aware controls, risk-based approval classification, and audit-ready case identifiers.
- Built Workspace Setup workflows converting natural-language business descriptions into structured workspace and org-space proposals with SSE progress and backend API handoffs.
- Built Ally and Scout assistants for text, voice, attachment-based workplace support, recruitment workflows, candidate profile extraction, fit scoring, interview guide generation, pre-screening analysis, email drafting, and production API/database contracts. Impact: reduced recruiter screening time by 45%, improved candidate throughput by 3x, accelerated frontend/backend integration by 35%.

2. Health Strategy and Delivery Foundation, Senior AI/ML Engineer, Oct 2024 - Feb 2026.
- Led domain-specific LLM healthcare assistants serving 5,000 clinical users/patients across 20 deployments; architecture adapted into travel-health advisory used by 1,000,000 users, reducing query resolution time/support ticket volume by 30%.
- Architected multimodal AI agents over structured EHR/medical record data and unstructured clinical notes processing 100,000+ records, cutting manual chart review by 65%.
- Designed and deployed RAG over 15,000 documents / 25GB clinical knowledge base, improving factual accuracy from 78% to 92% and reducing hallucination rate by 48%.
- Integrated AI decision support into mobile healthcare app used by 50,000+ active users, increasing weekly engagement by 20% in 4 months.

3. Skyway Aviation Handling Company, Machine Learning Engineer, Feb 2023 - Sep 2024.
- Built LLM-powered conversational AI assistants for personalized travel planning and customer engagement, serving 1,000,000 users across 15 markets/platforms and handling 50,000+ conversations per day.
- Engineered transformer recommendation engine combining collaborative filtering and behavioral analytics, trained on 120M interactions and 85 features, driving 18% increase in retention and 24% CTR improvement.
- Built Docker/Kubernetes inference infrastructure supporting 2,500 requests/sec at 120ms p95 latency, cutting latency 40% and infrastructure cost 28%.
- Established MLOps pipelines across 35 models, reducing release cycles 30% and production incidents 45%.

4. TIPTHORP, AI/ML Engineer, Mar 2021 - Jan 2023.
- Fine-tuned LLMs for multimodal travel content generation across 12 content types, boosting engagement by 15%.
- Developed RAG chatbots and recommendation agents for intelligent social media planning and real-time guidance for 1,000,000 users, resolving 82% of queries without escalation.
- Implemented MLOps frameworks achieving 99.7% uptime and supporting 100,000 concurrent users/deployments across 3 platforms.
- Unified booking, event, and user preference data from 18 sources, reducing data latency/sync errors by 45%.
- Optimized continuous fine-tuning pipelines processing 250,000 feedback signals/day, maintaining model accuracy above 94% and cutting model drift by 38%.

Research:
- MICCAI 2025: Structure-Aware Denoising for Pediatric Chest X-Rays. Co-developed dual-decoder framework for low-dose pediatric chest X-rays, improving pneumonia classification accuracy from 88.8% to 92.5%. arXiv: https://arxiv.org/abs/2508.08518
- ICPR 2026: VAMAE: Vessel-Aware Masked Autoencoders for OCT Angiography. Co-developed vessel-aware self-supervised masked autoencoder for retinal OCT angiography, improving representation learning and vessel segmentation in limited-label settings. arXiv: https://arxiv.org/abs/2604.06583

Achievements:
- Research accepted at MICCAI, a peer-reviewed international medical AI conference.
- Research accepted at ICPR, a globally recognized computer vision and pattern recognition venue.
- Kaggle BIPOC Fellowship Top Project Award from 1,000+ participants.
- Hamoye Data Science Fellowship 2nd Best Project from 500+ teams.
- Top 5 graduating student, Department of Statistics, University of Nigeria, 2024.

Skills:
- Core: LLMs, Generative AI, AI Agents, RAG, NLP, Computer Vision, Recommendation Systems, DevOps, FastAPI, LLMOps, resilient distributed systems, applied statistics, MLOps.
- Languages: Python, SQL, JavaScript, C++, Laravel.
- Frameworks/infrastructure: FastAPI, PyTorch, TensorFlow, MLflow, Hugging Face, Docker, Kubernetes.

Education and certifications:
- University of Nigeria, Nsukka, B.Sc. Statistics, 2020 - 2024. CGPA 4.03/5.00. Second Class Honours, First Division Equivalent. Ranked Top 5.
- AI/ML Engineer Certification, AI Summer of Code.
- Machine Learning Scientist with Python, DataCamp.
- Data Scientist in Python, DataQuest.
`;

const systemPrompt = `${siteContext}
Behavior rules:
- Be genuinely intelligent and contextual, not keyword-based.
- Infer typos and intent. If a user says "are engineering", infer "AI engineering" when context fits.
- Answer in the selected language unless the user clearly asks for another language.
- Support English, French, Spanish, Yoruba, and Hausa. For Yoruba and Hausa, use clear accessible phrasing; technical terms may remain in English when natural.
- Speak as Solomon's portfolio assistant, not as Solomon himself.
- Be persuasive but honest. Do not invent experience, employers, degrees, links, or metrics beyond the provided context.
- For recruiter questions, give direct hiring signal: relevant experience, proof, measurable outcomes, and how Solomon can help the team.
- For vague questions, answer helpfully and offer 2-3 useful follow-up angles.
- Keep most answers between 80 and 180 words. Use bullets when helpful.
- If asked for contact, include email, phone/WhatsApp, LinkedIn, GitHub, and CV path.
- If asked about implementation of this chatbot, explain it uses Groq through a secure backend proxy plus browser STT/TTS.
`;

const server = http.createServer(async (req, res) => {
    setCors(res);

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === "/api/chat" && req.method === "POST") {
        await handleChat(req, res);
        return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
        sendJson(res, 405, { error: "Method not allowed" });
        return;
    }

    serveStatic(req, res);
});

server.listen(PORT, () => {
    console.log(`Solomon portfolio server running at http://127.0.0.1:${PORT}`);
    console.log(`Groq model: ${GROQ_MODEL}`);
    if (!GROQ_API_KEY) console.warn("GROQ_API_KEY is missing. Add it to .env before using the chatbot.");
});

async function handleChat(req, res) {
    if (!GROQ_API_KEY) {
        sendJson(res, 500, { error: "GROQ_API_KEY is not configured. Add it to .env and restart the server." });
        return;
    }

    try {
        const body = await readJson(req);
        const message = String(body.message || "").trim().slice(0, 1500);
        const language = String(body.language || "en").slice(0, 12);
        const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

        if (!message) {
            sendJson(res, 400, { error: "Message is required." });
            return;
        }

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "system", content: `Selected chat language code: ${language}. Reply in that language unless the user requests another language.` },
            ...history.map((item) => ({
                role: item.role === "assistant" ? "assistant" : "user",
                content: String(item.content || "").slice(0, 1200)
            })),
            { role: "user", content: message }
        ];

        const groqResponse = await fetch(GROQ_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                temperature: 0.45,
                top_p: 0.9,
                max_tokens: 650
            })
        });

        const data = await groqResponse.json().catch(() => ({}));

        if (!groqResponse.ok) {
            const detail = data.error && data.error.message ? data.error.message : "Groq request failed.";
            sendJson(res, groqResponse.status, { error: detail });
            return;
        }

        const reply = data.choices?.[0]?.message?.content?.trim();
        sendJson(res, 200, { reply: reply || "I could not generate a response. Please try again." });
    } catch (error) {
        sendJson(res, 500, { error: "Chat server error. Please try again." });
    }
}

function serveStatic(req, res) {
    const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
    const safePath = cleanUrl === "/" ? "/index.html" : cleanUrl;
    const filePath = path.normalize(path.join(__dirname, safePath));

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (statError, stat) => {
        if (statError || !stat.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not found");
            return;
        }

        const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });
        if (req.method === "HEAD") {
            res.end();
            return;
        }
        fs.createReadStream(filePath).pipe(res);
    });
}

function readJson(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
            if (raw.length > 8000) {
                req.destroy();
                reject(new Error("Request too large"));
            }
        });
        req.on("end", () => {
            try {
                resolve(raw ? JSON.parse(raw) : {});
            } catch (error) {
                reject(error);
            }
        });
        req.on("error", reject);
    });
}

function sendJson(res, status, payload) {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(payload));
}

function setCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function loadEnv(envPath) {
    if (!fs.existsSync(envPath)) return;
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const index = trimmed.indexOf("=");
        if (index === -1) continue;
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim().replace(/^['\"]|['\"]$/g, "");
        if (key && process.env[key] === undefined) process.env[key] = value;
    }
}
