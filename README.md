# ✈️ Travel Concierge — AI-Powered Travel Planning

> A premium AI travel planning web app built for Indian travellers. Get personalized itineraries, live weather, visa info, forex rates, and booking links — all in one place.

---

## 🌟 Features

- 🗺️ **Personalized Itineraries** — Day-by-day travel plans for any destination
- 🛂 **Visa Information** — Requirements for Indian passport holders
- 🌤️ **Live Weather** — Real-time weather at your destination
- 💱 **Forex Rates** — Live INR exchange rates for budgeting
- ✈️ **Booking Links** — Direct links to MakeMyTrip, Skyscanner, IRCTC, redBus & more
- 🤖 **Agentic AI** — LLM intelligently decides which tools to use per query
- 💬 **Chat Memory** — Remembers context across a conversation
- 🌍 **RAG-powered** — Retrieval Augmented Generation with hybrid search (Vector + BM25)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│              React + Tailwind + Framer Motion               │
│         Landing Page → Chat UI → Booking Links             │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP (REST API)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                              │
│                    FastAPI (Python)                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  LangChain Agent                    │   │
│  │         llama-3.3-70b-versatile (via Groq)          │   │
│  └──────┬──────────┬──────────┬──────────┬─────────────┘   │
│         │          │          │          │                  │
│    rag_tool  weather_tool  forex_tool  visa_tool            │
│         │      booking_links_tool                           │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Hybrid Retriever (Vector + BM25)           │   │
│  │        ChromaDB + HuggingFace Embeddings            │   │
│  │     (sentence-transformers/all-MiniLM-L6-v2)        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API server |
| LangChain | Agent framework + tool orchestration |
| Groq API | LLM inference (llama-3.3-70b-versatile) |
| ChromaDB | Vector store for RAG |
| HuggingFace | Embeddings (all-MiniLM-L6-v2) |
| BM25 | Keyword-based retrieval |
| OpenWeatherMap API | Live weather data |
| ExchangeRate API | Live forex rates |

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Markdown | Formatted AI responses |
| Unsplash API | Destination photos |

---

## 📁 Project Structure

```
travel-concierge/
│
├── backend/
│   ├── main.py              # FastAPI app + API routes
│   ├── agent.py             # LangChain agent with memory
│   ├── tools.py             # All 5 tools (RAG, weather, forex, visa, booking)
│   ├── requirements.txt     # Python dependencies
│   └── db_v2_final_final/   # ChromaDB vector store
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── AnimatedBackground.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- API Keys: Groq, OpenWeatherMap, Unsplash

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
echo GROQ_API_KEY=your_groq_key > .env
echo OWM_API_KEY=your_openweathermap_key >> .env

# 6. Start backend server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo VITE_API_URL=http://localhost:8000 > .env
echo VITE_UNSPLASH_KEY=your_unsplash_key >> .env

# 4. Start frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/chat` | Send message to AI agent |
| `POST` | `/clear` | Clear chat session |

### Chat Request Example

```json
POST /chat
{
  "message": "Plan a 5 day trip to Bali",
  "session_id": "user123"
}
```

### Chat Response Example

```json
{
  "response": "Here's your 5-day Bali itinerary...",
  "session_id": "user123"
}
```

---

## 🤖 AI Agent Tools

| Tool | Description | API Used |
|------|-------------|----------|
| `rag_tool` | Search travel knowledge base | ChromaDB |
| `weather_tool` | Live weather at destination | OpenWeatherMap |
| `forex_tool` | INR exchange rates | ExchangeRate API |
| `visa_tool` | Visa requirements for Indian passport | ChromaDB |
| `booking_links_tool` | Flight/train/hotel/bus booking links | Static + Dynamic |

---

## 🗃️ RAG Knowledge Base

The vector store contains information about **70+ destinations** including:
- Destination guides (Asia, Europe, Americas, Africa, Oceania)
- Visa requirements for Indian passport holders
- Budget guides (INR per day — budget/mid-range/luxury)
- Best time to visit (season-wise)
- Sample itineraries (Bali, Paris, Tokyo, Dubai, Rajasthan)

Data sourced from Wikipedia + manually curated travel documents.

---

## 🌐 Deployment

### Backend — Render
1. Connect GitHub repo to Render
2. Set root directory: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `GROQ_API_KEY`, `OWM_API_KEY`

### Frontend — Vercel
1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Add environment variables: `VITE_API_URL`, `VITE_UNSPLASH_KEY`
4. Deploy!

---

## 🔑 Environment Variables

### Backend `.env`
```
GROQ_API_KEY=your_groq_api_key
OWM_API_KEY=your_openweathermap_api_key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
VITE_UNSPLASH_KEY=your_unsplash_access_key
```

---

## 📝 License

MIT License — feel free to use and modify!

---

<div align="center">
  Built with ❤️ for Indian Travellers 🇮🇳
</div>
