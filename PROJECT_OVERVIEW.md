# ScriptGen – AI-Powered YouTube Scripting Suite

ScriptGen is a comprehensive, production-grade SaaS platform designed for YouTube creators. It leverages advanced AI models to transform video ideas into full-length, structured scripts with integrated SEO data, production guidelines, and social media clips.

## 🚀 Key Features

### 🎬 Intelligent Multi-Stage Generation
Unlike simple prompt wrappers, ScriptGen uses a sequential, multi-stage generation process to ensure depth and coherence:
- **Stage 1: Hook & Intro** – Designed to maximize retention in the critical first 30 seconds.
- **Stage 2: Main Content** – Detailed, structured sections with optional technical code explanations.
- **Stage 3: Demo & Outro** – Practical walkthroughs and high-conversion calls-to-action.
- **Stage 4: Production Notes** – Detailed editing cues, B-roll suggestions, and music intensity mapping.

### 🔍 Complete SEO & Asset Suite
- **SEO Pack**: AI-generated titles (with engagement scores), high-retention descriptions, and optimized tags.
- **Media Prompts**: AI image prompts (DALL-E/Midjourney ready) mapped to specific timestamps.
- **B-Roll & Chapters**: Automated video indexing and B-roll shopping lists for editors.
- **Shorts Extraction**: Viral-focused clips extracted directly from the long-form script.

### 🗣️ Multi-Language & Regional Support
- **Supported Languages**: English, Hindi (Hinglish), Tamil, and Thanglish (Tamil+English mix).
- **Thanglish Engine**: Customizable Tamil-to-English ratio (50-90%) for natural regional content.
- **Localization**: Optional "Tamil Nadu Context" for regional cultural relevance.

### 💰 Monetization & Growth
- **Credits System**: Token-based usage (10 tokens for base script, additional for assets).
- **Razorpay Integration**: Seamless INR payments for token top-ups.
- **Referral System**: Viral growth loop giving 15 tokens to both referrer and referee.
- **Promo Codes**: Support for marketing campaigns and influencer partnerships.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Next.js API Routes (Edge-ready where applicable).
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: NextAuth.js (Google OAuth).
- **AI Orchestration**: OpenAI API (GPT-4o for complex logic, GPT-4o-mini for cost-effective asset generation).
- **Payments**: Razorpay Node.js SDK.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
  - `ScriptGenerator.tsx`: The core interactive workspace.
  - `api/`: RESTful endpoints for generation, auth, payments, and user data.
- `components/`: Reusable UI components (Nav, AuthProvider, etc.).
- `lib/`: Shared utilities, AI prompt constructors, and database client.
- `prisma/`: Database schema and migration history.
- `public/`: Brand assets and static illustrations.

## 🔐 Security & Optimization
- **Server-Side AI**: All API keys and AI calls are handled on the server to prevent leakage and prompt injection.
- **Session Syncing**: Real-time Next-Auth session updates ensure token balances are always accurate across devices.
- **Atomic Transactions**: Database operations for payments and token deductions use Prisma transactions to prevent race conditions.

---
Built for the next generation of content creators.
