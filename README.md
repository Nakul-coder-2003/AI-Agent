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