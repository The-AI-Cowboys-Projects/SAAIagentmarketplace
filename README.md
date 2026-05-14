# San Antonio AI Agent Marketplace

**By [The AI Cowboys](https://www.theaicowboys.com)** — Texas Trusted Experts in Mission-Critical AI

**Live:** [sanantonioaiagents.com](https://sanantonioaiagents.com) | **Parent:** [theaicowboys.com](https://www.theaicowboys.com)

A production-grade AI Agent Marketplace serving the City of San Antonio with 60 specialized autonomous agents across six strategic domains: Civic Governance, Small Business & Economic Development, Military Transition (JBSA), Healthcare Administration (STMC), Tourism & Hospitality, and Connect-360 SmartSA interoperability. Powered by LangChain/LangGraph multi-agent orchestration, Stripe subscription billing with QuickBooks Live revenue sync, Supabase authentication, and a 3-click deployment paradigm.

---

## Table of Contents

- [Live Deployment](#live-deployment)
- [Technical Omnibus](#technical-omnibus)
  - [Frontend Stack](#frontend-stack)
  - [Backend Stack](#backend-stack)
  - [Authentication & Identity](#authentication--identity)
  - [Payments & Revenue Pipeline](#payments--revenue-pipeline)
  - [Infrastructure & DevOps](#infrastructure--devops)
  - [AI/ML & Agent Orchestration](#aiml--agent-orchestration)
  - [Data Layer](#data-layer)
- [System Architecture](#system-architecture)
- [Multi-Agent Design Patterns](#multi-agent-design-patterns)
- [UX Paradigm: 3-Click Installation](#ux-paradigm-3-click-installation)
- [The 60 San Antonio Agents](#the-60-san-antonio-agents)
- [Subscription Tiers](#subscription-tiers)
- [Stripe to QuickBooks Revenue Pipeline](#stripe-to-quickbooks-revenue-pipeline)
- [B2B Lead Generation Engine](#b2b-lead-generation-engine)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Security Architecture](#security-architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Design System](#design-system)
- [Brand Identity](#brand-identity)
- [Demographic & Economic Context](#demographic--economic-context)
- [Works Cited](#works-cited)
- [License](#license)

---

## Live Deployment

| Environment | URL | Status |
|---|---|---|
| **Production** | [sanantonioaiagents.com](https://sanantonioaiagents.com) | Live |
| **Parent Brand** | [theaicowboys.com](https://www.theaicowboys.com) | Live |
| **Stripe Dashboard** | Stripe Live Mode | Active |
| **QuickBooks Online** | QBO Live Company (Realm 9341453681057009) | Connected |
| **Supabase** | Project `yqjkceahfbnmazpyxgwq` | Active |
| **Vercel** | Region `iad1` (US East) | Deployed |
| **Intuit Developer** | App `193ec3a5-9ce0-4c4b-b115-f6664b9de206` | Approved |

---

## Technical Omnibus

### Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2 | React framework — App Router, SSR/SSG, API routes, middleware |
| **React** | 18.3 | Component library with Server Components |
| **TypeScript** | 5.7 | Strict-mode type safety across all frontend code |
| **Tailwind CSS** | 3.4 | Utility-first CSS with custom design tokens (navy, brand, tactical, surface, midnight) |
| **Zustand** | 5.0 | Lightweight global state management (agent selections, UI state) |
| **Framer Motion** | 11.15 | Animation library for page transitions and micro-interactions |
| **Lucide React** | 0.468 | Icon library (Shield, Zap, Building2, Check, ChevronDown, etc.) |
| **clsx + tailwind-merge** | Latest | Conditional class composition and Tailwind class deduplication |
| **@stripe/stripe-js** | 9.5 | Client-side Stripe Checkout integration |
| **@supabase/ssr** | 0.5 | Server-side Supabase auth with cookie-based sessions |
| **@supabase/supabase-js** | 2.103 | Supabase client SDK for auth, database, and storage |

### Backend Stack

| Technology | Version | Purpose |
|---|---|---|
| **FastAPI** | 0.115 | Async Python API framework with automatic OpenAPI docs |
| **Python** | 3.11+ | Backend runtime |
| **SQLAlchemy** | 2.0 | ORM with type-safe database operations and relationship mapping |
| **LangChain** | 0.3.9 | Agent tool orchestration — docstring-driven tool selection |
| **LangGraph** | 0.2.53 | Multi-agent supervisor routing with state machines |
| **LangChain OpenAI** | 0.2.11 | OpenAI LLM integration (GPT-4o primary, MockLLM fallback) |
| **ChromaDB** | 0.5.23 | Vector embeddings and semantic search (RAG) for agent discovery |
| **Pydantic** | 2.10 | Data validation, settings management, schema enforcement |
| **Alembic** | 1.14 | Database migration management |
| **HTTPX** | 0.28 | Async HTTP client for external API integrations |
| **Uvicorn** | 0.32 | ASGI server for FastAPI with HTTP/2 support |

### Authentication & Identity

| Technology | Purpose |
|---|---|
| **Supabase Auth (SSR)** | OAuth2 authentication (Google, GitHub, Magic Link) |
| **JWT (HS256)** | Token-based session management via HTTP-only secure cookies |
| **Supabase Row-Level Security** | Database-level access control per authenticated user |
| **Passlib + Bcrypt** | Password hashing for email/password fallback (cost factor 10) |
| **python-jose** | JWT token creation, verification, and expiry management |
| **Next.js Middleware** | Route protection for `/dashboard`, auth callback handling |

### Payments & Revenue Pipeline

| Technology | Purpose |
|---|---|
| **Stripe** (Live Mode) | Subscription billing — Checkout Sessions, Webhooks, Customer Portal |
| **Stripe API** | `2026-04-22.dahlia` — latest API version |
| **Stripe Webhooks** | `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `customer.subscription.updated` |
| **QuickBooks Online** (Live) | Automated Sales Receipt creation for every paid invoice |
| **QBO OAuth2** | Production credentials — Client ID + Client Secret + Refresh Token |
| **QBO REST API** | `v3/company/{realmId}/salesreceipt` — minor version 73 |
| **Revenue Sync** | Stripe `invoice.paid` -> `recordStripePayment()` -> QBO Sales Receipt |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting — Region `iad1` (US East), automatic HTTPS, edge caching |
| **GitHub** | Source control — `iaintheardofu/SAAIagentmarketplace` |
| **Vercel Environment Variables** | 15 production secrets (Stripe, Supabase, QBO, app config) |
| **Security Headers** | X-Frame-Options: DENY, X-Content-Type-Options: nosniff, strict Referrer-Policy, restricted Permissions-Policy |
| **CORS** | Strict origin allowlist — production domain only |

### AI/ML & Agent Orchestration

| Technology | Purpose |
|---|---|
| **LangGraph Supervisor Router** | Multi-agent orchestration with intent classification and state management |
| **LangChain @tool Decorators** | 60 tool definitions with exhaustive docstrings for deterministic routing |
| **Keyword-Based Intent Classifier** | Domain routing — Civic (23 keywords), Business (21), Military (21), Healthcare (18), Tourism (16), Connect-360 |
| **ChromaDB Vector Store** | Semantic agent discovery via RAG — cosine similarity search |
| **OpenAI GPT-4o** | Primary LLM for agent reasoning (with MockLLM demo fallback) |
| **Docstring Engineering** | Every `@tool` has explicit "USE WHEN" / "DO NOT USE WHEN" guidance |

### Data Layer

| Technology | Purpose |
|---|---|
| **SQLite** | Local development database |
| **PostgreSQL + pgvector** | Production database with vector similarity search |
| **Supabase** | Managed Postgres with real-time subscriptions and RLS |
| **ChromaDB** | Vector embeddings for semantic agent discovery |
| **ETL Pipelines** | Municipal open data, ACS registries, workforce databases, healthcare systems |

---

## System Architecture

```
                        sanantonioaiagents.com
                               |
                          [ Vercel Edge ]
                          Region: iad1
                               |
 ┌─────────────────────────────┴──────────────────────────────┐
 │                     Next.js 14 App Router                    │
 │                                                              │
 │   /                    Home — hero, agent showcase, CTA      │
 │   /agents              Marketplace — 60 agent cards, filter  │
 │   /pricing             3-tier Stripe Checkout ($49/$149/$499)│
 │   /dashboard           Protected workspace — deploy/monitor  │
 │   /auth/login          Supabase OAuth2 flow                  │
 │                                                              │
 │   /api/stripe/checkout   Stripe Checkout Session creation    │
 │   /api/stripe/webhook    Stripe event handler + QBO sync     │
 │   /api/agents            Agent listing and retrieval         │
 │   /api/newsletter        Email capture                       │
 │   /api/waitlist          Waitlist signup                     │
 │                                                              │
 │   Zustand State  |  Tailwind Design Tokens  |  TypeScript    │
 └────────────────────────────┬───────────────────────────────┘
                              │ CORS + JWT Auth
 ┌────────────────────────────┴───────────────────────────────┐
 │                      FastAPI Backend                         │
 │                                                              │
 │  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌─────────┐ │
 │  │  Agents    │  │  Billing   │  │  Auth    │  │  Leads  │ │
 │  │  Router    │  │  Router    │  │  Router  │  │  Router │ │
 │  └─────┬──────┘  └─────┬──────┘  └────┬─────┘  └────┬────┘ │
 │        │               │              │              │       │
 │  ┌─────┴───────────────┴──────────────┴──────────────┴────┐  │
 │  │              Agent Execution Engine                      │  │
 │  │                                                          │  │
 │  │  User Query → Intent Classifier (keyword scoring)        │  │
 │  │           → Category Assignment (6 domains)              │  │
 │  │           → Best Agent Selection                         │  │
 │  │           → LangGraph Supervisor Router                  │  │
 │  │           → Tool Invocation + Result Aggregation         │  │
 │  └─────────────────────────┬──────────────────────────────┘  │
 │                             │                                 │
 │  ┌──────────────────────────┴─────────────────────────────┐  │
 │  │                  60 LangChain @tools                     │  │
 │  │                                                          │  │
 │  │  Civic (10)  |  Business (10)  |  Military (10)          │  │
 │  │  Healthcare (10)  |  Tourism (10)  |  Connect-360 (10)   │  │
 │  │                                                          │  │
 │  │  Each tool: @tool decorator + exhaustive docstring       │  │
 │  │  with "USE WHEN" guidance for deterministic routing      │  │
 │  └──────────────────────────────────────────────────────────┘  │
 └────────────────────────────┬───────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
     ┌────┴──────┐     ┌─────┴──────┐     ┌──────┴──────┐
     │ Supabase  │     │   Stripe   │     │ QuickBooks  │
     │ Postgres  │     │   Live     │     │  Online     │
     │ + ChromaDB│     │ (Webhooks) │     │  (Live)     │
     │ + Auth    │     │            │     │             │
     └───────────┘     └────────────┘     └─────────────┘
```

---

## Multi-Agent Design Patterns

The marketplace uses LangGraph to orchestrate four complementary multi-agent patterns:

| Pattern | Model Calls | Behavior | Marketplace Use Case |
|---|---|---|---|
| **Subagents** | 4 | Results flow back through a coordinating agent for centralized control | Complex multi-domain queries (e.g., 311 solid waste + property code violation) |
| **Skills / Tools** | 3 | Single agent loads specialized prompts and tools on-demand | Single-shot tasks (e.g., generating a MIC3 military dependent school waiver) |
| **Handoffs** | 3 | Agents transfer control to each other via tool calls | Sequential workflows (e.g., intake extraction handing off to medical coding) |
| **Router** | 3 | Classification step directs input to specialized agents | Primary marketplace entry point — routing by user intent |

### Intent Classification

The engine uses keyword-based scoring (not ML models) to route queries:

- **Civic** (23 keywords): "311", "pothole", "trash", "code violation", "animal", "court", "transit", "energy", "cps", "council", etc.
- **Business** (21 keywords): "business", "permit", "grant", "sbeda", "procurement", "rfp", "tax", "food truck", "real estate", etc.
- **Military** (21 keywords): "military", "veteran", "va", "jbsa", "tricare", "gi bill", "skillbridge", "clearance", "resume", "mos", etc.
- **Healthcare** (18 keywords): "clinical", "medical", "insurance", "referral", "icd", "cpt", "hipaa", "telehealth", "triage", etc.
- **Tourism** (16 keywords): "hotel", "river walk", "fiesta", "convention", "restaurant", "alamo", "concierge", "pricing", etc.
- **Connect-360**: Cross-domain interoperability queries spanning multiple categories

### Docstring Engineering

Every `@tool` has an exhaustive, highly specific docstring. Instead of `def search()`, the system uses `def search_sa_property_maintenance_code(query: str)` with explicit instructions on when the LLM must and must not invoke the tool. This guarantees deterministic, reliable agent behavior.

---

## UX Paradigm: 3-Click Installation

The interface shifts from reactive chat boxes to proactive, trusted autonomy:

| Click | Action | What Happens |
|---|---|---|
| **1. Selection** | User browses the agent card grid, filters by category | Agent selected from the 60-card marketplace |
| **2. Authentication** | User connects via Supabase OAuth (Google/GitHub) | Secure session established with JWT tokens |
| **3. Activation** | User clicks "Deploy Workspace" | Backend provisions an isolated LangGraph runtime with injected system prompts, API keys, and taskboard |

---

## The 60 San Antonio Agents

### Category 1: Unified Resident Experience (Civic Engagement)

| # | Agent | Description |
|---|---|---|
| 1 | **311 Infrastructure Abatement Agent** | Connects to CoSA GIS dataset. Vision-language models extract geolocation, categorize pothole severity, and format 311 service tickets. |
| 2 | **CPS Energy Rate Optimizer** | Cross-references CPS Energy variable rate plans with historical consumption data for autonomous smart-thermostat scheduling. |
| 3 | **Property Maintenance Code Checker** | RAG-powered agent using the SA Property Maintenance Code. Predicts potential violations before Code Enforcement issues citations. |
| 4 | **Dangerous Animal Triage Agent** | Integrates with ACS dangerous dog registry and bite map data for incident documentation and affidavit drafting. |
| 5 | **TNR (Trap-Neuter-Return) Coordinator** | Maps ACS stray data, locates vaccination events, and schedules spay/neuter appointments for feral cat caretakers. |
| 6 | **Municipal Court Citation Resolver** | Interfaces with SA Municipal Court docket. Evaluates tickets for Defensive Driving or Deferred Disposition eligibility. |
| 7 | **Pre-K 4 SA Enrollment Guide** | Cross-references residential zoning and income limits to complete Pre-K 4 SA application paperwork. |
| 8 | **VIA Transit Route Optimizer** | Multi-modal transit routing incorporating VIA bus schedules, scooter availability, and real-time traffic density. |
| 9 | **Solid Waste & Brush Schedule Tracker** | Proactive SMS alerts for bulky item pickup days and Free Landfill events. |
| 10 | **SASpeakUp Policy Synthesizer** | Summarizes City Council agendas and SASpeakUp surveys into actionable three-bullet briefs. |

### Category 2: Small Business & Economic Development

| # | Agent | Description |
|---|---|---|
| 11 | **SBEDA Procurement Matchmaker** | Matches minority/women-owned businesses with municipal RFPs and drafts bid templates. |
| 12 | **RevitalizeSA Grant Writer** | Conducts interviews and drafts grant narratives for Corridor Leadership and construction mitigation programs. |
| 13 | **BuildSA Permit Navigator** | Analyzes blueprints and zoning maps to determine exact DSD commercial permit requirements. |
| 14 | **Historic Preservation Rehab Assistant** | Cross-references OHP database for materials compliance and calculates tax incentives. |
| 15 | **VITA Tax Prep Assistant** | Formats profit/loss data for the Volunteer Income Tax Assistance program. |
| 16 | **Commercial Real Estate Analyzer** | Pinpoints optimal retail locations via Bexar Appraisal District records and foot traffic analysis. |
| 17 | **Local B2B Lead Generation Swarm** | Multi-agent router scraping SA business directories with firmographic enrichment. |
| 18 | **Food Truck Compliance Agent** | Guides through Metro Health regulations, FireSafeSA inspections, and parking zone requirements. |
| 19 | **Disaster Recovery Locator** | Monitors GOBSA for emergency funding and low-interest CDFI loans post-severe weather. |
| 20 | **Social Commerce Catalog Generator** | Connects inventory to Instagram/TikTok storefronts with localized SEO descriptions. |

### Category 3: Military Transition & JBSA

| # | Agent | Description |
|---|---|---|
| 21 | **Resume Translator** | Maps NCOER/FITREP military jargon to civilian competencies using semantic dictionaries. |
| 22 | **VA Claim Nexus Crafter** | Drafts medically sound Nexus letters from military medical records and service histories. |
| 23 | **Workforce Solutions Alamo Matcher** | Identifies upskilling programs from the "$49.5M SA: Ready to Work" database. |
| 24 | **Military Spouse Federal Resume Builder** | Tuned to USAJOBS format for GS-scale competitive federal resumes. |
| 25 | **TRICARE to Civilian Healthcare Navigator** | Compares TRICARE Prime/Select against civilian plans with out-of-pocket projections. |
| 26 | **Security Clearance Job Matcher** | Matches TS-SCI/Secret cleared candidates to defense contractor vacancies (Boeing, Lockheed). |
| 27 | **MIC3 Dependent Waiver Automator** | Generates Interstate Compact waivers for military dependent school transfers. |
| 28 | **SkillBridge Application Writer** | Drafts command approval memos and identifies local SA SkillBridge corporate sponsors. |
| 29 | **GI Bill Optimizer** | Calculates optimal stacking of Hazelwood Act + Post-9/11 GI Bill for UTSA and Alamo Colleges. |
| 30 | **Supply Chain Simulator** | Helps logistics officers apply military predictive maintenance to civilian distribution. |

### Category 4: Healthcare Administration & STMC

| # | Agent | Description |
|---|---|---|
| 31 | **Ambient Clinical Note Formatter** | Formats audio transcripts into structured SOAP notes for EHR systems. |
| 32 | **Insurance Referral Processor** | Verifies payer eligibility and updates scheduling software from faxed/digital referrals. |
| 33 | **Medical Coding Validator** | Suggests highest-specificity ICD-10 and CPT codes to reduce claim denials. |
| 34 | **Patient Triage Chatbot** | Pre-appointment SMS gathering medical histories and flagging urgent symptoms. |
| 35 | **Clinical Trial Matchmaker** | Cross-references UT Health research with anonymized patient populations. |
| 36 | **HIPAA Data Synthesizer** | Anonymizes and scrubs PHI for secondary AI training datasets. |
| 37 | **Hospital Bed Predictor** | Forecasts ICU/acute bed availability using admission rates and seasonal data. |
| 38 | **Diabetes Management Tracker** | Identifies high-risk Medicare beneficiaries using SA CHNA metrics. |
| 39 | **Telehealth Router (WHIM)** | Redirects non-emergent rural inquiries to telehealth services. |
| 40 | **Nursing Staff Scheduler** | Generates optimized shift schedules based on predicted patient census. |

### Category 5: Tourism, Hospitality & Event Management

| # | Agent | Description |
|---|---|---|
| 41 | **Virtual Hotel Concierge** | Omnichannel agent handling routine guest inquiries (checkout, pool hours, dining). |
| 42 | **Dynamic Pricing Optimizer** | Adjusts hotel rates in real-time based on events, competition, and weather. |
| 43 | **Convention Center Orchestrator** | Floor plans, AV scheduling, and vendor logistics for the Henry B. Gonzalez Center. |
| 44 | **Flight Delay Automator** | Monitors SA International Airport for delays and auto-rebooks travel. |
| 45 | **Multilingual Gastronomy Guide** | UNESCO Creative City dining itineraries for international tourists. |
| 46 | **Predictive Maintenance** | IoT sensor analysis for preemptive hotel room maintenance dispatch. |
| 47 | **Fiesta Event Navigator** | Downtown street closure routing, parking, and parade routes during Fiesta. |
| 48 | **Mission Audio Tour Generator** | GPS-triggered RAG tours of the Alamo and SA Missions. |
| 49 | **VIP Upsell Engine** | Personalized pre-arrival emails with room upgrades and spa packages. |
| 50 | **Restaurant Health Inspector** | Metropolitan Health District database queries for cleanliness scores. |

### Category 6: Connect-360 SmartSA (Interoperability)

| # | Agent | Description |
|---|---|---|
| 51 | **City-Military Liaison** | Cross-domain queries spanning City of SA and JBSA workforce systems. |
| 52 | **Healthcare-Civic Bridge** | Connects STMC patient navigation with municipal social services. |
| 53 | **Business-Tourism Optimizer** | Links hospitality demand signals to small business supply readiness. |
| 54 | **Veteran Healthcare Navigator** | Bridges VA healthcare systems with civilian provider networks. |
| 55 | **Education-Workforce Connector** | Links Pre-K through higher ed pathways to employment pipelines. |
| 56 | **Infrastructure-Business Impact** | Correlates infrastructure projects with small business disruption mitigation. |
| 57 | **Public Safety-Healthcare Coordinator** | Emergency services coordination between SAPD, SAFD, and STMC. |
| 58 | **Housing-Economic Mobility** | Connects affordable housing programs with workforce development. |
| 59 | **Cultural Heritage-Tourism** | UNESCO/Historic Preservation data integration for tourism marketing. |
| 60 | **Data Integration Hub** | Master data management across all 5 primary domains. |

---

## Subscription Tiers

| Tier | Monthly | Annual | Features |
|---|---|---|---|
| **Starter** | $49/mo | $39/mo (billed annually) | All 60 agents, 1,000 requests/mo, real-time SA data, browser access, email support |
| **Growth** | $149/mo | $119/mo (billed annually) | All 60 agents, 10,000 requests/mo, team seats (5 users), priority support, analytics dashboard, custom agent config |
| **Partner** | $499/mo | $399/mo (billed annually) | Unlimited seats + requests, dedicated account manager, SSO/SAML, custom integrations, SLA, on-prem deployment, compliance reporting |

All plans include end-to-end encryption, 24/7 availability, and zero data retention. Annual billing saves ~20%.

---

## Stripe to QuickBooks Revenue Pipeline

Every paid subscription triggers an automated revenue recognition flow:

```
User subscribes → Stripe Checkout Session
                       │
                  invoice.paid webhook
                       │
              ┌────────┴─────────┐
              │ recordStripePayment() │
              └────────┬─────────┘
                       │
              QBO OAuth2 Token Refresh
                       │
              Create Sales Receipt
              (v3/company/{realmId}/salesreceipt)
                       │
              QuickBooks Online (Live)
              Realm: 9341453681057009
```

**Webhook Events Handled:**
- `checkout.session.completed` — Plan assignment (starter/growth/partner)
- `invoice.paid` — QBO Sales Receipt creation with customer email, plan name, Stripe invoice ID
- `customer.subscription.deleted` — Downgrade to starter plan
- `customer.subscription.updated` — Cancellation tracking

**QBO Sales Receipt Fields:**
- CustomerRef: AI Cowboys LLC (ID: 58)
- Line items: Plan name, amount, customer email
- PrivateNote: Stripe Invoice ID + Subscription ID for audit trail

---

## B2B Lead Generation Engine

1. **Inbound Funnel** — "Hire The AI Cowboys" section for custom agent development requests
2. **AI-Driven Lead Scoring** — Background scoring based on firmographic data and digital intent signals
3. **Intent Data Activation** — High-frequency search patterns (e.g., "automated insurance referral") flag high-priority leads
4. **Marketplace Flywheel** — Custom agents are generalized and published as new marketplace cards

---

## Project Structure

```
SAAIagentmarketplace/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Home — hero section, agent showcase, CTAs
│   │   ├── layout.tsx             # Root layout with Supabase provider
│   │   ├── globals.css            # Tailwind base + custom styles
│   │   ├── agents/                # Agent marketplace page (browse/filter 60 agents)
│   │   ├── auth/                  # Auth routes (login, signup, OAuth callback)
│   │   ├── dashboard/             # Protected user dashboard (deploy/monitor)
│   │   ├── pricing/               # 3-tier pricing with Stripe Checkout
│   │   └── api/
│   │       ├── agents/            #   Agent listing and retrieval
│   │       ├── newsletter/        #   Newsletter signup
│   │       ├── waitlist/          #   Waitlist capture
│   │       └── stripe/
│   │           ├── checkout/      #   Stripe Checkout Session creation
│   │           └── webhook/       #   Stripe event handler + QBO sync
│   │               └── route.ts   #   checkout.session.completed, invoice.paid,
│   │                              #   customer.subscription.deleted/updated
│   ├── components/
│   │   ├── agents/                # Agent card grid, filters, detail views
│   │   ├── home/                  # Hero, feature sections, testimonials
│   │   ├── layout/                # Navbar, footer, page shells
│   │   └── ui/                    # Button, Input, Card, Badge primitives
│   ├── lib/
│   │   ├── agents-data.ts         # 60 agent definitions (456 lines)
│   │   ├── stripe.ts              # Stripe singleton + plan config ($49/$149/$499)
│   │   ├── quickbooks.ts          # QBO OAuth2 token management + Sales Receipt creation
│   │   ├── store.ts               # Zustand global state
│   │   ├── types.ts               # Core TypeScript interfaces and enums
│   │   └── supabase/              # Supabase client (browser + server)
│   └── middleware.ts              # Auth protection for /dashboard, /auth/callback
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── engine.py          # Agent execution engine + intent classifier
│   │   │   ├── tools.py           # 60 LangChain @tool definitions (6 categories)
│   │   │   └── seed.py            # Database seeder (60 agent catalog)
│   │   ├── routers/
│   │   │   ├── agents.py          # GET /agents, GET /agents/{slug}
│   │   │   ├── auth.py            # POST /auth/login, POST /auth/logout
│   │   │   ├── billing.py         # Stripe webhooks + subscription CRUD
│   │   │   └── leads.py           # POST /leads/score, POST /leads/enrich
│   │   ├── etl/                   # ETL pipelines for municipal/workforce data
│   │   ├── models.py              # SQLAlchemy table definitions (6 tables)
│   │   ├── database.py            # Session factory and initialization
│   │   └── main.py                # FastAPI entry point with CORS
│   └── requirements.txt           # 18 Python dependencies
│
├── scripts/                       # Utility scripts
├── .env.local.example             # Environment variable template
├── package.json                   # Frontend: 12 dependencies, 4 devDependencies
├── tailwind.config.ts             # Custom tokens: navy, brand, tactical, surface, midnight
├── tsconfig.json                  # TypeScript strict mode
├── vercel.json                    # Vercel deployment + security headers
├── postcss.config.js              # PostCSS with Tailwind + autoprefixer
└── README.md
```

---

## API Reference

### Next.js API Routes (Frontend)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/stripe/checkout` | Create Stripe Checkout Session (plan, billing period) |
| POST | `/api/stripe/webhook` | Handle Stripe events, sync to QBO |
| GET | `/api/agents` | List all 60 agents with category filters |
| POST | `/api/newsletter` | Newsletter email capture |
| POST | `/api/waitlist` | Waitlist signup |

### FastAPI Backend Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/agents` | List agents (filterable by category, tier) |
| GET | `/api/agents/{slug}` | Agent details with reviews |
| POST | `/api/auth/login` | Initiate Supabase OAuth2 flow |
| POST | `/api/auth/logout` | Clear session tokens |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/billing/subscribe` | Create Stripe subscription |
| POST | `/api/billing/webhook` | Handle Stripe webhook events |
| GET | `/api/billing/status` | Current subscription status |
| POST | `/api/leads/score` | Lead quality scoring (additive model) |
| POST | `/api/leads/enrich` | Firmographic lead enrichment |

---

## Database Schema

| Table | Key Fields | Purpose |
|---|---|---|
| **profiles** | id (UUID), email, full_name, avatar_url, stripe_customer_id, plan | User accounts + subscription tier |
| **Subscription** | user_id (FK), plan, stripe_subscription_id, status, period dates | Billing and access control |
| **AgentCatalog** | slug, name, category, tier, capabilities (JSON), rating, tools_config | 60-agent registry |
| **Deployment** | user_id (FK), agent_id (FK), name, configuration (JSON), status | Active agent instances |
| **Review** | user_id (FK), agent_id (FK), rating (1-5), title, body | Agent feedback and ratings |
| **Lead** | company_name, contact_name, email, industry, lead_score, status | B2B pipeline tracking |

---

## Security Architecture

| Layer | Implementation |
|---|---|
| **Transport** | HTTPS enforced via Vercel edge, HSTS headers |
| **Authentication** | Supabase OAuth2 + JWT (HS256) in HTTP-only cookies |
| **Authorization** | Row-Level Security (RLS) in Supabase Postgres |
| **API Security** | CORS strict origin, rate limiting, input validation via Pydantic |
| **Payment Security** | Stripe webhook signature verification (`constructEvent`) |
| **Headers** | X-Frame-Options: DENY, X-Content-Type-Options: nosniff, restricted Permissions-Policy |
| **Secrets** | Environment variables only — never hardcoded, never committed |
| **Data Retention** | Zero data retention policy across all subscription tiers |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase project (authentication)
- Stripe account (billing)
- OpenAI API key (optional — demo mode uses MockLLM)

### Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_MONTHLY_PRICE_ID=price_...
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_PARTNER_MONTHLY_PRICE_ID=price_...

# QuickBooks Online (Live)
QBO_CLIENT_ID=your_client_id
QBO_CLIENT_SECRET=your_client_secret
QBO_REFRESH_TOKEN=your_refresh_token
QBO_REALM_ID=your_realm_id

# OpenAI (optional)
OPENAI_API_KEY=sk-...
```

### Frontend Setup

```bash
npm install
npm run dev
# Runs at http://localhost:3200
```

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Seed the Database

```bash
cd backend
python -m app.agents.seed
```

---

## Deployment

### Vercel (Frontend)

Deployed to Vercel with `vercel.json`:

- **Region:** `iad1` (US East)
- **Framework:** Next.js 14
- **Dev port:** 3200
- **Security headers** on all routes:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Set all 15 environment variables in Vercel project settings before deploying.

### Backend

FastAPI runs on Uvicorn. For production, deploy behind a reverse proxy with HTTPS termination.

---

## Design System

### Color Tokens (Tailwind)

| Token | Scale | Usage |
|---|---|---|
| `navy` | 50-950 | Primary brand — Oxford Navy (#002145) structural anchor |
| `brand` | 50-900 | Amber/Orange — CTAs, highlights, badges |
| `tactical` | 400-500 | Green — Success states, confirmations |
| `surface` | 50-200 | Light backgrounds — clean, modern feel |
| `midnight` | 50-950 | Slate — dark mode compatibility, neutral text |

### Typography

| Font | Stack | Usage |
|---|---|---|
| Inter | `system-ui`, `-apple-system`, sans-serif | Body text, UI labels, headings |
| System Mono | `ui-monospace`, `SFMono-Regular`, Menlo | Code, data displays |

### Category Theming

| Category | Color | Icon Theme |
|---|---|---|
| Civic | Blue | Government, infrastructure |
| Business | Emerald | Commerce, growth |
| Military | Amber | Defense, transition |
| Healthcare | Rose | Medical, wellness |
| Tourism | Violet | Hospitality, culture |
| Connect-360 | Navy | Integration, interop |

---

## Brand Identity

**The AI Cowboys** — Rugged reliability, regional pride, and elite technological competence. Positioned as "Texas Trusted Experts" providing mission-critical, government-grade compliant AI solutions.

**Brand tone:** Direct, authoritative, no fluff. No emojis. No generic AI design tropes. Bespoke, human-crafted aesthetic throughout.

**Visual identity:** Clean, light-mode SaaS dashboard aesthetic with premium feel. Features "Clicky," the cybersecurity mascot, in loading screens and tutorials.

---

## Demographic & Economic Context

San Antonio's marketplace architecture responds directly to civic and economic realities:

- **Municipal Services**: 311 system processes thousands of service requests. ACS handles 87,000+ calls annually.
- **Military City USA**: ~4,000 service members transition annually from JBSA. Severe bottlenecks in civilian resume translation and VA claims.
- **Healthcare Hub**: STMC and UT Health SA adopt agentic AI for clinical note transcription, referral processing, and patient intake.
- **Tourism Economy**: Multi-billion dollar sector anchored by Henry B. Gonzalez Convention Center and UNESCO World Heritage sites.
- **45,000+ Small Businesses**: Regulatory compliance, procurement matching, and commercial viability needs.

---

## Works Cited

1. City of San Antonio - "Unified Resident Experience" (Nov 2022)
2. Military AI Agent Marketplace - militaryaiagents.com
3. The AI Cowboys - theaicowboys.com
4. 311 All Service Calls - Open Data SA
5. Animal Care Services - City of San Antonio
6. San Antonio Municipal Court Online Services
7. JBSA Workforce Transition Alliance
8. AI Innovation at UT Health San Antonio
9. AI Solutions for Hospitality - Travel Outlook
10. LangChain Open Source AI Agent Framework
11. LangGraph Multi-Agent Documentation
12. Stripe API Documentation
13. QuickBooks Online API Documentation
14. Supabase Auth Documentation
15. Next.js 14 App Router Documentation
16. Vercel Deployment Documentation
17. City of San Antonio FY 2025 Proposed Budget
18. SA Community Health Needs Assessment (CHNA)
19. UNESCO Creative City of Gastronomy - San Antonio
20. Interstate Compact on Educational Opportunity for Military Children (MIC3)

---

## License

Proprietary. All rights reserved. The AI Cowboys LLC.
