# Tobisite

Static portfolio for Odelola Solomon Oluwatobiloba with a Groq-powered AI agent chatbot.

## Local Groq chatbot

1. Add your Groq key to `.env`:

```env
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3000
```

2. Start the local server:

```bash
npm run dev
```

3. Open:

```text
http://127.0.0.1:3000
```

The site can still open with Live Server, but the chatbot needs the Node server running because the Groq API key must stay on the backend.

## Netlify deployment

Set these environment variables in Netlify:

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Netlify will use `netlify.toml` to publish the site and route `/api/chat` to the serverless function in `netlify/functions/chat.js`.

Recommended Netlify settings:

```text
Build command: leave empty
Publish directory: .
Functions directory: netlify/functions
```
