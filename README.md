# 🧠 Content Strategy Planner

A **full-stack AI-powered content planning tool** that helps creators, marketers, and bloggers generate SEO-optimized blog outlines and topic strategies in seconds.  
Built with **FastAPI**, **React**, **TailwindCSS**, and **Framer Motion** — this project combines a responsive backend with an elegant, animated frontend interface.

---

## 🚀 Features

✅ AI-generated blog outlines and topic plans  
✅ Responsive and polished frontend design  
✅ Light/Dark mode theme switcher  
✅ Save as PDF or Copy to Clipboard options  
✅ Topic history with rename and delete support  
✅ FastAPI backend with async AI calls  
✅ CORS-enabled communication between frontend and backend  
✅ Developer-friendly, easily extendable structure  

---

## 🖼️ Preview

> 💡 *Add a GIF or screenshot of your planner UI here (recommended for GitHub visibility)*

---

## 🧩 Tech Stack

### 🖥️ Frontend
- **React + Vite**
- **TailwindCSS** for modern responsive UI
- **Framer Motion** for smooth animations
- **Lucide Icons** for clean iconography

### ⚙️ Backend
- **FastAPI** for high-performance async APIs
- **Pydantic** for data validation
- **Python-dotenv** for environment management
- **Uvicorn** for local dev server

### 🧠 AI Integration
- **Google Gemini / Groq / CrewAI (extensible)**
- Currently uses a stubbed service for AI response — easily replaceable with real APIs.

---

## ⚡ Quick Start (Development)

### 🧱 Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 🎨 Frontend Setup
```bash
cd frontend
npm install
npm run dev


Then open:
👉 http://localhost:5173
```

## 🔑 Environment Variables

Create a .env file in both frontend and backend directories.

Example (backend/.env):

GOOGLE_API_KEY=your_key_here


Example (frontend/.env):

VITE_API_URL=http://localhost:8000

## 🛠️ Folder Structure
Content-Strategy-Planner/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   └── ai_service.py
│   │   └── models/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── postcss.config.cjs
│   └── tailwind.config.js
│
└── README.md

## 🧾 Notes

AI calls are stubbed in backend/app/services/.
Replace with your preferred AI API like CrewAI, Groq, or Gemini following the inline instructions.

Ensure CORS configuration matches your frontend port (default: 5173).

For production, containerize both services with Docker and add secure secret management.

## 🧑‍💻 Contributing

Pull requests are welcome!
Please open an issue first to discuss major changes or feature requests.

Steps:

Fork the repo

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature-name"

Push and open a PR

## 📜 License

MIT License © 2025 Arun
Feel free to use, modify, and distribute with attribution.
