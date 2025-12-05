# Physical AI Textbook

An interactive educational platform for learning Physical AI and Humanoid Robotics, featuring RAG-powered chatbot assistance.

## 🚀 Live Demo

- **Frontend**: [GitHub Pages](https://edeveloper132.github.io/textbook-hackathon/)
- **API**: [Render.com](https://physical-ai-textbook-api.onrender.com)

> **Note**: The backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first request may take 30-60 seconds while the server wakes up.

## 📚 Course Modules

| Module | Topics | Weeks |
|--------|--------|-------|
| **1. ROS2 Foundations** | Nodes, Topics, Services, TF2, Nav2 | 1-5 |
| **2. Simulation** | Gazebo, Unity Robotics Hub | 6-7 |
| **3. NVIDIA Isaac** | Isaac Sim, Isaac ROS, Synthetic Data | 8-10 |
| **4. VLA Models** | Architecture, Fine-tuning, Deployment | 11-13 |

## ✨ Features

### Core Features
- 📖 21 MDX chapters with Mermaid diagrams
- 🤖 RAG-powered chatbot (GPT-4o-mini + Qdrant)
- 🔍 Text selection Q&A
- 🌙 Dark mode support

### Bonus Features
- 🔐 User authentication (email + GitHub OAuth)
- 📊 Background quiz with level detection
- 🎯 Personalized content adaptation
- 🇵🇰 Urdu translation support

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Docusaurus 3.x, TypeScript, MDX |
| Backend | FastAPI, Python 3.11 |
| AI | OpenAI GPT-4o-mini |
| Vector DB | Qdrant Cloud |
| Database | SQLite (local) / PostgreSQL (production) |
| Hosting | GitHub Pages + Render.com |

## 🏃 Quick Start

### Frontend

```bash
cd physical-ai-textbook
npm install
npm start
```

Visit `http://localhost:3000/textbook-hackathon/` in your browser.

### Backend

```bash
cd physical-ai-textbook/backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn app.main:app --reload
```

API available at `http://localhost:8000` (docs at `/docs`).

### Index Content (for RAG)

```bash
cd physical-ai-textbook/backend
python scripts/index_content.py
```

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://physical-ai-textbook-api.onrender.com
REACT_APP_FEATURE_AUTH=true
REACT_APP_FEATURE_QUIZ=true
REACT_APP_FEATURE_PERSONALIZATION=true
REACT_APP_FEATURE_URDU=true
```

### Backend (.env)
```env
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=your-api-key
JWT_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id      # Optional
GITHUB_CLIENT_SECRET=your-github-secret     # Optional
FRONTEND_URL=http://localhost:3000          # For OAuth callback
```

> ⚠️ **Never commit your `.env` file!** It should be in `.gitignore`.

## 📁 Project Structure

```
physical-ai-textbook/
├── docs/                    # MDX content (21 files)
│   ├── intro.mdx
│   ├── module-1-ros2/       # 6 files
│   ├── module-2-simulation/ # 3 files
│   ├── module-3-isaac/      # 4 files
│   └── module-4-vla/        # 5 files
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Feature flags
│   └── theme/               # Theme customization
├── backend/
│   ├── app/                 # FastAPI application
│   ├── scripts/             # Indexing scripts
│   └── tests/               # Backend tests
└── .github/workflows/       # CI/CD
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ask` | POST | RAG Q&A |
| `/api/ask-selection` | POST | Selection Q&A |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/github` | GET | GitHub OAuth |
| `/api/quiz/questions` | GET | Get quiz |
| `/api/quiz/submit` | POST | Submit quiz |
| `/api/personalize` | POST | Personalize content |
| `/api/translate` | POST | Urdu translation |

## 🧪 Testing

```bash
# Backend tests
cd backend && pytest

# Frontend tests
npm test
```

## 🚀 Deployment

### Frontend (GitHub Pages)
Push to `main` → GitHub Actions auto-deploys

### Backend (Render.com)
1. Connect repository
2. Set environment variables
3. Deploy with `render.yaml`

## 📝 License

MIT License

---

Built for the Physical AI Hackathon 2024 🤖
