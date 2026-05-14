# San Antonio AI Agent Marketplace

**By [The AI Cowboys](https://www.theaicowboys.com)** — Texas Trusted Experts in Mission-Critical AI

**Live:** [sanantonioaiagents.com](https://sanantonioaiagents.com) | **Parent:** [theaicowboys.com](https://www.theaicowboys.com)

A production-grade AI Agent Marketplace serving the City of San Antonio with 70 specialized autonomous agents across five strategic domains: Civic Services, Small Business & Economic Development, Military Transition (JBSA), Healthcare Administration, and Tourism & Hospitality. Powered by LangChain/LangGraph multi-agent orchestration, Stripe subscription billing with idempotent webhooks and async QuickBooks revenue sync, Supabase authentication with Row-Level Security, server-side entitlement enforcement, rate limiting, CI/CD pipeline, and a 3-click deployment paradigm.

---

## Table of Contents

- [Live Deployment](#live-deployment)
- [Technical Omnibus](#technical-omnibus)
  - [Frontend Stack](#frontend-stack)
  - [Backend Stack](#backend-stack)
  - [Authentication & Identity](#authentication--identity)
  - [Payments & Revenue Pipeline](#payments--revenue-pipeline)
  - [Security & Compliance](#security--compliance)
  - [Infrastructure & DevOps](#infrastructure--devops)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [AI/ML & Agent Orchestration](#aiml--agent-orchestration)
  - [Data Layer](#data-layer)
- [System Architecture](#system-architecture)
- [Multi-Agent Design Patterns](#multi-agent-design-patterns)
- [UX Paradigm: 3-Click Installation](#ux-paradigm-3-click-installation)
- [The 70 San Antonio Agents](#the-70-san-antonio-agents)
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
| **CI/CD** | GitHub Actions (`production-gate.yml`) | Active |

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
| **Supabase Row-Level Security** | Database-level access control per authenticated user (8 tables) |
| **Next.js Middleware** | Route protection for `/dashboard`, auth callback with plan/agent intent preservation |

### Payments & Revenue Pipeline

| Technology | Purpose |
|---|---|
| **Stripe** (Live Mode) | Subscription billing — Checkout Sessions, Webhooks, Customer Portal |
| **Server-Side Plan Validation** | Checkout rejects client-supplied priceIds; resolves plan from server config |
| **Idempotent Webhooks** | Dual-layer dedup: in-memory Set + Supabase `stripe_events` table |
| **Stripe Customer Portal** | Self-service billing management via `/api/stripe/portal` |
| **QuickBooks Online** (Live) | Async fire-and-forget Sales Receipt creation (non-blocking) |
| **QBO OAuth2** | Production credentials — Client ID + Client Secret + Refresh Token |
| **Entitlement Enforcement** | Server-side plan limits: requests/mo, seats, features per tier |

### Security & Compliance

| Layer | Implementation |
|---|---|
| **Transport** | HTTPS enforced via Vercel edge, HSTS headers |
| **Authentication** | Supabase OAuth2 + JWT (HS256) in HTTP-only cookies |
| **Authorization** | Row-Level Security (RLS) on all 8 Supabase Postgres tables |
| **Rate Limiting** | 60 req/min per IP on all `/api/` routes via middleware |
| **Content Security Policy** | CSP header restricting script/style/img sources |
| **Security Headers** | X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy |
| **Payment Security** | Stripe webhook signature verification + server-side plan resolution |
| **Secrets** | Environment variables only — never hardcoded, never committed |
| **Privacy** | Privacy-first design — agent conversations not used for model training |
| **Legal Pages** | Terms of Service, Privacy Policy, Refund Policy, AI Disclaimer |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting — Region `iad1` (US East), automatic HTTPS, edge caching |
| **GitHub** | Source control — `iaintheardofu/SAAIagentmarketplace` |
| **Vercel Environment Variables** | 15+ production secrets (Stripe, Supabase, QBO, app config) |
| **CORS** | Strict origin allowlist — production domain only |

### CI/CD Pipeline

| Component | Purpose |
|---|---|
| **GitHub Actions** | `production-gate.yml` — runs on push to main and PRs |
| **TypeScript Check** | `tsc --noEmit` — catches type errors before deploy |
| **Production Build** | `next build` — validates all routes compile cleanly (24 routes) |
| **Playwright E2E** | 16 smoke tests covering all routes, APIs, and claims verification |
| **Production Gate** | All three checks must pass before deploy |

### AI/ML & Agent Orchestration

| Technology | Purpose |
|---|---|
| **LangGraph Supervisor Router** | Multi-agent orchestration with intent classification and state management |
| **LangChain @tool Decorators** | 70 tool definitions with exhaustive docstrings for deterministic routing |
| **Keyword-Based Intent Classifier** | Domain routing — Civic, Business, Military, Healthcare, Tourism |
| **ChromaDB Vector Store** | Semantic agent discovery via RAG — cosine similarity search |
| **OpenAI GPT-4o** | Primary LLM for agent reasoning (with MockLLM demo fallback) |
| **Agent Status Lifecycle** | `live`, `beta`, `demo`, `coming_soon` — UI badges and deploy gating |

### Data Layer

| Technology | Purpose |
|---|---|
| **PostgreSQL + pgvector** | Production database with vector similarity search |
| **Supabase** | Managed Postgres with real-time subscriptions and RLS |
| **8 Production Tables** | profiles, stripe_events, subscriptions, agent_catalog, deployments, agent_runs, qbo_sync_jobs, waitlist |
| **Supabase Migration** | `001_production_schema.sql` — full schema with RLS policies, indexes, triggers |
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
 │   /agents              Marketplace — 70 agent cards, filter  │
 │   /agents/[id]         Agent detail + deploy                 │
 │   /pricing             3-tier Stripe Checkout ($49/$149/$499)│
 │   /dashboard           Protected workspace — deploy/monitor  │
 │   /auth/login          Supabase OAuth2 flow                  │
 │   /terms               Terms of Service                      │
 │   /privacy             Privacy Policy                        │
 │   /refund-policy       Refund Policy                         │
 │   /ai-disclaimer       AI Disclaimer                         │
 │   /contact             Contact form                          │
 │   /status              System status page                    │
 │                                                              │
 │   /api/stripe/checkout   Server-side plan validation         │
 │   /api/stripe/webhook    Idempotent handler + async QBO sync │
 │   /api/stripe/portal     Stripe Customer Portal session      │
 │   /api/agents/chat       Agent conversation endpoint         │
 │   /api/contact           Contact form handler                │
 │   /api/newsletter        Email capture                       │
 │   /api/waitlist          Waitlist signup                     │
 │   /api/health            Health check                        │
 │                                                              │
 │   Middleware: Auth guard + Rate limit (60/min) + CSP headers │
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
 │  │           → Category Assignment (5 domains)              │  │
 │  │           → Best Agent Selection                         │  │
 │  │           → LangGraph Supervisor Router                  │  │
 │  │           → Tool Invocation + Result Aggregation         │  │
 │  └─────────────────────────┬──────────────────────────────┘  │
 │                             │                                 │
 │  ┌──────────────────────────┴─────────────────────────────┐  │
 │  │                  70 LangChain @tools                     │  │
 │  │                                                          │  │
 │  │  Civic (20)  |  Business (20)  |  Military (10)          │  │
 │  │  Healthcare (10)  |  Tourism (10)                        │  │
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
     │ + ChromaDB│     │ (Webhooks) │     │  (Async)    │
     │ + Auth    │     │ + Portal   │     │             │
     │ + RLS     │     │            │     │             │
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

### Docstring Engineering

Every `@tool` has an exhaustive, highly specific docstring. Instead of `def search()`, the system uses `def search_sa_property_maintenance_code(query: str)` with explicit instructions on when the LLM must and must not invoke the tool. This guarantees deterministic, reliable agent behavior.

---

## UX Paradigm: 3-Click Installation

The interface shifts from reactive chat boxes to proactive, trusted autonomy:

| Click | Action | What Happens |
|---|---|---|
| **1. Selection** | User browses the agent card grid, filters by category | Agent selected from the 70-card marketplace |
| **2. Authentication** | User connects via Supabase OAuth (Google/GitHub) | Secure session established with JWT tokens |
| **3. Activation** | User clicks "Deploy Workspace" | Backend provisions an isolated LangGraph runtime with injected system prompts, API keys, and taskboard |

---

## The 70 San Antonio Agents

### Category 1: Civic Services (20 agents)

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
| 11 | **SAWS Water Conservation Advisor** | Monitors SAWS drought stage restrictions and optimizes residential irrigation schedules. |
| 12 | **Neighborhood Association Liaison** | Connects residents with their registered neighborhood association and tracks community initiatives. |
| 13 | **Bexar County Property Tax Advisor** | Analyzes property tax assessments, identifies protest opportunities, and guides filing with BCAD. |
| 14 | **SA Library Resource Navigator** | Searches SA Public Library catalog, programs, and digital resources with personalized recommendations. |
| 15 | **Parks & Recreation Booking Agent** | Reserves pavilions, sports fields, and community center rooms across SA Parks system. |
| 16 | **Storm Water & Flood Alert Agent** | Real-time monitoring of SA River Authority flood gauges with evacuation route guidance. |
| 17 | **Code Compliance Fast-Track Agent** | Expedites code compliance resolution with automated documentation and scheduling. |
| 18 | **Senior Services Navigator** | Connects seniors with Meals on Wheels, transportation assistance, and community programs. |
| 19 | **SA Metro Health Inspector** | Queries Metro Health restaurant inspection scores and food safety compliance records. |
| 20 | **Voter Registration & Election Guide** | Bexar County voter registration status, polling locations, and sample ballot preview. |

### Category 2: Small Business & Economic Development (20 agents)

| # | Agent | Description |
|---|---|---|
| 21 | **SBEDA Procurement Matchmaker** | Matches minority/women-owned businesses with municipal RFPs and drafts bid templates. |
| 22 | **RevitalizeSA Grant Writer** | Conducts interviews and drafts grant narratives for Corridor Leadership and construction mitigation programs. |
| 23 | **BuildSA Permit Navigator** | Analyzes blueprints and zoning maps to determine exact DSD commercial permit requirements. |
| 24 | **Historic Preservation Rehab Assistant** | Cross-references OHP database for materials compliance and calculates tax incentives. |
| 25 | **VITA Tax Prep Assistant** | Formats profit/loss data for the Volunteer Income Tax Assistance program. |
| 26 | **Commercial Real Estate Analyzer** | Pinpoints optimal retail locations via Bexar Appraisal District records and foot traffic analysis. |
| 27 | **Local B2B Lead Generation Swarm** | Multi-agent router scraping SA business directories with firmographic enrichment. |
| 28 | **Food Truck Compliance Agent** | Guides through Metro Health regulations, FireSafeSA inspections, and parking zone requirements. |
| 29 | **Disaster Recovery Locator** | Monitors GOBSA for emergency funding and low-interest CDFI loans post-severe weather. |
| 30 | **Social Commerce Catalog Generator** | Connects inventory to Instagram/TikTok storefronts with localized SEO descriptions. |
| 31 | **Business License Pro** | End-to-end guidance for SA business license applications, renewals, and compliance requirements. |
| 32 | **Startup Funding Navigator** | Matches early-stage SA startups with angel investors, accelerators, and grant programs. |
| 33 | **Commercial Lease Analyzer** | Reviews commercial lease terms, identifies unfavorable clauses, and benchmarks against SA market rates. |
| 34 | **SA Workforce Recruiter** | Connects businesses with qualified local candidates through Workforce Solutions Alamo pipeline. |
| 35 | **Marketing Campaign Builder** | Creates localized digital marketing campaigns targeting SA demographics and neighborhoods. |
| 36 | **Supply Chain Optimizer** | Identifies local suppliers and optimizes procurement routes for SA-area businesses. |
| 37 | **Franchise Feasibility Analyzer** | Evaluates franchise opportunities against SA market data, demographics, and competition. |
| 38 | **Contractor License Verifier** | Validates contractor licenses, insurance, and bond status for SA commercial projects. |
| 39 | **Business Insurance Advisor** | Compares commercial insurance options and identifies coverage gaps for SA businesses. |
| 40 | **Export Compliance Navigator** | Guides SA manufacturers through export regulations, tariffs, and trade compliance. |

### Category 3: Military Transition & JBSA (10 agents)

| # | Agent | Description |
|---|---|---|
| 41 | **Resume Translator** | Maps NCOER/FITREP military jargon to civilian competencies using semantic dictionaries. |
| 42 | **VA Claim Nexus Crafter** | Drafts medically sound Nexus letters from military medical records and service histories. |
| 43 | **Workforce Solutions Alamo Matcher** | Identifies upskilling programs from the "$49.5M SA: Ready to Work" database. |
| 44 | **Military Spouse Federal Resume Builder** | Tuned to USAJOBS format for GS-scale competitive federal resumes. |
| 45 | **TRICARE to Civilian Healthcare Navigator** | Compares TRICARE Prime/Select against civilian plans with out-of-pocket projections. |
| 46 | **Security Clearance Job Matcher** | Matches TS-SCI/Secret cleared candidates to defense contractor vacancies (Boeing, Lockheed). |
| 47 | **MIC3 Dependent Waiver Automator** | Generates Interstate Compact waivers for military dependent school transfers. |
| 48 | **SkillBridge Application Writer** | Drafts command approval memos and identifies local SA SkillBridge corporate sponsors. |
| 49 | **GI Bill Optimizer** | Calculates optimal stacking of Hazelwood Act + Post-9/11 GI Bill for UTSA and Alamo Colleges. |
| 50 | **Supply Chain Simulator** | Helps logistics officers apply military predictive maintenance to civilian distribution. |

### Category 4: Healthcare Administration (10 agents)

| # | Agent | Description |
|---|---|---|
| 51 | **Ambient Clinical Note Formatter** | Formats audio transcripts into structured SOAP notes for EHR systems. |
| 52 | **Insurance Referral Processor** | Verifies payer eligibility and updates scheduling software from faxed/digital referrals. |
| 53 | **Medical Coding Validator** | Suggests highest-specificity ICD-10 and CPT codes to reduce claim denials. |
| 54 | **Patient Triage Chatbot** | Pre-appointment SMS gathering medical histories and flagging urgent symptoms. |
| 55 | **Clinical Trial Matchmaker** | Cross-references UT Health research with anonymized patient populations. |
| 56 | **HIPAA Data Synthesizer** | Anonymizes and scrubs PHI for secondary AI training datasets. |
| 57 | **Hospital Bed Predictor** | Forecasts ICU/acute bed availability using admission rates and seasonal data. |
| 58 | **Diabetes Management Tracker** | Identifies high-risk Medicare beneficiaries using SA CHNA metrics. |
| 59 | **Telehealth Router (WHIM)** | Redirects non-emergent rural inquiries to telehealth services. |
| 60 | **Nursing Staff Scheduler** | Generates optimized shift schedules based on predicted patient census. |

### Category 5: Tourism & Hospitality (10 agents)

| # | Agent | Description |
|---|---|---|
| 61 | **Virtual Hotel Concierge** | Omnichannel agent handling routine guest inquiries (checkout, pool hours, dining). |
| 62 | **Dynamic Pricing Optimizer** | Adjusts hotel rates in real-time based on events, competition, and weather. |
| 63 | **Convention Center Orchestrator** | Floor plans, AV scheduling, and vendor logistics for the Henry B. Gonzalez Center. |
| 64 | **Flight Delay Automator** | Monitors SA International Airport for delays and auto-rebooks travel. |
| 65 | **Multilingual Gastronomy Guide** | UNESCO Creative City dining itineraries for international tourists. |
| 66 | **Predictive Maintenance** | IoT sensor analysis for preemptive hotel room maintenance dispatch. |
| 67 | **Fiesta Event Navigator** | Downtown street closure routing, parking, and parade routes during Fiesta. |
| 68 | **Mission Audio Tour Generator** | GPS-triggered RAG tours of the Alamo and SA Missions. |
| 69 | **VIP Upsell Engine** | Personalized pre-arrival emails with room upgrades and spa packages. |
| 70 | **Restaurant Health Inspector** | Metropolitan Health District database queries for cleanliness scores. |

---

## Subscription Tiers

| Tier | Monthly | Annual | Features |
|---|---|---|---|
| **Starter** | $49/mo | $39/mo (billed annually) | All 70 agents, 1,000 requests/mo, real-time SA data, browser access, email support |
| **Growth** | $149/mo | $119/mo (billed annually) | All 70 agents, 10,000 requests/mo, team seats (5 users), priority support, analytics dashboard, custom agent config |
| **Partner** | $499/mo | $399/mo (billed annually) | Unlimited seats + requests, dedicated account manager, SSO/SAML, custom integrations, SLA, on-prem deployment, compliance reporting |

All plans include end-to-end encryption, 24/7 availability, and privacy-first design. Agent conversations are not used for model training. Annual billing saves ~20%.

**Entitlement Enforcement:** Plan limits are enforced server-side via `src/lib/entitlements.ts`. The checkout flow uses server-side plan validation — client sends plan name, server resolves the Stripe Price ID.

---

## Stripe to QuickBooks Revenue Pipeline

Every paid subscription triggers an automated revenue recognition flow:

```
User subscribes → Stripe Checkout Session
                       │ (server-side plan validation)
                  invoice.paid webhook
                       │ (idempotency check)
              ┌────────┴─────────┐
              │ Dual-Layer Dedup │
              │ Memory + DB      │
              └────────┬─────────┘
                       │
              ┌────────┴─────────┐
              │ recordStripePayment() │
              │ (async, non-blocking) │
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
- `invoice.paid` — Async QBO Sales Receipt creation with customer email, plan name, Stripe invoice ID
- `customer.subscription.deleted` — Downgrade to starter plan
- `customer.subscription.updated` — Plan change sync (maps priceId to plan name)

**Idempotency:** Every webhook event is checked against an in-memory Set and the Supabase `stripe_events` table. Duplicate events are silently dropped.

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
│   │   ├── agents/                # Agent marketplace (browse/filter 70 agents)
│   │   │   └── [id]/page.tsx      # Agent detail page with status badges
│   │   ├── auth/                  # Auth routes (login, signup, OAuth callback)
│   │   ├── dashboard/             # Protected user dashboard (deploy/monitor/billing)
│   │   ├── pricing/               # 3-tier pricing with server-side checkout flow
│   │   ├── terms/                 # Terms of Service
│   │   ├── privacy/               # Privacy Policy
│   │   ├── refund-policy/         # Refund Policy
│   │   ├── ai-disclaimer/         # AI Disclaimer (7 sections)
│   │   ├── contact/               # Contact form with subject dropdown
│   │   ├── status/                # System status page (checks /api/health)
│   │   └── api/
│   │       ├── agents/chat/       #   Agent conversation endpoint
│   │       ├── contact/           #   Contact form handler with validation
│   │       ├── health/            #   Health check endpoint
│   │       ├── newsletter/        #   Newsletter signup
│   │       ├── waitlist/          #   Waitlist capture
│   │       └── stripe/
│   │           ├── checkout/      #   Server-side plan validation + Checkout Session
│   │           ├── webhook/       #   Idempotent handler + async QBO sync
│   │           └── portal/        #   Stripe Customer Portal session
│   │
│   ├── components/
│   │   ├── agents/                # Agent card grid (with status badges), filters, detail views
│   │   ├── home/                  # Hero, features, testimonials, CTA
│   │   ├── layout/                # Navbar, footer (with legal links), page shells
│   │   └── ui/                    # Button, Input, Card, Badge primitives
│   │
│   ├── lib/
│   │   ├── agents-data.ts         # 70 agent definitions with status lifecycle
│   │   ├── stripe.ts              # Stripe singleton + plan config ($49/$149/$499)
│   │   ├── quickbooks.ts          # QBO OAuth2 token management + Sales Receipt creation
│   │   ├── entitlements.ts        # Server-side plan limits (requests, seats, features)
│   │   ├── store.ts               # Zustand global state
│   │   ├── types.ts               # Core TypeScript interfaces (Agent, AgentStatus, etc.)
│   │   └── supabase/              # Supabase client (browser + server)
│   │
│   └── middleware.ts              # Auth guard + rate limiting (60/min) + CSP headers
│
├── supabase/
│   └── migrations/
│       └── 001_production_schema.sql  # 8 tables + RLS + indexes + triggers
│
├── tests/
│   └── e2e/
│       └── smoke.spec.ts          # 16 Playwright smoke tests
│
├── .github/
│   └── workflows/
│       └── production-gate.yml    # CI: typecheck + build + Playwright
│
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── engine.py          # Agent execution engine + intent classifier
│   │   │   ├── tools.py           # 70 LangChain @tool definitions (5 categories)
│   │   │   └── seed.py            # Database seeder (70 agent catalog)
│   │   ├── routers/
│   │   │   ├── agents.py          # GET /agents, GET /agents/{slug}
│   │   │   ├── auth.py            # POST /auth/login, POST /auth/logout
│   │   │   ├── billing.py         # Stripe webhooks + subscription CRUD
│   │   │   └── leads.py           # POST /leads/score, POST /leads/enrich
│   │   ├── etl/                   # ETL pipelines for municipal/workforce data
│   │   ├── models.py              # SQLAlchemy table definitions
│   │   ├── database.py            # Session factory and initialization
│   │   └── main.py                # FastAPI entry point with CORS
│   └── requirements.txt           # Python dependencies
│
├── playwright.config.ts           # Playwright test configuration
├── next.config.js                 # Security headers + poweredByHeader: false
├── package.json                   # Scripts: dev, build, typecheck, test:e2e, production-gate
├── tailwind.config.ts             # Custom tokens: navy, brand, tactical, surface, midnight
├── tsconfig.json                  # TypeScript strict mode (excludes playwright/tests)
├── vercel.json                    # Vercel deployment + security headers
└── README.md
```

---

## API Reference

### Next.js API Routes (Frontend)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/stripe/checkout` | Server-side plan validation + Stripe Checkout Session creation |
| POST | `/api/stripe/webhook` | Idempotent Stripe event handler + async QBO sync |
| POST | `/api/stripe/portal` | Create Stripe Customer Portal session for billing management |
| POST | `/api/agents/chat` | Agent conversation endpoint (blocks `coming_soon` agents) |
| POST | `/api/contact` | Contact form handler with validation |
| GET | `/api/health` | Health check endpoint |
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

### Supabase Postgres (Production)

| Table | Key Fields | Purpose |
|---|---|---|
| **profiles** | id (UUID), email, full_name, avatar_url, stripe_customer_id, plan | User accounts + subscription tier (auto-created on signup) |
| **stripe_events** | event_id (unique), event_type, processed_at | Webhook idempotency — prevents duplicate event processing |
| **subscriptions** | user_id (FK), stripe_subscription_id, plan, status, period dates | Billing state and access control |
| **agent_catalog** | slug (unique), name, category, status, capabilities (JSONB) | 70-agent registry with lifecycle status |
| **deployments** | user_id (FK), agent_slug (FK), config (JSONB), status | Active agent instances per user |
| **agent_runs** | deployment_id (FK), input, output, tokens_used, latency_ms | Conversation logs and usage tracking |
| **qbo_sync_jobs** | stripe_event_id, status, error, synced_at | QuickBooks sync audit trail |
| **waitlist** | email (unique), source, referral_code | Pre-launch and feature waitlist |

**Row-Level Security:** All 8 tables have RLS policies. Users can only read/write their own data. Service role bypasses for admin operations.

**Auto-Profile Trigger:** `handle_new_user()` function automatically creates a profile row when a new user signs up via Supabase Auth.

---

## Security Architecture

| Layer | Implementation |
|---|---|
| **Transport** | HTTPS enforced via Vercel edge, HSTS headers (`max-age=63072000`) |
| **Authentication** | Supabase OAuth2 (Google, GitHub, Magic Link) + JWT in HTTP-only cookies |
| **Authorization** | Row-Level Security (RLS) on all 8 Supabase Postgres tables |
| **Rate Limiting** | 60 req/min per IP on all `/api/` routes, periodic cleanup of expired windows |
| **CSP** | Content Security Policy restricting script-src, style-src, img-src, connect-src |
| **Security Headers** | X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy: camera=(), microphone=(), geolocation=() |
| **Payment Security** | Stripe webhook signature verification + server-side plan resolution (rejects client-supplied priceIds) |
| **Entitlements** | Server-side plan limit enforcement — requests/mo, seats, features per tier |
| **Agent Gating** | `coming_soon` and `demo` agents blocked from deploy and chat at API level |
| **Secrets** | Environment variables only — never hardcoded, never committed |
| **Privacy** | Privacy-first design — agent conversations not used for model training, minimal data retention |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase project (authentication + database)
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
STRIPE_STARTER_ANNUAL_PRICE_ID=price_...
STRIPE_GROWTH_MONTHLY_PRICE_ID=price_...
STRIPE_GROWTH_ANNUAL_PRICE_ID=price_...
STRIPE_PARTNER_MONTHLY_PRICE_ID=price_...
STRIPE_PARTNER_ANNUAL_PRICE_ID=price_...

# QuickBooks Online (Live)
QBO_CLIENT_ID=your_client_id
QBO_CLIENT_SECRET=your_client_secret
QBO_REFRESH_TOKEN=your_refresh_token
QBO_REALM_ID=your_realm_id

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://sanantonioaiagents.com
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

### Database Migration

```bash
# Apply the production schema to your Supabase project
# via Supabase Dashboard > SQL Editor, or:
supabase db push
```

### Run Tests

```bash
npm run typecheck        # TypeScript type checking
npm run build            # Production build (24 routes)
npm run test:e2e         # Playwright smoke tests (16 tests)
npm run production-gate  # All three checks in sequence
```

---

## Deployment

### Vercel (Frontend)

Deployed to Vercel with `vercel.json`:

- **Region:** `iad1` (US East)
- **Framework:** Next.js 14
- **Dev port:** 3200
- **Security headers** on all routes (via next.config.js + middleware):
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=63072000`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **poweredByHeader:** disabled

Set all environment variables in Vercel project settings before deploying.

### CI/CD

GitHub Actions (`production-gate.yml`) runs on every push to `main` and on PRs:

1. **TypeScript Check** — `tsc --noEmit`
2. **Production Build** — `next build` (validates 24 routes)
3. **E2E Tests** — Playwright smoke tests (16 tests covering routes, APIs, claims)

All three gates must pass before deployment proceeds.

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

### Agent Status Badges

| Status | Badge | Can Deploy |
|---|---|---|
| `live` | (none) | Yes |
| `beta` | Purple "Beta" badge | Yes |
| `demo` | Amber "Demo" badge | No |
| `coming_soon` | Gray "Coming Soon" badge | No |

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
