import json
import os
import time
import uuid
from pathlib import Path
from typing import List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent

# Pin the .env lookup to this file's folder, not the working directory, so it loads
# the same way however uvicorn is invoked. On Vercel there is no .env and this is a
# no-op — the values come from the project's environment variables instead.
load_dotenv(BASE_DIR / ".env")

# On Vercel (and most serverless hosts) the deployment is read-only apart from /tmp,
# so writing next to the code raises OSError. /tmp works but is wiped between cold
# starts — leads stored there are NOT durable. See the note in README before launch.
SERVERLESS = bool(os.getenv("VERCEL"))
DATA_DIR = Path("/tmp/growads-data") if SERVERLESS else BASE_DIR / "data"
LEADS_FILE = DATA_DIR / "leads.json"

FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist" / "growads-frontend"

# --- Groq (OpenAI-compatible chat completions) ---
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
MAX_TURNS = 12          # how much history we forward, keeps tokens (and cost) bounded
MAX_CHARS = 1500        # per-message cap so nobody pastes a novel into our key

app = FastAPI(title="GrowAds API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your real domain(s) before going to production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------
class ChatConfig(BaseModel):
    whatsapp: str
    telegram: str
    aiChat: bool = False  # lets the frontend hide the assistant when no Groq key is set


class LeadIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=1, max_length=50)
    business: Optional[str] = Field(default="", max_length=2000)


class LeadOut(BaseModel):
    status: str
    id: str


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=MAX_CHARS)


class ChatIn(BaseModel):
    messages: List[ChatMessage] = Field(..., min_length=1)


class ChatOut(BaseModel):
    reply: str


# ---------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------
def ensure_leads_file() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not LEADS_FILE.exists():
        LEADS_FILE.write_text("[]", encoding="utf-8")


def read_leads() -> list:
    ensure_leads_file()
    return json.loads(LEADS_FILE.read_text(encoding="utf-8"))


def write_leads(leads: list) -> None:
    LEADS_FILE.write_text(json.dumps(leads, indent=2), encoding="utf-8")


# The assistant only knows what the website says. Everything commercial
# (pricing, approvals, timelines) is deliberately routed to a human.
SYSTEM_PROMPT = """You are the AI assistant on TheGrowAds' website. TheGrowAds is a \
performance marketing agency running paid ads across Meta, Google, TikTok and Snapchat.

What you know about the business:
- Objectives we run: Lead Generation (mainly Google + Meta), Sales & Conversions \
(retargeting and Shopping), App Installs & Sign-ups (TikTok + Snapchat), Brand Awareness \
& Reach (video-first on YouTube, TikTok, Snapchat).
- We are platform-agnostic: we recommend only the platforms that fit the business, not all four by default.
- We accept high-risk verticals other agencies avoid: casino, gambling, crypto, forex, sweepstakes.
- Onboarding: Week 1 setup & strategy (tracking audit, landing page review, audience strategy, \
campaign blueprint). Week 2 launch (campaign build, creative testing, budget allocation). \
From Week 3 scale (budget scaling, cross-platform expansion, retargeting, weekly reporting, \
monthly strategy reviews).
- Results: initial data in 1-2 weeks, meaningful scaling in 4-6 weeks.
- No lock-in contracts. Transparent monthly pricing. Free audit before signing, zero obligation.

How to answer:
- Be brief and concrete. 2-4 sentences, plain language, no bullet-point walls, no emoji.
- Never invent prices, guaranteed results, ROAS numbers, client names or case studies. \
There is no fixed package - pricing depends on ad spend, platforms and scope.
- For anything about cost, ad account approval for a specific niche, or contracts, give the \
general answer above and then point them to WhatsApp or Telegram (buttons at the bottom right \
of the page) or the callback form on this page for a real number from the team.
- If a question is unrelated to advertising, marketing or this agency, say it is outside what \
you can help with here and offer to pass them to the team.
- Never claim to be human, and never promise that a person will reply inside this chat."""


# ---------------------------------------------------------------
# API routes
# ---------------------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok", "time": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}


@app.get("/api/config", response_model=ChatConfig)
def get_config():
    return ChatConfig(
        whatsapp=os.getenv("WHATSAPP_LINK", "https://wa.me/00000000000"),
        telegram=os.getenv("TELEGRAM_LINK", "https://t.me/yourusername"),
        aiChat=bool(os.getenv("GROQ_API_KEY", "").strip()),
    )


@app.post("/api/lead", response_model=LeadOut, status_code=201)
def create_lead(lead: LeadIn):
    if not lead.name.strip():
        raise HTTPException(status_code=400, detail="Name is required.")
    if not lead.email.strip():
        raise HTTPException(status_code=400, detail="Email address is required.")
    if not lead.phone.strip():
        raise HTTPException(status_code=400, detail="Phone number is required.")

    leads = read_leads()
    entry = {
        "id": uuid.uuid4().hex[:12],
        "name": lead.name.strip(),
        "email": lead.email.strip(),
        "phone": lead.phone.strip(),
        "business": (lead.business or "").strip(),
        "received_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    leads.append(entry)
    write_leads(leads)

    # On serverless the file above is throwaway, so also emit the lead to the platform
    # log — that's the only place it survives until a real sink is wired up.
    print(f"[lead] {json.dumps(entry)}")

    # Hook a real notification here later, e.g.:
    # - send an email via smtplib / SendGrid
    # - post to a Slack webhook
    # - forward to a CRM

    return LeadOut(status="received", id=entry["id"])


@app.post("/api/chat", response_model=ChatOut)
async def chat(payload: ChatIn):
    """Proxy the conversation to Groq. The API key never leaves the server."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="The AI assistant isn't configured yet. Set GROQ_API_KEY in backend/.env.",
        )

    history = [m.model_dump() for m in payload.messages[-MAX_TURNS:]]
    body = {
        "model": GROQ_MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + history,
        "temperature": 0.4,
        "max_tokens": 400,
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            res = await client.post(
                GROQ_URL,
                json=body,
                headers={"Authorization": f"Bearer {api_key}"},
            )
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="Couldn't reach the AI service. Please try again.")

    if res.status_code == 429:
        raise HTTPException(status_code=429, detail="The assistant is busy right now. Try again in a moment.")
    if res.status_code >= 400:
        # Log the upstream reason server-side; don't leak it to the browser.
        print(f"[groq] {res.status_code}: {res.text[:500]}")
        raise HTTPException(status_code=502, detail="The AI service returned an error. Please try again.")

    data = res.json()
    reply = (data.get("choices") or [{}])[0].get("message", {}).get("content", "").strip()
    if not reply:
        raise HTTPException(status_code=502, detail="The AI service returned an empty reply.")

    return ChatOut(reply=reply)


# ---------------------------------------------------------------
# Serve the built Angular app (run `ng build` in /frontend first)
# ---------------------------------------------------------------
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

    @app.exception_handler(404)
    async def spa_fallback(request, exc):
        return FileResponse(str(FRONTEND_DIST / "index.html"))
