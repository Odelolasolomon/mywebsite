(() => {
    const languages = {
        en: { label: "English", locale: "en-US", welcome: "Hi, I am Solomon's AI portfolio agent. Ask me anything about his AI engineering experience, projects, research, skills, hiring fit, CV, or contact details.", placeholder: "Ask about Solomon...", listening: "Listening...", noSpeech: "Speech recognition is not available in this browser.", ttsOn: "Voice replies on", ttsOff: "Voice replies off", thinking: "Thinking with Groq...", error: "I could not reach the AI server. Make sure the Groq server is running and your API key is set." },
        fr: { label: "Français", locale: "fr-FR", welcome: "Bonjour, je suis l'agent IA du portfolio de Solomon. Posez-moi des questions sur son experience, ses projets, ses recherches, ses competences, son CV ou son profil de recrutement.", placeholder: "Posez une question...", listening: "J'ecoute...", noSpeech: "La reconnaissance vocale n'est pas disponible dans ce navigateur.", ttsOn: "Reponses vocales activees", ttsOff: "Reponses vocales desactivees", thinking: "Reflexion avec Groq...", error: "Impossible de joindre le serveur IA. Verifiez que le serveur Groq fonctionne et que la cle API est configuree." },
        es: { label: "Español", locale: "es-ES", welcome: "Hola, soy el agente de IA del portafolio de Solomon. Preguntame sobre su experiencia, proyectos, investigacion, habilidades, CV o encaje para un puesto.", placeholder: "Pregunta sobre Solomon...", listening: "Escuchando...", noSpeech: "El reconocimiento de voz no esta disponible en este navegador.", ttsOn: "Respuestas de voz activadas", ttsOff: "Respuestas de voz desactivadas", thinking: "Pensando con Groq...", error: "No pude conectar con el servidor de IA. Asegurate de que el servidor Groq este activo y la API key configurada." },
        yo: { label: "Yoruba", locale: "en-NG", welcome: "Bawo, emi ni AI agent portfolio Solomon. Beere ohunkohun nipa iriri AI engineering re, awon ise akanse, iwadi, ogbon, CV, tabi boya o ba ise yin mu.", placeholder: "Beere nipa Solomon...", listening: "Mo ngbo...", noSpeech: "Speech recognition ko si lori browser yi.", ttsOn: "Ohun ti tan", ttsOff: "Ohun ti wa ni pipa", thinking: "Mo n ronu pelu Groq...", error: "Mi o le kan si AI server. Rii daju pe Groq server n sise ati API key wa ninu .env." },
        ha: { label: "Hausa", locale: "en-NG", welcome: "Sannu, ni AI agent na portfolio din Solomon. Tambaye ni game da AI engineering dinsa, ayyuka, bincike, fasaha, CV, ko dacewarsa da aiki.", placeholder: "Tambayi game da Solomon...", listening: "Ina sauraro...", noSpeech: "Babu speech recognition a wannan browser.", ttsOn: "Amsar murya ta kunna", ttsOff: "Amsar murya ta kashe", thinking: "Ina tunani da Groq...", error: "Ba zan iya kaiwa AI server ba. Tabbatar Groq server yana aiki kuma API key tana cikin .env." }
    };

    const quickPrompts = {
        en: ["How good is he at AI engineering?", "How can he help our team?", "Top projects", "Research strength", "Contact"],
        fr: ["Son niveau en IA ?", "Comment peut-il aider ?", "Meilleurs projets", "Recherche", "Contact"],
        es: ["Que tan bueno es en IA?", "Como puede ayudar?", "Proyectos clave", "Investigacion", "Contacto"],
        yo: ["Bawo ni o se dara ninu AI?", "Bawo ni o se le ran team lowo?", "Awon ise pataki", "Iwadi", "Olubasoro"],
        ha: ["Yaya kwarewarsa a AI?", "Yaya zai taimaka?", "Manyan ayyuka", "Bincike", "Tuntuba"]
    };

    const fallbackReplies = {
        en: "I can still help briefly: Solomon is a Senior AI Engineer strong in LLMs, AI agents, RAG, fraud detection, healthcare AI, computer vision, FastAPI, MLOps, Docker, and Kubernetes. For full intelligent answers, run the Groq server with your API key.",
        fr: "Je peux aider brievement: Solomon est Senior AI Engineer, fort en LLM, agents IA, RAG, fraude, IA medicale, vision par ordinateur, FastAPI, MLOps, Docker et Kubernetes. Pour des reponses intelligentes completes, lancez le serveur Groq avec votre cle API.",
        es: "Puedo ayudar brevemente: Solomon es Senior AI Engineer con fortaleza en LLMs, agentes IA, RAG, fraude, IA medica, vision por computador, FastAPI, MLOps, Docker y Kubernetes. Para respuestas inteligentes completas, ejecuta el servidor Groq con tu API key.",
        yo: "Mo le dahun ni kukuru: Solomon je Senior AI Engineer to lagbara ninu LLMs, AI agents, RAG, fraud detection, healthcare AI, computer vision, FastAPI, MLOps, Docker ati Kubernetes. Fun idahun to jinle, run Groq server pelu API key re.",
        ha: "Zan iya amsa a takaice: Solomon Senior AI Engineer ne mai karfi a LLMs, AI agents, RAG, fraud detection, healthcare AI, computer vision, FastAPI, MLOps, Docker da Kubernetes. Don cikakkiyar amsa, kunna Groq server da API key dinka."
    };

    let lang = localStorage.getItem("solomon-chat-lang") || "en";
    let voiceEnabled = localStorage.getItem("solomon-chat-voice") === "true";
    let recognition;
    const chatHistory = [];

    function createWidget() {
        const panel = document.createElement("section");
        panel.className = "ai-chat-panel";
        panel.setAttribute("aria-label", "AI portfolio chatbot");
        panel.innerHTML = `
            <header class="ai-chat-header">
                <div><h2>Solomon AI Agent</h2><p>Groq-powered portfolio assistant</p></div>
                <button class="ai-chat-close" type="button" aria-label="Close chat"><i class="bi bi-x-lg"></i></button>
            </header>
            <div class="ai-chat-tools">
                <div class="ai-chat-controls">
                    <select aria-label="Chat language"></select>
                    <button class="ai-chat-icon-btn ai-chat-voice" type="button" aria-label="Toggle voice replies"><i class="bi bi-volume-up"></i></button>
                    <button class="ai-chat-icon-btn ai-chat-mic" type="button" aria-label="Use speech to text"><i class="bi bi-mic"></i></button>
                </div>
                <div class="ai-chat-quick" aria-label="Quick questions"></div>
            </div>
            <div class="ai-chat-messages" aria-live="polite"></div>
            <div class="ai-chat-status"></div>
            <form class="ai-chat-form"><input type="text" autocomplete="off" /><button type="submit"><i class="bi bi-send"></i></button></form>
        `;

        const toggle = document.createElement("button");
        toggle.className = "ai-chat-toggle";
        toggle.type = "button";
        toggle.setAttribute("aria-label", "Open AI chat");
        toggle.innerHTML = '<i class="bi bi-chat-dots"></i>';
        document.body.append(panel, toggle);
        wireWidget(panel, toggle);
    }

    function wireWidget(panel, toggle) {
        const messages = panel.querySelector(".ai-chat-messages");
        const form = panel.querySelector(".ai-chat-form");
        const input = form.querySelector("input");
        const sendButton = form.querySelector("button");
        const select = panel.querySelector("select");
        const quick = panel.querySelector(".ai-chat-quick");
        const status = panel.querySelector(".ai-chat-status");
        const voiceButton = panel.querySelector(".ai-chat-voice");
        const micButton = panel.querySelector(".ai-chat-mic");

        Object.entries(languages).forEach(([code, data]) => {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = data.label;
            select.appendChild(option);
        });

        const refreshLanguage = () => {
            select.value = lang;
            input.placeholder = languages[lang].placeholder;
            voiceButton.classList.toggle("is-active", voiceEnabled);
            quick.innerHTML = "";
            quickPrompts[lang].forEach((prompt) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = prompt;
                button.addEventListener("click", () => ask(prompt));
                quick.appendChild(button);
            });
        };

        toggle.addEventListener("click", () => {
            panel.classList.toggle("is-open");
            if (panel.classList.contains("is-open")) input.focus();
        });

        panel.querySelector(".ai-chat-close").addEventListener("click", () => panel.classList.remove("is-open"));

        select.addEventListener("change", () => {
            lang = select.value;
            localStorage.setItem("solomon-chat-lang", lang);
            refreshLanguage();
            addMessage(languages[lang].welcome, "agent", messages);
        });

        voiceButton.addEventListener("click", () => {
            voiceEnabled = !voiceEnabled;
            localStorage.setItem("solomon-chat-voice", String(voiceEnabled));
            refreshLanguage();
            setStatus(voiceEnabled ? languages[lang].ttsOn : languages[lang].ttsOff, status);
        });

        micButton.addEventListener("click", () => startSpeech(input, status, micButton));

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            ask(input.value);
            input.value = "";
        });

        async function ask(question) {
            const clean = question.trim();
            if (!clean) return;
            addMessage(clean, "user", messages);
            chatHistory.push({ role: "user", content: clean });
            setBusy(true);
            setStatus(languages[lang].thinking, status, 0);

            try {
                const response = await fetch(getChatEndpoint(), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: clean, language: lang, history: chatHistory.slice(-8) })
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.error || languages[lang].error);
                const reply = data.reply || fallbackReplies[lang];
                chatHistory.push({ role: "assistant", content: reply });
                addMessage(reply, "agent", messages);
                speak(reply);
                status.textContent = "";
            } catch (error) {
                const reply = `${languages[lang].error}\n\n${fallbackReplies[lang]}`;
                chatHistory.push({ role: "assistant", content: reply });
                addMessage(reply, "agent", messages);
                status.textContent = "";
            } finally {
                setBusy(false);
            }
        }

        function setBusy(isBusy) {
            input.disabled = isBusy;
            sendButton.disabled = isBusy;
        }

        function setStatus(text, target, timeout = 3000) {
            target.textContent = text;
            if (timeout > 0) {
                window.setTimeout(() => {
                    if (target.textContent === text) target.textContent = "";
                }, timeout);
            }
        }

        refreshLanguage();
        addMessage(languages[lang].welcome, "agent", messages);
    }

    function getChatEndpoint() {
        const hostname = window.location.hostname || "";
        const isLocalhost = ["localhost", "127.0.0.1", ""].includes(hostname);
        if (!isLocalhost || window.location.port === "3000") return "/api/chat";
        const protocol = window.location.protocol || "http:";
        return `${protocol}//${hostname}:3000/api/chat`;
    }

    function addMessage(text, role, target) {
        const message = document.createElement("div");
        message.className = `ai-chat-message ${role}`;
        message.innerHTML = formatAnswer(text);
        target.appendChild(message);
        target.scrollTop = target.scrollHeight;
    }

    function formatAnswer(text) {
        const escaped = text.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
        return escaped
            .replace(/\n/g, "<br>")
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    function speak(text) {
        if (!voiceEnabled || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/https?:\/\/[^\s]+/g, ""));
        utterance.lang = languages[lang].locale;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
    }

    function startSpeech(input, status, micButton) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            status.textContent = languages[lang].noSpeech;
            return;
        }
        recognition = recognition || new SpeechRecognition();
        recognition.lang = languages[lang].locale;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        micButton.classList.add("is-active");
        status.textContent = languages[lang].listening;
        recognition.onresult = (event) => {
            input.value = event.results[0][0].transcript;
            input.focus();
        };
        recognition.onend = () => {
            micButton.classList.remove("is-active");
            status.textContent = "";
        };
        recognition.onerror = () => {
            micButton.classList.remove("is-active");
            status.textContent = languages[lang].noSpeech;
        };
        recognition.start();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWidget);
    } else {
        createWidget();
    }
})();
