# San Antonio AI Agent Marketplace

**By [The AI Cowboys](https://www.theaicowboys.com)** — Texas Trusted Experts in Mission-Critical AI

**Live:** [sanantonioaiagents.com](https://sanantonioaiagents.com) | **Parent:** [theaicowboys.com](https://www.theaicowboys.com)

A production-grade AI Agent Marketplace serving the City of San Antonio with 70 specialized autonomous agents across six strategic domains: Civic Services, Small Business & Economic Development, Military Transition (JBSA), Healthcare Administration, Tourism & Hospitality, and Connect-360 SmartSA interoperability. Powered by LangChain/LangGraph multi-agent orchestration, Stripe subscription billing with idempotent webhooks and async QuickBooks revenue sync, Supabase authentication with Row-Level Security, server-side entitlement enforcement, rate limiting, CI/CD pipeline, and a 3-click deployment paradigm.

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
| **LangChain @tool Decorators** | 70 tool definitions across 6 categories with exhaustive docstrings for deterministic routing |
| **Keyword-Based Intent Classifier** | Domain routing — Civic, Business, Military, Healthcare, Tourism, Connect-360 |
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
 │  │           → Category Assignment (6 domains)              │  │
 │  │           → Best Agent Selection                         │  │
 │  │           → LangGraph Supervisor Router                  │  │
 │  │           → Tool Invocation + Result Aggregation         │  │
 │  └─────────────────────────┬──────────────────────────────┘  │
 │                             │                                 │
 │  ┌──────────────────────────┴─────────────────────────────┐  │
 │  │                  70 LangChain @tools                     │  │
 │  │                                                          │  │
 │  │  Civic (10) | Business (20) | Military (10)              │  │
 │  │  Healthcare (10) | Tourism (10) | Connect-360 (10)      │  │
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

### Category 1: Civic Services (10 agents)

| # | Agent | Description |
|---|---|---|
| 1 | **SA Permit Navigator** | Automates City of San Antonio permit applications, status tracking, and compliance checks. |
| 2 | **SA 311 Dispatcher** | Triages and routes 311 service requests to the correct city department with auto-ticket generation. |
| 3 | **Bexar Voter Guide** | Nonpartisan election assistant providing ballot info, polling locations, and candidate summaries. |
| 4 | **SA Utilities Concierge** | CPS Energy & SAWS billing analysis, outage alerts, and conservation program enrollment. |
| 5 | **VIA Transit Planner** | Real-time VIA Metropolitan Transit route planning with accessibility-aware scheduling. |
| 6 | **SA Parks & Events** | Discover and book San Antonio parks, pavilions, and city-sponsored events. |
| 7 | **Code Compliance Advisor** | Automated code violation detection and remediation guidance for property owners. |
| 8 | **SA Library Research AI** | San Antonio Public Library catalog search, holds management, and research assistance. |
| 9 | **City Budget Transparency** | Natural language queries against the City of San Antonio annual budget and expenditure data. |
| 10 | **SA Housing Navigator** | Affordable housing program matching, application assistance, and waitlist tracking. |

### Category 2: Small Business & Economic Development (20 agents)

| # | Agent | Description |
|---|---|---|
| 11 | **SA Business License Pro** | End-to-end business licensing, state registration, and ongoing compliance monitoring. |
| 12 | **SA Market Intelligence** | Competitive intelligence and market analysis for San Antonio metro area businesses. |
| 13 | **TX HR Compliance Guard** | Texas labor law compliance monitoring, employee handbook generation, and HR policy automation. |
| 14 | **SA Grant & Incentive Finder** | Matches SA businesses with federal, state, and city grants, tax incentives, and SAEDF programs. |
| 15 | **Smart Inventory AI** | Demand forecasting and inventory optimization for San Antonio retail and wholesale businesses. |
| 16 | **SA Social Media Manager** | AI content generation, scheduling, and analytics tuned to San Antonio culture and audiences. |
| 17 | **Customer Intelligence Suite** | CRM enrichment, churn prediction, and NPS analysis for San Antonio service businesses. |
| 18 | **TX Business Legal Assist** | Contract review, NDA drafting, and Texas commercial law guidance. |
| 19 | **TX Sales Tax Agent** | Texas sales & use tax calculation, filing preparation, and audit defense documentation. |
| 20 | **SA Real Estate Intelligence** | Commercial and residential property analysis, valuation, and investment underwriting for Bexar County. |
| 21 | **Food Truck Compliance** | Mobile food vendor permitting, health inspections, and zoning compliance for SA food trucks. |
| 22 | **SBEDA Matchmaker** | Matches small businesses with City of San Antonio SBEDA contracting and certification programs. |
| 23 | **Franchise Advisor** | Franchise opportunity analysis, FDD review, and market feasibility for SA metro franchise buyers. |
| 24 | **Contractor Verifier** | General contractor license verification, bond validation, and compliance checks for Bexar County. |
| 25 | **Export Compliance** | International trade compliance, export licensing, and customs documentation for SA exporters. |
| 26 | **Startup Funding** | Venture capital, angel investor, and accelerator matching for San Antonio startups. |
| 27 | **Commercial Lease Analyzer** | Commercial lease term analysis, market rate comparison, and negotiation guidance for SA tenants. |
| 28 | **Workforce Recruiter** | Local talent sourcing, job posting optimization, and candidate screening for SA employers. |
| 29 | **Business Insurance Advisor** | Commercial insurance comparison, coverage analysis, and claims guidance for SA businesses. |
| 30 | **Marketing Campaign Builder** | Local marketing campaign creation, audience targeting, and ROI analysis for SA businesses. |

### Category 3: Military Transition & JBSA (10 agents)

| # | Agent | Description |
|---|---|---|
| 31 | **JBSA Benefits Navigator** | DoD benefits counseling, BAH/BAS calculations, and TRICARE enrollment for JBSA personnel. |
| 32 | **SA Veteran Transition Coach** | Career transition coaching, resume translation, and civilian job matching for SA veterans. |
| 33 | **JBSA Housing Agent** | On-post and off-post housing search, BAH-optimized filtering, and PCS move coordination. |
| 34 | **GI Bill Education Advisor** | GI Bill benefit optimization, school comparison, and enrollment guidance for SA-area veterans. |
| 35 | **JBSA Appointment Scheduler** | Medical, dental, and admin appointment scheduling across JBSA facilities. |
| 36 | **SA Veteran Mental Health Navigator** | Connects veterans with SA-area mental health resources, crisis lines, and peer support. |
| 37 | **Veteran Business Loans Agent** | SBA veteran loan programs, SBIR/STTR guidance, and small business formation for SA-area vets. |
| 38 | **Clearance Status Tracker** | SF-86 preparation assistance, investigation status tracking, and adjudication guidance. |
| 39 | **Military Spouse Career Agent** | Remote-first job matching, license portability guidance, and entrepreneur resources. |
| 40 | **VA Claims Accelerator** | VA disability claim preparation, nexus letter guidance, and DBQ coordination for SA veterans. |

### Category 4: Healthcare Administration (10 agents)

| # | Agent | Description |
|---|---|---|
| 41 | **SA Care Navigator** | Insurance-aware provider search, appointment booking, and care coordination for SA patients. |
| 42 | **SA Rx Optimizer** | Prescription cost comparison, GoodRx integration, and patient assistance program matching. |
| 43 | **SA Mental Health Connector** | Therapist and psychiatrist matching with sliding-scale and Medicaid-accepting providers. |
| 44 | **Chronic Care Manager** | Diabetes, hypertension, and heart disease management with specialist coordination. |
| 45 | **Health Insurance Navigator** | ACA marketplace, CHIP, and Medicaid enrollment guidance for uninsured Bexar County residents. |
| 46 | **SA Senior Care Advisor** | Medicare counseling, assisted living search, and caregiver resource coordination. |
| 47 | **SA Dental Access Agent** | Medicaid and low-cost dental care finder with emergency dental triage. |
| 48 | **SA Maternal Health Guide** | Prenatal care coordination, WIC enrollment, and postpartum support navigation. |
| 49 | **SA Clinical Trial Matcher** | Matches SA patients to active clinical trials at UT Health SA and Methodist Research. |
| 50 | **Medical Bill Negotiator** | Audits hospital bills for errors, identifies charity care eligibility, and negotiates balances. |

### Category 5: Tourism & Hospitality (10 agents)

| # | Agent | Description |
|---|---|---|
| 51 | **Riverwalk Concierge** | Personalized restaurant, entertainment, and attraction recommendations along the River Walk. |
| 52 | **Alamo & Missions Guide** | Interactive AI guide to the Alamo and all five World Heritage missions. |
| 53 | **SA Hotel Price Optimizer** | Real-time hotel price tracking and booking optimization across SA properties. |
| 54 | **Fiesta & Events Planner** | Complete planning guide for Fiesta San Antonio, rodeo, and year-round cultural events. |
| 55 | **SA Foodie Intelligence** | Curated food tour planning with Tex-Mex, BBQ, and James Beard restaurant discovery. |
| 56 | **SA Sports & Entertainment** | Spurs, San Antonio FC, Missions baseball — tickets, parking, and game-day planning. |
| 57 | **SA Arts & Culture Explorer** | McNay Art Museum, Witte Museum, and SA cultural district discovery with exhibit scheduling. |
| 58 | **TX Hill Country Day Trips** | Curated day trip itineraries to Fredericksburg, Wimberley, New Braunfels, and Bandera. |
| 59 | **Convention Center Planner** | Henry B. Gonzalez Convention Center event planning, vendor coordination, and logistics. |
| 60 | **SA Family Adventure Planner** | SeaWorld, Six Flags, Natural Bridge Caverns — family itinerary planning with crowd forecasting. |

### Category 6: Connect-360 SmartSA (10 agents)

| # | Agent | Description |
|---|---|---|
| 61 | **Newcomer Onboarding** | One-stop relocation concierge for newcomers moving to San Antonio — utilities, schools, neighborhoods. |
| 62 | **SAWS Water Advisor** | SAWS water usage analysis, drought stage alerts, conservation rebates, and billing assistance. |
| 63 | **Unified Utility Coordinator** | Coordinate CPS Energy + SAWS + internet setup for new residents — one agent, all utilities. |
| 64 | **SA K-12 School Finder** | Compare SA ISD, Northside ISD, North East ISD, and charter schools by address and ratings. |
| 65 | **SA Neighborhood Scout** | Neighborhood comparison — housing costs, walkability, crime stats, school ratings, commute times. |
| 66 | **Opportunity Home Navigator** | Section 8, affordable housing waitlists, and Opportunity Home SA program navigation. |
| 67 | **Edwards Aquifer Monitor** | Real-time Edwards Aquifer level tracking, drought stage alerts, and water conservation rebates. |
| 68 | **SA River Authority Agent** | San Antonio River Authority flood alerts, creek monitoring, and floodplain lookup. |
| 69 | **Bexar Property Tax Advisor** | Bexar County property tax estimation, homestead exemption filing, and BCAD protest assistance. |
| 70 | **SA Voter Registration Agent** | Voter registration status check, polling location finder, sample ballot preview, and reminders. |

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
│   │   │   ├── tools.py           # 70 LangChain @tool definitions (6 categories)
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
| Connect-360 | Navy | Integration, interop |

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
