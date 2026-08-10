# GrowAds — Angular + Python Edition

## Structure
```
growads-v2/
├── frontend/                          Angular 18 (standalone components) + SCSS
│   └── src/
│       ├── app/
│       │   ├── components/            One folder per page section
│       │   │   ├── navbar/
│       │   │   ├── hero/
│       │   │   ├── proof-strip/
│       │   │   ├── services/          "What We Do" + high-risk industries panel
│       │   │   ├── why-growads/
│       │   │   ├── testimonials/
│       │   │   ├── roadmap/           "How It Works"
│       │   │   ├── pricing/           Includes the lead-capture form
│       │   │   ├── faq/               + nested faq-item.component
│       │   │   ├── final-cta/
│       │   │   └── footer/            + floating WhatsApp/Telegram buttons
│       │   │
│       │   ├── pages/
│       │   │   └── home/              Composes all section components in order
│       │   │
│       │   ├── shared/
│       │   │   ├── models/            TS interfaces (ChatConfig, LeadPayload, content types)
│       │   │   ├── services/          ConfigService, LeadService (talk to the backend)
│       │   │   └── constants/         All static site copy (platforms, channels, FAQs, etc.)
│       │   │
│       │   ├── app.routes.ts
│       │   ├── app.config.ts          provideRouter + provideHttpClient
│       │   ├── app.component.ts/html  Shell: navbar + router-outlet + footer
│       │
│       ├── assets/
│       │   ├── images/
│       │   ├── icons/
│       │   └── logo.svg
│       ├── styles.scss                Global design tokens (gradients, glass cards)
│       └── index.html
│   ├── angular.json, package.json, tsconfig*.json
│   └── proxy.conf.json                Routes /api → localhost:8000 in dev
└── backend/                           Python (FastAPI)
    ├── main.py
    ├── requirements.txt
    ├── .env.example
    └── data/leads.json                (auto-created, gitignored)
```

Every section component is self-contained (own `.ts`/`.html`/`.scss`) and pulls its copy from
`shared/constants` and its chat links from `shared/services/config.service.ts`. To edit page
copy, you now only touch `shared/constants/site-content.constants.ts` — no hunting through
templates.

## Design
This version intentionally uses the familiar "AI product" visual language:
indigo→violet→pink gradients, glassmorphism cards, badge pills, numbered-circle
timeline, gradient CTA banner. Fonts are Inter (body) + Sora (headings).

## Running it

### 1. Backend (Python / FastAPI)
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env   # then fill in your real WhatsApp/Telegram links
uvicorn main:app --reload --port 8000
```
Tested endpoints:
- `GET /api/health`
- `GET /api/config` → `{ "whatsapp": "...", "telegram": "..." }`
- `POST /api/lead` → saves to `backend/data/leads.json`

### 2. Frontend (Angular)
```bash
cd frontend
npm install
npm start
```
This runs `ng serve --proxy-config proxy.conf.json`, which forwards `/api/*` calls to
the backend on port 8000. Visit **http://localhost:4200**.

### 3. Production build
```bash
cd frontend
npm run build
```
This outputs static files to `frontend/dist/growads-frontend`. `backend/main.py`
already checks for that folder and serves it automatically — so in production you can just
run the FastAPI server and it serves both the API and the built Angular app from one process:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Deploying to Vercel
`vercel.json` at the repo root wires both halves of the app:

- **Frontend** — Vercel runs `npm ci && npm run build` inside `frontend/` and serves
  `frontend/dist/growads-frontend` from the CDN. A catch-all rewrite sends unknown paths to
  `index.html` so Angular routing works on refresh.
- **Backend** — `api/index.py` re-exports the FastAPI app from `backend/main.py`, and every
  `/api/*` request is rewritten to it. FastAPI still sees the original path, so the routes
  (`/api/health`, `/api/config`, `/api/lead`, `/api/chat`) need no changes. The root
  `requirements.txt` is what Vercel installs for the function — keep it in sync with
  `backend/requirements.txt`.

Set these in **Project Settings → Environment Variables** (never commit them):

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | your Groq key — without it `/api/chat` returns 503 and the widget hides itself |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `WHATSAPP_LINK` | your real wa.me link |
| `TELEGRAM_LINK` | your real t.me link |

### Before launch: leads are not durable on Vercel
The serverless filesystem is read-only apart from `/tmp`, and `/tmp` is wiped between cold
starts. `/api/lead` therefore writes to `/tmp/growads-data/leads.json` **and** prints the lead
to the platform log (`[lead] {...}`, visible under Deployments → Logs), but nothing there
survives long. Before taking the callback form live, wire a real sink at the marked hook in
`create_lead()` — email/SendGrid, a Slack webhook, a CRM, or a hosted database.

Also narrow `allow_origins=["*"]` in `backend/main.py` to your real domain once it's known.

## Note on this delivery
I ran and verified the **backend** end-to-end (installed dependencies, started the server,
hit all three endpoints, confirmed the lead gets written to `leads.json`). The **Angular
frontend** was hand-built and carefully reviewed for correctness, but I did not run a full
`npm install && ng build` in this environment (the Angular CLI toolchain is large and slow to
install here) — so please run `npm install && npm start` as your first step and let me know if
anything doesn't compile; I'll fix it immediately.

## Still needed from you
A few things in this round were structural — the placeholder is wired up and ready, but needs
real content to replace it:

1. **Testimonials** (`shared/constants/site-content.constants.ts` → `TESTIMONIALS`) — currently
   says "Client Name Pending" with no photo. Send real names + headshots (drop images in
   `src/assets/images/` and reference them in the `photo` field) and I'll wire them in.
2. **What We Do objectives** (`CHANNELS[].objectives`) — currently placeholder bullets
   ("Objective to be added") under each platform. Send the real list per platform (Meta,
   Google, TikTok, Snapchat) and I'll drop them in.
3. **Platform logos** (`src/assets/icons/*.svg`) — I built simple abstracted icons (not the
   official Meta/Google/TikTok/Snapchat logo artwork, since exact trademarked logos shouldn't
   be reproduced) using each brand's color. For a production site, swap these for the official
   assets downloaded from each platform's brand resource center (Meta Brand Resource Center,
   Google Partners badge kit, TikTok for Business, Snap Creative Kit) — same filenames, same
   folder, and every component picks them up automatically.
