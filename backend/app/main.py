from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import asyncio
import traceback

# AI service
from .services.ai_service import generate_content_plan

# load .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

app = FastAPI(title="AI Content Planner API")

# CORS - during development allow everything; in prod lock to your domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    topic: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/generate")
async def generate(req: GenerateRequest):
    if not req.topic or not req.topic.strip():
        raise HTTPException(status_code=400, detail="topic is required")
    try:
        # generate_content_plan handles using a real model if configured,
        # otherwise returns a deterministic stub for development/demo.
        result = await generate_content_plan(req.topic.strip())
        return result
    except Exception as e:
        print("=== Error Trace ===")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
