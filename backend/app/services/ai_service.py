import os
import asyncio
import hashlib
import time
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Simple in-memory cache for generated plans
_plan_cache = {}
_CACHE_TTL_SECONDS = 3600  # 1 hour

# Lazy import of google SDK when key present
genai = None
if GOOGLE_API_KEY:
    try:
        import google.generativeai as genai_lib
        genai = genai_lib
        genai.configure(api_key=GOOGLE_API_KEY)
    except Exception as e:
        print("Warning: google-generativeai import failed or config failed:", e)
        genai = None

def _get_cache_key(topic: str) -> str:
    """Generate a cache key from the topic."""
    return hashlib.sha256(topic.lower().strip().encode()).hexdigest()

async def generate_content_plan(topic: str) -> dict:
    """
    Returns a dict: { planner: <string> }
      - If real AI available, returns AI text.
      - Otherwise returns a stubbed planner string.
      - Results are cached for 1 hour to improve performance.
    """
    topic_clean = topic.strip()
    cache_key = _get_cache_key(topic_clean)
    
    # Check cache first
    if cache_key in _plan_cache:
        cached_result, timestamp = _plan_cache[cache_key]
        if time.time() - timestamp < _CACHE_TTL_SECONDS:
            return {"planner": cached_result}
        else:
            del _plan_cache[cache_key]
    
    if genai:
        # Run blocking SDK call in threadpool to avoid blocking event loop
        loop = asyncio.get_event_loop()
        def call_ai():
            # Use a stable, supported model resource name
            model_name = "models/gemini-1.5-flash"
            model = genai.GenerativeModel(model_name)
            prompt = (
                f"Create a complete content planner for the topic '{topic_clean}'. "
                "Include Objective, Target Audience, Key Messages, Content Formats (blogs, videos, infographics), "
                "SEO Strategy (primary & secondary keywords), a 4-week content calendar with publishing frequency, "
                "promotion strategy (social, email, partnerships), and KPIs. Structure with clear sections and bullet points."
            )
            resp = model.generate_content(prompt)
            # resp may be SDK object - use resp.text if available
            text = getattr(resp, "text", None) or str(resp)
            return text
        try:
            ai_text = await loop.run_in_executor(None, call_ai)
            # Cache the result
            _plan_cache[cache_key] = (ai_text, time.time())
            return {"planner": ai_text}
        except Exception as e:
            # if API fails, fallback to stub and log
            print("AI call failed, falling back to stub:", e)
            stub = _stub_planner(topic_clean)
            _plan_cache[cache_key] = (stub, time.time())
            return {"planner": stub}
    else:
        # No key or SDK - return a stub
        stub = _stub_planner(topic_clean)
        _plan_cache[cache_key] = (stub, time.time())
        return {"planner": stub}

def _stub_planner(topic: str) -> str:
    """Return a deterministic content planner string for dev/demo."""
    primary_keywords = ", ".join([f"{topic}"] + ["AI in healthcare", "digital health"])
    secondary_keywords = ", ".join(["predictive analytics", "medical imaging", "telehealth"])
    planner = f"""Content Planner: {topic}

Objective:
- Raise awareness about {topic} and drive qualified traffic.

Target Audience:
- Healthcare professionals, researchers, med-tech startups, informed patients.

Key Messages & Value:
- Explain benefits, use-cases, and ethical considerations.
- Demonstrate real-world impact and ROI.

Content Formats:
- 2x Blog posts (1,200–1,800 words)
- 1x Case study
- 1x Short explainer video (2–4 min)
- 1x Infographic (shareable)

SEO Strategy:
- Primary keywords: {primary_keywords}
- Secondary keywords: {secondary_keywords}
- Tone: authoritative but accessible
- Internal linking: link to related posts and pillar pages

4-Week Content Calendar:
Week 1:
- Blog: "Intro to {topic}: Why it matters"
- Social: Teaser + infographic
Week 2:
- Blog: "Key use-cases of {topic}"
- Video: 2-min explainer
Week 3:
- Case Study: "Real-world impact of {topic}"
- Social + newsletter highlight
Week 4:
- Round-up: "Future trends & next steps"
- Paid promotion & outreach

Promotion:
- Share on LinkedIn, Twitter/X
- Partner with 2 industry influencers
- Email digest to subscribers

KPIs:
- Organic traffic
- Time on page
- Keyword rankings
- Leads & signups

Notes:
- Adapt tone per audience segment; include citations for clinical claims.
"""
    return planner
