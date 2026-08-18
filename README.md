# 🤖 AI-Powered RAG Agent with Microservices Architecture

An enterprise-grade, highly scalable AI Assistant built using a **Microservices Architecture**. This project features a robust Retrieval-Augmented Generation (RAG) pipeline for PDF document analysis, an asynchronous credit-based billing system via Stripe, and a secure API Gateway.

## 🌟 Key Features

- **Microservices Architecture**: Completely decoupled services (Gateway, Auth, Chat, Agent, Payment) communicating seamlessly.
- **API Gateway & Security**: Centralized routing and JWT-based authentication using `express-http-proxy`.
- **Intelligent Agent (RAG)**: Uses **LangChain**, **Google Gemini API**, and **Supabase Vector DB** to chunk, embed, and query PDF documents.
- **Context-Aware Chat**: Maintains conversation history in MongoDB to provide LLM with conversational memory.
- **FinTech Integration**: Built-in wallet system with credit deduction per prompt and **Stripe** payment gateway for seamless top-ups.
- **DevOps Ready**: Fully dockerized environment with **Redis** for session management and token blacklisting.

---

## 🏗️ System Architecture

The backend is divided into 5 independent services:

1. **API Gateway (Port 8000)**: The single entry point. Validates JWT tokens and proxies requests to respective microservices.
2. **Auth Service (Port 8001)**: Handles user registration, login, JWT generation, and token blacklisting using Redis.
3. **Agent Service (Port 8002)**: The AI brain. Processes LangChain graphs, generates text via Gemini, and handles PDF embeddings using Supabase.
4. **Chat Service (Port 8003)**: Manages conversations/messages in MongoDB and requests credit deductions before interacting with the Agent.
5. **Payment Service (Port 8004)**: Manages user wallets (credits), deducts credits per prompt, and integrates Stripe Checkout for recharges.

---

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Data persistence)
- Redis (Token blacklisting & caching)
- Stripe API (Payment processing)

**AI & Machine Learning:**
- LangChain (Agent orchestration)
- Google Gemini API (LLM & Embeddings)
- Supabase (Vector Database for RAG)

**DevOps:**
- Docker & Docker Compose

**Frontend (Work in Progress):**
- React.js (Vite) & Tailwind CSS

---

## 📂 Project Structure

```text
├── backend/
│   ├── docker-compose.yml       # Redis & MongoDB local setup
│   ├── gateway/                 # API Gateway (Port 8000)
│   └── services/
│       ├── agent/               # AI & RAG Pipeline (Port 8002)
│       ├── auth/                # Authentication (Port 8001)
│       ├── chat/                # Chat & Memory (Port 8003)
│       └── payment/             # Billing & Stripe (Port 8004)
├── frontend/                    # React Vite App
└── README.md
```

---

## 🚀 Local Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Docker Desktop
- Stripe Account (Test Mode)
- Gemini API Key & Supabase Project

### 2. Clone the Repository
```bash
git clone [https://github.com/Nakul-coder-2003/AI-Agent.git](https://github.com/Nakul-coder-2003/AI-Agent.git)
cd AI-Agent
```

### 3. Environment Variables
Create a `.env` file in each respective service folder (`gateway`, `auth`, `agent`, `chat`, `payment`). 

**Sample Keys Required:**
```env
# Auth & Gateway
JWT_ACCESS_SECRET=your_secret
REDIS_URL=redis://127.0.0.1:6379

# Agent Service
GEMINI_API_KEY=your_gemini_key
SUPABASE_URL=your_supabase_url
SUPABASE_PRIVATE_KEY=your_supabase_key

# Payment Service
STRIPE_SECRET_KEY=sk_test_...
```

### 4. Start Infrastructure (Redis)
Ensure Docker is running, then spin up the required databases:
```bash
cd backend
docker-compose up -d
```

### 5. Start Microservices
Open separate terminals for each service and run:
```bash
npm install
node index.js
```

---

## 🔌 Core API Endpoints (via Gateway)

| Route | Method | Description | Service |
|-------|--------|-------------|---------|
| `/api/auth/register` | POST | Register a new user | Auth |
| `/api/auth/login` | POST | Login & get JWT | Auth |
| `/api/payment/buy-credits`| POST | Generate Stripe checkout URL | Payment |
| `/api/payment/verify-payment`| POST | Add credits after successful payment | Payment |
| `/api/chat/message` | POST | Send prompt/PDF (deducts 1 credit) | Chat -> Payment -> Agent |

---

## 👨‍💻 Author
Built with ❤️ by **Nakul Mittal** *Passionate about Backend Architecture, System Design, and AI Integration.*