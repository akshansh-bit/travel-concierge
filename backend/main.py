from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import run_agent, clear_session

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="Travel Concierge API")

# ── CORS — React frontend ko allow karo ───────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request Models ────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ClearRequest(BaseModel):
    session_id: str = "default"

# ── Routes ────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Travel Concierge API is running 🚀"}

@app.post("/chat")
def chat(req: ChatRequest):
    response = run_agent(req.message, req.session_id)
    return {
        "response": response,
        "session_id": req.session_id
    }

@app.post("/clear")
def clear(req: ClearRequest):
    clear_session(req.session_id)
    return {"status": "Session cleared ✅"}