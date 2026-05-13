# San Antonio AI Agent Marketplace

**By The AI Cowboys** — Texas Trusted Experts in Mission-Critical AI

A GUI-based AI Agent Marketplace engineered for the City of San Antonio, delivering 50 specialized LangChain-powered autonomous agents across five strategic domains: Civic Governance, Small Business & Economic Development, Military Transition (JBSA), Healthcare Administration (STMC), and Tourism & Hospitality. Built on robust ETL pipelines, LangGraph multi-agent orchestration, and a frictionless 3-click deployment paradigm.

---

## Table of Contents

- [Overview](#overview)
- [Demographic and Economic Context](#demographic-and-economic-context)
- [Brand Identity](#brand-identity)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Multi-Agent Design Patterns](#multi-agent-design-patterns)
- [UX Paradigm: 3-Click Installation](#ux-paradigm-3-click-installation)
- [The 50 San Antonio Agents](#the-50-san-antonio-agents)
- [Subscription Tiers](#subscription-tiers)
- [B2B Lead Generation Engine](#b2b-lead-generation-engine)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Design System](#design-system)
- [Works Cited](#works-cited)
- [License](#license)

---

## Overview

The San Antonio AI Agent Marketplace addresses the operational friction experienced by residents, businesses, veterans, healthcare providers, and the hospitality sector in the San Antonio metropolitan area. The platform is derived from the "Unified Resident Experience" framework — an interlocal initiative designed to eliminate bureaucratic silos through a "Connect-360" omni-channel approach.

The marketplace delivers:

- **50 specialized AI agents** across 5 San Antonio-focused domains
- **LangGraph Supervisor Router** for multi-agent orchestration with intent classification
- **Robust ETL pipelines** feeding localized data from municipal open data portals, ACS registries, workforce databases, and healthcare systems
- **Stripe-integrated subscription billing** adapted from the militaryaiagents.com paradigm
- **Supabase OAuth2 authentication** with JWT session management and zero-trust architecture
- **ChromaDB vector search** for semantic agent discovery via RAG
- **3-click deployment** — Select Agent, Authenticate, Deploy Workspace
- **B2B custom agent development funnel** with AI-driven lead scoring

---

## Demographic and Economic Context

The marketplace architecture is directly responsive to San Antonio's civic and economic realities:

### Municipal Services
San Antonio's 311 system processes high volumes of service requests across property maintenance, traffic signals, solid waste, and animal control. Animal Care Services (ACS) handles over 87,000 calls annually. Local districts report persistent challenges including traffic violations, reckless driving, and deteriorating buildings requiring residents to navigate complex municipal court schedules.

| Service Category | Primary Resident Pain Points | AI Intervention Vector |
|---|---|---|
| Streets & Infrastructure | Potholes, downed trees, sidewalk repair, traffic signals | Automated severity grading, Public Works routing |
| Animal Care Services | Strays, dangerous dog affidavits, TNR coordination | Autonomous scheduling, guided affidavit generation |
| Solid Waste Management | Illegal dumping, missed collections, brush scheduling | Proactive SMS notifications, Free Landfill Day routing |
| Property Maintenance & Code | Vacant buildings, overgrown lots, junk vehicles, graffiti | Predictive code violation modeling, automated 311 workflows |
| Municipal Court & Citations | Traffic violations, parking tickets, outstanding warrants | Eligibility analysis for Deferred Disposition and Defensive Driving |

### Military Transition
San Antonio is Military City USA. Approximately 4,000 service members transition out annually. Joint Base San Antonio (JBSA) and Workforce Solutions Alamo actively partner to integrate veterans into the civilian workforce. This demographic faces severe bottlenecks in translating military experience into civilian terminology and navigating VA claims processes.

### Healthcare Administration
The South Texas Medical Center (STMC) and UT Health San Antonio are adopting agentic AI to alleviate administrative burdens — clinical note transcription, insurance referral processing, and patient intake routines that bottleneck operational efficiency.

### Tourism & Hospitality
The tourism sector, anchored by the Henry B. Gonzalez Convention Center and UNESCO World Heritage sites, faces severe labor shortages. AI solutions like the "Annette" Virtual Hotel Agent handle up to 70% of routine inbound calls, freeing staff for high-value guest interactions.

---

## Brand Identity

**The AI Cowboys** — Rugged reliability, regional pride, and elite technological competence. Positioned as "Texas Trusted Experts" providing mission-critical, government-grade compliant AI solutions for zero-trust organizations operating in the agentic AI era.

**Brand tone:** Direct, authoritative, no fluff. No emojis in the interface. No generic AI design tropes. Bespoke, human-crafted aesthetic throughout.

**Visual identity:** High-tech, data-heavy dashboard aesthetic resembling an intelligence platform. Features "Clicky," the cybersecurity mascot, integrated into loading screens and tutorials.

**Color palette:**

| Role | Color | Hex |
|---|---|---|
| Primary background / structural anchor | Oxford Navy | `#002145`, `#002244` |
| Borders, text, active UI components | Metallic Silver / Muted Grey | `#b0b7bc`, `#acc0cb`, `#a5acaf`, `#A2AAAD` |
| Brand accent (CTAs, highlights) | Amber/Orange | Custom Tailwind `brand` tokens |
| Success states | Tactical Green | Custom Tailwind `tactical` tokens |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2 | React framework with App Router, SSR |
| React | 18.3 | UI component library |
| TypeScript | 5.7 | Type-safe development (strict mode) |
| Tailwind CSS | 3.4 | Utility-first styling with custom design tokens |
| Zustand | 5.0 | Lightweight state management |
| Framer Motion | 11.15 | Animations and transitions |
| Lucide React | 0.468 | Icon library |
| clsx + tailwind-merge | -- | Conditional class utilities |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.115 | Async Python API framework |
| Python | 3.11+ | Backend runtime |
| SQLAlchemy | 2.0 | ORM with type-safe database operations |
| LangChain | 0.3.9 | Agent tool orchestration and docstring-driven tool selection |
| LangGraph | 0.2.53 | Multi-agent supervisor routing |
| LangChain OpenAI | 0.2.11 | OpenAI LLM integration (with MockLLM fallback) |
| ChromaDB | 0.5.23 | Vector embeddings and semantic search (RAG) |
| Pydantic | 2.10 | Data validation and settings management |
| Alembic | 1.14 | Database migrations |
| HTTPX | 0.28 | Async HTTP client |

### Authentication & Payments

| Technology | Purpose |
|---|---|
| Supabase SSR | OAuth2 authentication (Google, GitHub, etc.) |
| JWT (HS256) | Token-based session management via HTTP-only cookies |
| Stripe | Subscription billing with webhook event handling |
| Passlib + Bcrypt | Password hashing (email/password fallback, cost factor 10) |
| python-jose | JWT token creation and verification |

### Infrastructure

| Technology | Purpose |
|---|---|
| Vercel | Frontend deployment (region: iad1, US East) |
| SQLite | Local development database |
| Postgres + pgvector | Production database with vector search |
| Uvicorn | ASGI server for FastAPI |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      Next.js 14 Frontend                      │
│                                                                │
│   Marketplace    Dashboard    Pricing    Auth    Lead Form     │
│   (Agent Cards)  (Deploy/     (Stripe    (Supa-  (B2B Custom   │
│                   Monitor)    Checkout)  base)    Agent CTA)   │
│                                                                │
│   Zustand State  |  Framer Motion  |  Tailwind Design Tokens  │
└──────────────────────────┬───────────────────────────────────┘
                           │ API Routes + CORS
┌──────────────────────────┴───────────────────────────────────┐
│                       FastAPI Backend                          │
│                                                                │
│  ┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Agents    │  │  Billing   │  │  Auth    │  │  Leads   │  │
│  │  Router    │  │  Router    │  │  Router  │  │  Router  │  │
│  └─────┬──────┘  └─────┬──────┘  └────┬─────┘  └────┬─────┘  │
│        │               │              │              │         │
│  ┌─────┴───────────────┴──────────────┴──────────────┴──────┐ │
│  │              Agent Execution Engine                        │ │
│  │                                                            │ │
│  │  User Query → Intent Classifier (keyword scoring)         │ │
│  │           → Category Assignment (5 domains)               │ │
│  │           → Best Agent Selection                          │ │
│  │           → LangGraph Supervisor Router                   │ │
│  │           → Tool Invocation + Result Aggregation          │ │
│  └─────────────────────────┬────────────────────────────────┘ │
│                             │                                  │
│  ┌──────────────────────────┴───────────────────────────────┐ │
│  │                  50 LangChain @tools                       │ │
│  │                                                            │ │
│  │  Civic (10)  |  Business (10)  |  Military (10)           │ │
│  │  Healthcare (10)  |  Tourism (10)                         │ │
│  │                                                            │ │
│  │  Each tool: @tool decorator + exhaustive docstring         │ │
│  │  with "USE WHEN" guidance for deterministic routing       │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     ┌────┴─────┐   ┌────┴─────┐   ┌─────┴─────┐
     │ SQLite / │   │ Supabase │   │  Stripe   │
     │ Postgres │   │  Auth    │   │  Billing  │
     │ ChromaDB │   │  (OAuth) │   │ (Webhooks)│
     └──────────┘   └──────────┘   └───────────┘
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

### Docstring Engineering

The architecture enforces exhaustive, highly specific docstrings for every `@tool`. Rather than a vague `def search()`, the system uses definitions like `def search_sa_property_maintenance_code(query: str)` with explicit instructions on when the LLM must and must not invoke the tool. This guarantees deterministic, reliable agent behavior.

---

## UX Paradigm: 3-Click Installation

The interface shifts from reactive chat boxes to proactive, trusted autonomy:

| Click | Action | What Happens |
|---|---|---|
| **1. Selection** | User browses the agent card grid, filters by category, clicks "Install Agent" | Agent selected from the 50-card marketplace |
| **2. Authentication** | User securely connects the agent to data sources via OAuth or API key | Local credential vault — marketplace developers never access sensitive data |
| **3. Activation** | User clicks "Deploy Workspace" | Backend provisions an isolated LangGraph runtime, injects system prompts and API keys, launches the agent with a taskboard, activity timeline, and evidence panels |

### Agent Cards

Each of the 50 agents is presented as a visually distinct, premium digital asset featuring:
- A compelling, benefit-driven description (e.g., "Saves 14 hours per week on medical intake")
- A slightly above fair market value price tag anchoring premium worth
- A highly prominent, friction-free "Install Now" button designed for immediate conversion

---

## The 50 San Antonio Agents

### Category 1: Unified Resident Experience (Civic Engagement)

Designed to manifest the "Connect-360" vision and resolve daily municipal frictions. Interface directly with City of San Antonio open data endpoints.

| # | Agent | Description |
|---|---|---|
| 1 | **311 Infrastructure Abatement Agent** | Connects to CoSA GIS dataset. Users upload photo evidence; vision-language models extract geolocation, categorize pothole severity, and autonomously format 311 service tickets with repair timeline updates. |
| 2 | **CPS Energy Rate Optimizer** | Ingests historical energy consumption data and cross-references CPS Energy variable rate plans, generating autonomous smart-thermostat adjustment schedules for maximum cost savings. |
| 3 | **Property Maintenance Code Checker** | RAG-powered agent using the SA Property Maintenance Code. Users input property conditions; the agent predicts potential code violations before Code Enforcement issues citations. |
| 4 | **Dangerous Animal Triage Agent** | Integrates with Animal Care Services (ACS) dangerous dog registry and bite map data. Assists residents in legally documenting incidents and drafting dangerous animal affidavits. |
| 5 | **TNR (Trap-Neuter-Return) Coordinator** | Maps ACS stray data, locates upcoming free microchip/vaccination events, and autonomously schedules spay/neuter appointments at local clinics for feral cat caretakers. |
| 6 | **Municipal Court Citation Resolver** | Interfaces with the SA Municipal Court online docket system. Evaluates traffic and parking tickets for eligibility for Defensive Driving courses or Deferred Disposition. |
| 7 | **Pre-K 4 SA Enrollment Guide** | Navigates complex Pre-K 4 SA eligibility requirements. Cross-references residential zoning data and household income limits to autonomously complete application paperwork. |
| 8 | **VIA Transit Route Optimizer** | Calculates the most efficient multi-modal transit routes incorporating VIA bus schedules, dockless scooter availability, and pedestrian walkways based on real-time traffic density. |
| 9 | **Solid Waste & Brush Schedule Tracker** | Monitors Solid Waste Management Department schedules. Sends proactive, localized SMS alerts for bulky item pickup days and upcoming Free Landfill events. |
| 10 | **SASpeakUp Policy Synthesizer** | Scrapes City Council agendas and SASpeakUp public surveys. Uses extractive summarization to condense massive legislative PDFs into actionable three-bullet briefs. |

### Category 2: Small Business & Economic Development

Targeting 45,000+ small businesses in San Antonio. Automates regulatory compliance, procurement, and commercial viability.

| # | Agent | Description |
|---|---|---|
| 11 | **SBEDA Procurement Matchmaker** | Monitors the SA vendor registry and matches minority/women-owned businesses with relevant municipal RFPs, autonomously drafting initial bid templates. |
| 12 | **RevitalizeSA Grant Writer** | Specialized in the Corridor Leadership Program and construction mitigation grants. Conducts conversational interviews with business owners and drafts compelling grant narratives. |
| 13 | **BuildSA Permit Navigator** | Interfaces with the Development Services Department (DSD). Analyzes architectural blueprints and zoning maps to determine exact commercial permit requirements. |
| 14 | **Historic Preservation (OHP) Rehab Assistant** | Cross-references building addresses with the Office of Historic Preservation database. Advises on materials compliance and calculates tax incentives for historic rehabilitation. |
| 15 | **VITA Tax Prep Assistant** | Gathers profit/loss data from local sole proprietors, categorizes expenses, and formats data for the Volunteer Income Tax Assistance program. |
| 16 | **Bexar County Commercial Real Estate Analyzer** | Ingests local zoning maps and Bexar Appraisal District records. Pinpoints optimal retail locations by analyzing historical foot traffic and demographic density. |
| 17 | **Local B2B Lead Generation Swarm** | Multi-agent router that scrapes local SA business directories, enriches contact profiles with firmographic data, and automates personalized outbound B2B sales sequences. |
| 18 | **Food Truck Mobile Vending Compliance Agent** | Guides culinary entrepreneurs through Metropolitan Health District regulations, FireSafeSA inspections, and designated downtown parking zone requirements. |
| 19 | **Texas Micro-Business Disaster Recovery Locator** | Monitors the Governor's Office of Small Business Assistance for emergency funding and low-interest CDFI loans following severe weather events. |
| 20 | **Social Commerce Catalog Generator** | Connects local inventory management to Instagram and TikTok storefronts, automatically generating localized, SEO-optimized product descriptions. |

### Category 3: Military Transition & JBSA

Captures the veteran transition market, directly addressing the friction of civilian integration. Modeled on militaryaiagents.com bundles.

| # | Agent | Description |
|---|---|---|
| 21 | **NCOER/FITREP to Civilian Resume Translator** | Ingests military performance evaluations and maps tactical jargon into equivalent civilian corporate competencies using a specialized semantic dictionary. |
| 22 | **VA Claim Nexus Crafter** | Analyzes military medical records and service histories to draft highly structured, medically sound Nexus letters required for disability compensation claims. |
| 23 | **Workforce Solutions Alamo Matcher** | Integrates with the "$49.5M SA: Ready to Work" database to identify optimal upskilling programs and paid apprenticeships for transitioning personnel. |
| 24 | **Military Spouse Federal Resume Builder** | Tuned to the rigid USAJOBS format. Helps military spouses articulate frequent relocations and volunteer work into GS-scale competitive federal resumes. |
| 25 | **TRICARE to Civilian Healthcare Navigator** | Compares TRICARE Prime/Select benefits against civilian employer healthcare plans, calculating long-term out-of-pocket differences for retiring personnel. |
| 26 | **Security Clearance Job Matcher** | Scrapes local defense contractor job boards (Boeing, Lockheed Martin at Port SA) and matches candidates with active Secret or TS-SCI clearances to critical vacancies. |
| 27 | **MIC3 Dependent Waiver Automator** | Generates Interstate Compact on Educational Opportunity for Military Children (MIC3) waivers for seamless public school transfers and curriculum alignment. |
| 28 | **JBSA SkillBridge Application Writer** | Assists active-duty members navigating the DOD SkillBridge program by drafting command approval memorandums and identifying local SA corporate sponsors. |
| 29 | **Hazelwood Act & GI Bill Optimizer** | Calculates the most financially efficient methodology for stacking Texas Hazelwood Act benefits with the Post-9/11 GI Bill for UTSA or Alamo Colleges. |
| 30 | **Project ARIA Supply Chain Simulator** | Modeled on the Army's AI initiative. Helps transitioning logistics officers apply military predictive maintenance concepts to civilian warehousing and distribution. |

### Category 4: Healthcare Administration & STMC

Addresses administrative bottlenecks in healthcare, engineered to operate within HIPAA-compliant, zero-trust boundaries.

| # | Agent | Description |
|---|---|---|
| 31 | **Ambient Clinical Note Formatter** | Ingests audio transcripts of patient-doctor interactions and formats them into structured SOAP notes compliant with major EHR systems. |
| 32 | **Insurance Referral Intake Processor** | Reads incoming faxed/digital referrals, verifies payer eligibility against clearinghouses, and updates scheduling software. |
| 33 | **Medical Coding Validator** | Analyzes clinical documentation to suggest the most accurate, highest-specificity ICD-10 and CPT codes, reducing costly claim denial rates. |
| 34 | **Patient Triage & Intake Chatbot** | Engages patients via SMS prior to appointments, gathering routine medical histories and flagging urgent or anomalous symptoms for immediate clinical review. |
| 35 | **Clinical Trial Matchmaker** | Ingests ongoing translational science research from UT Health San Antonio and cross-references anonymized patient populations for eligible study candidates. |
| 36 | **HIPAA-Compliant Data Synthesizer** | Identifies, anonymizes, and scrubs PHI from patient datasets, allowing hospitals to safely use data for secondary AI training and operational analytics. |
| 37 | **Hospital Bed & Discharge Predictor** | Analyzes real-time admission rates and historical seasonal data to predict ICU/acute bed availability at Level 1 Trauma Centers like Brooke Army Medical Center. |
| 38 | **Medicare Diabetes Management Tracker** | Monitors patient data against the SA Community Health Needs Assessment (CHNA) metrics to identify high-risk Medicare beneficiaries requiring proactive intervention. |
| 39 | **Telehealth Network Router (WHIM)** | Based on the Wellness and Health Insight Model. Intercepts non-emergent rural patient inquiries and redirects to telehealth services, reducing uncompensated ER care. |
| 40 | **Nursing Staff Scheduler** | Uses predictive algorithms to forecast patient census volumes and generates optimized nursing shift schedules to ensure coverage and prevent burnout. |

### Category 5: Tourism, Hospitality & Event Management

Optimizes the visitor experience and back-office operations for San Antonio's multi-billion dollar tourism economy.

| # | Agent | Description |
|---|---|---|
| 41 | **Annette-Style Virtual Hotel Concierge** | Omnichannel agent handling routine guest inquiries (checkout times, pool hours, River Walk recs), freeing human staff for complex, high-touch interactions. |
| 42 | **Dynamic Pricing & Revenue Optimizer** | Ingests local event data, competitor pricing, and weather forecasts to autonomously adjust hotel room rates in real-time for maximum yield. |
| 43 | **Convention Center Event Orchestrator** | Assists event planners at the Henry B. Gonzalez Convention Center with custom floor plans, AV team scheduling, and complex vendor logistics. |
| 44 | **Flight Delay Rescheduling Automator** | Monitors SA International Airport APIs. Upon detecting delays, autonomously texts travelers to rebook flights, extend hotel stays, and adjust rental cars. |
| 45 | **Multilingual Gastronomy Guide** | Leverages SA's UNESCO Creative City of Gastronomy status to provide international tourists with culturally accurate, dynamically routed dining itineraries. |
| 46 | **Housekeeping Predictive Maintenance** | Analyzes IoT sensor data from hotel rooms (HVAC usage, water flow) to dispatch maintenance before guests experience equipment failures. |
| 47 | **Fiesta San Antonio Event Navigator** | Geographic routing agent helping tourists navigate downtown street closures, find parking, and locate parade routes during the annual Fiesta. |
| 48 | **Historic Mission Audio Tour Generator** | GPS-triggered RAG agent providing dynamic, context-aware audio/text historical tours of the Alamo and SA Missions tailored to the user's exact location. |
| 49 | **VIP Experience Upsell Engine** | Analyzes historical guest booking data and demographics to generate personalized pre-arrival emails offering relevant room upgrades and spa packages. |
| 50 | **Restaurant Health Inspection Checker** | Scrapes the Metropolitan Health District database, allowing tourists to query cleanliness scores and violation history of any local food establishment. |

---

## Subscription Tiers

Adapted from the militaryaiagents.com paradigm. Stripe-integrated billing enforces access tiers.

| Tier | Price | Target Demographic | Access |
|---|---|---|---|
| **Alamo Resident Basic** | Free | Individual SA residents, transitioning military, public school students | 9 core civic/transition agents. 3 generations/day limit. Community support. |
| **Texas Pro (Unit License)** | $29/user/month | Small business owners, municipal workers, clinic administrators | All 50 agents. Unlimited generations. Priority support. CRM/ERP integration. |
| **Value Bundles** | $39/month | Niche professionals (HR managers, hospitality directors) | Discounted specialized packs: Medical Admin Suite, Hospitality Concierge Pack, Veteran Transition Kit. |
| **Enterprise Sovereign** | Custom | Large hospital systems (UT Health), hotel chains, defense contractors | Full access + air-gapped deployments (IL5/IL6). Custom ETL pipelines. Dedicated Shadow-AI Governance. |

---

## B2B Lead Generation Engine

The marketplace includes a self-sustaining custom agent development pipeline:

1. **Inbound Funnel** — A prominent "Hire The AI Cowboys - Build Your Custom Workforce" section allows local businesses to request and pay for bespoke agent development
2. **AI-Driven Lead Scoring** — A background `lead_scorer.py` monitors digital intent signals, scores leads based on firmographic data, and drafts personalized cold-email pitches
3. **Intent Data Activation** — If a local STMC clinic frequently searches for "automated insurance referral processing," the predictive engine flags them as high-priority
4. **Marketplace Flywheel** — A firm pays for a custom supply-chain agent; a generalized, anonymized version is published to the marketplace as a new card, driving more inbound traffic

### Lead Pipeline

| Stage | Description |
|---|---|
| New | Inbound form submission or intent signal detection |
| Contacted | Automated outreach via personalized cold-email |
| Qualified | Firmographic scoring confirms budget and need |
| Lost | Disqualified or unresponsive |

---

## Project Structure

```
SAAIagentmarketplace/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Auth routes (login, signup, callback)
│   │   ├── dashboard/           # Protected user dashboard (deploy/monitor agents)
│   │   ├── marketplace/         # Agent card grid — browse and filter 50 agents
│   │   ├── pricing/             # Subscription tier pages with Stripe checkout
│   │   └── api/                 # Next.js API routes
│   │       ├── agents/          #   Agent listing and retrieval
│   │       ├── auth/            #   Login, logout, token refresh
│   │       ├── billing/         #   Stripe subscription management
│   │       └── leads/           #   Lead scoring and enrichment
│   ├── components/              # Reusable React UI components
│   ├── lib/
│   │   └── types.ts             # Core TypeScript interfaces and enums
│   └── middleware.ts            # Auth protection for /dashboard, /auth/callback
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── engine.py        # Agent execution engine + intent classifier
│   │   │   ├── tools.py         # 50 LangChain @tool definitions (5 categories)
│   │   │   └── seed.py          # Database population script (50 agent catalog)
│   │   ├── routers/
│   │   │   ├── agents.py        # GET /agents, GET /agents/{slug}
│   │   │   ├── auth.py          # POST /auth/login, POST /auth/logout
│   │   │   ├── billing.py       # Stripe webhooks + subscription CRUD
│   │   │   └── leads.py         # POST /leads/score, POST /leads/enrich
│   │   ├── models.py            # SQLAlchemy table definitions (6 tables)
│   │   ├── database.py          # SQLite session factory and initialization
│   │   └── main.py              # FastAPI app entry point with CORS
│   └── requirements.txt         # Python dependencies
│
├── scripts/                     # Utility scripts
├── package.json                 # Frontend dependencies and scripts
├── tailwind.config.ts           # Custom design tokens and animations
├── tsconfig.json                # TypeScript strict mode configuration
├── vercel.json                  # Vercel deployment + security headers
└── README.md
```

---

## API Endpoints

### Agents

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/agents` | List agents (filterable by category, tier) |
| GET | `/api/agents/{slug}` | Agent details with reviews |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Initiate Supabase OAuth2 flow |
| POST | `/api/auth/logout` | Clear session tokens |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Billing

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/billing/subscribe` | Create Stripe subscription |
| POST | `/api/billing/webhook` | Handle Stripe webhook events (invoice.payment_succeeded, subscription.updated) |
| GET | `/api/billing/status` | Get current subscription status |

### Leads

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leads/score` | Calculate lead quality score (additive model) |
| POST | `/api/leads/enrich` | Enrich lead with industry/company firmographic data |

---

## Database Schema

| Table | Key Fields | Purpose |
|---|---|---|
| **User** | id (UUID), email, full_name, avatar_url, stripe_customer_id | User accounts |
| **Subscription** | user_id (FK), plan (FREE/PRO/ENTERPRISE), stripe_subscription_id, status, current_period_start/end | Billing and access control |
| **AgentCatalog** | slug, name, category, tier, capabilities (JSON), rating, deployCount, tools_config (JSON), monthly/annual/one_time_price | 50-agent registry |
| **Deployment** | user_id (FK), agent_id (FK), name, configuration (JSON), status (active/paused/archived) | Active agent instances per user |
| **Review** | user_id (FK), agent_id (FK), rating (1-5), title, body, helpful_count | Agent feedback and ratings |
| **Lead** | user_id (FK), company_name, contact_name, email, industry, company_size, lead_score, status | B2B lead tracking pipeline |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase project (for authentication)
- Stripe account (for billing)
- OpenAI API key (optional -- demo mode uses MockLLM without it)

### Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# OpenAI (optional -- falls back to MockLLM demo mode)
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL=sqlite:///./marketplace.db
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

This populates the AgentCatalog table with all 50 agents, their tool configurations, system prompts, and metadata.

---

## Deployment

### Vercel (Frontend)

The frontend deploys to Vercel with the included `vercel.json`:

- **Region:** `iad1` (US East)
- **Dev port:** 3200
- **Security headers** applied to all routes:
  - `X-Frame-Options: DENY` (clickjacking prevention)
  - `X-Content-Type-Options: nosniff` (MIME sniffing prevention)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` (disable sensitive browser APIs)

Set all environment variables in Vercel project settings before deploying.

### Backend

The FastAPI backend runs on Uvicorn. For production, deploy behind a reverse proxy with HTTPS termination.

---

## Design System

### Tailwind Tokens

Defined in `tailwind.config.ts`:

| Token | Palette | Usage |
|---|---|---|
| `brand` | Amber/Orange 50-900 | Primary UI, CTAs, highlights |
| `tactical` | Green 50-950 | Success states, confirmations |
| `midnight` | Slate 50-950 | Backgrounds, neutral text |

### Typography

| Font | Stack | Usage |
|---|---|---|
| Inter | Sans-serif | Body text, UI labels |
| JetBrains Mono | Monospace | Code, data displays |
| Cal Sans | Display | Headlines, hero sections |

### Category Theming

| Category | Color | Icon |
|---|---|---|
| Civic | Blue | -- |
| Business | Emerald | -- |
| Military | Amber | -- |
| Healthcare | Rose | -- |
| Tourism | Violet | -- |

### Animations

| Name | Duration | Usage |
|---|---|---|
| `pulse-slow` | 3s | Subtle attention indicators |
| `gradient` | 8s | Background gradient shifts |
| `float` | 6s | Floating card effects |
| `glow` | 2s | Hover glow effects |

---

## Works Cited

1. City of San Antonio - "Unified Resident Experience" - Presented to SmartSA Partners (Nov 2022)
2. Military AI Agent Marketplace - militaryaiagents.com
3. The AI Cowboys - theaicowboys.com
4. 311 All Service Calls - Open Data SA, City of San Antonio
5. 311 Mobile App - City of San Antonio
6. Urgent Pet Placement Reports / Animal Care Services - City of San Antonio
7. KSAT - Active service requests for Animal Care Services in San Antonio
8. Councilmember Calls for Higher Penalties - City of San Antonio
9. San Antonio Municipal Court citation resolution options - KENS5
10. 311 Service Calls dataset - City of San Antonio
11. Animal Care Services - City of San Antonio
12. City Departments - City of San Antonio
13. Municipal Court Jurisdiction - City of San Antonio
14. City of San Antonio / JBSA job training agreement - San Antonio Report
15. JBSA Workforce Transition Alliance - Joint Base San Antonio
16. AI-Powered Tool for Transitioning Servicemembers - AAFMAA
17. Project ARIA: Army AI Initiative - Joint Base San Antonio
18. Career Transition Hub - FourBlock
19. AI Innovation at UT Health San Antonio - Texas Medical Association
20. AI for Healthcare Administration - Motics AI
21. Healthcare AI Agents - PYMNTS
22. AI Agents for Patient Referrals - Reddit r/AI_Agents
23. Fleming Center Case Competition / WHIM - UTHealth Houston
24. AI Solutions for Hospitality - Travel Outlook
25. AI in Travel Industry - Hospitality Net
26. LangChain Open Source AI Agent Framework
27. Standalone AI Agent App with Python & React - Reddit r/LangChain
28. 311 All Service Calls - CoSA ArcGIS Open Data
29. FY 2025 Proposed Budget - City of San Antonio
30. Building a Simple AI Agent with Python and LangChain - Medium
31. AI Apps with React + FastAPI tutorial
32. Building Multi-Agent Applications with Deep Agents - LangChain Blog
33. Multi-Agent Documentation - LangChain Docs
34. Choosing the Right Multi-Agent Architecture - LangChain Blog
35. Development Services Department Divisions - City of San Antonio
36. Write Better AI Agent Tools - DEV Community
37. Distributing and Selling Local Agents - Reddit r/AI_Agents
38. Databricks Apps with React and Mosaic AI Agents
39. Agentic UX: 7 Principles - Medium / Bootcamp
40. Agent UX Patterns - HatchWorks AI
41. Emergent UX Patterns from Top Agent Builders - Reddit r/AI_Agents
42. Cowboys Color Palette / Dallas Cowboys Logo Colors
43. AI Lead Generation Guide 2026 - Improvado
44. AI-Driven Lead List Building - Mercuri
45. Local Lead Generation - SOCi
46. AI Agents for Lead Generation - Reddit r/AI_Agents
47. San Antonio Municipal Court Online Services
48. Municipal Court - City of San Antonio
49. City Departments Guide - SATXtoday
50. SASpeakUp December Small Business News
51. CCR 2025 - City of San Antonio
52. Small Business & Entrepreneurship Department - Bexar County
53. Small Business Construction Grants - SASpeakUp
54. Government Affairs - City of San Antonio
55. Financing and Capital for Small Businesses - Office of the Texas Governor
56. Small Business Trends 2025 - SBDCNet
57. Military Transition Agreement - City of San Antonio
58. Veterans - a.i. solutions
59. Transition from Military Service to Employment Reports - Texas Workforce Commission
60. UT San Antonio Health Challenges Funding - UTSA News
61. AI & Technology Services - The AI Cowboys
62. DHA Military Health Capabilities in San Antonio
63. Community Health Implementation Strategy - SA Regional Hospital
64. AI Transforming Hospitality and Tourism - Bowles Rice
65. Hospitality Technology in 2025 - Agilysys
66. Travel and Hospitality Trends 2025 - MyLighthouse
67. Claude Code Commands - YouTube
68. Claude Code System Prompts - GitHub
69. Claude Code "Think Before It Codes" Prompt - DEV Community

---

## License

Proprietary. All rights reserved. The AI Cowboys.
