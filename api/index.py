"""Vercel serverless entrypoint.

Vercel turns every file under /api into a function. This one just re-exports the
FastAPI app from backend/main.py so there is a single source of truth for the API.
The rewrite in vercel.json sends every /api/* request here; FastAPI still sees the
original path (/api/config, /api/lead, /api/chat), so no route changes are needed.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from main import app  # noqa: E402,F401  (Vercel looks for a module-level `app`)
