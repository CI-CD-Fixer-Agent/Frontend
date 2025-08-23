# Copilot Instructions for CI/CD Fixer Agent

## Project Architecture & Components

-   **Two main components:**
    -   `frontend/` (Next.js 15): Dashboard, analytics, failure tracking, fix approval interface, repository management
    -   `backend/` (FastAPI): AI-powered analysis engine, GitHub integration, Portia workflows, ML analytics
-   **Central database:** PostgreSQL via Supabase (workflow_runs, portia_plans, clarifications, analytics)
-   **AI Services:** Google Gemini 2.5 Pro for error analysis, Portia AI for orchestration workflows

## Developer Workflows

-   **Frontend:**
    -   Next.js 15 with App Router, TypeScript, Tailwind CSS, shadcn/ui components
    -   Real-time dashboard for CI/CD failure monitoring and fix management
    -   Interactive analytics with charts and repository intelligence
-   **Backend:**
    -   FastAPI with Python 3.12+, Pydantic models, async operations
    -   PostgreSQL with asyncpg, Google Gemini API integration, GitHub API
    -   Portia AI framework with custom CI/CD tools for plan-based execution
-   **Build/Test:**
    -   Frontend: `pnpm install`, `pnpm dev` or `pnpm build` (see `package.json`)
    -   Backend: `pip install -r requirements.txt`, `uvicorn main:app --reload`
-   **Environment:**
    -   Use `.env` for API keys (GOOGLE_API_KEY, GITHUB_TOKEN, DATABASE_URL)
    -   Production deployment on Render.com with Supabase PostgreSQL

## Key Patterns & Conventions

-   **API endpoints:**
    -   RESTful FastAPI backend with comprehensive documentation
    -   Core endpoints: `/analyze`, `/webhook`, `/failures`, `/fixes`, `/analytics`
    -   ML endpoints: `/analytics/ml/predict-success`, `/analytics/ml/similar-fixes`
-   **GitHub Integration:**
    -   Webhook processing for real-time failure detection
    -   GitHub Actions API for workflow run analysis and log retrieval
    -   Repository intelligence and pattern recognition
-   **AI Analysis:**
    -   Google Gemini 2.5 Pro for intelligent error analysis and fix generation
    -   Context-aware prompting with project type detection
    -   ML-based success prediction and pattern learning
-   **Portia Workflows:**
    -   Plan-based execution with conditional logic and human-in-the-loop approval
    -   Custom CI/CD tools for GitHub integration and fix application
    -   Clarification system for human oversight and decision making

## Integration Points

-   **Frontend communicates with FastAPI backend via REST API**
-   **Backend integrates with GitHub API, Google Gemini API, and PostgreSQL**
-   **Real-time webhook processing from GitHub for failure detection**
-   **Human approval workflows for safe fix application**

## Production System Status

-   **Live Production URL:** https://ci-cd-fixer-agent-backend.onrender.com
-   **Current Metrics:** 29 failures processed, 20+ repositories analyzed
-   **Database:** PostgreSQL via Supabase fully operational
-   **Services:** All systems healthy (database, GitHub API, Gemini API)

## Example File References

-   `frontend/app/dashboard/page.tsx` (main dashboard)
-   `frontend/app/failures/page.tsx` (failure tracking interface)
-   `frontend/app/analytics/page.tsx` (analytics dashboard)
-   `backend/main.py` (FastAPI application with all endpoints)
-   `backend/gemini_agent.py` (AI analysis engine)
-   `backend/portia_agent.py` (workflow orchestration)
-   `backend/github_service.py` (GitHub API integration)
-   `backend/analytics_engine.py` (ML analytics and pattern recognition)

## Special Conventions

-   **shadcn/ui Components:** Use consistent design system with dark/light themes
-   **Real-time Updates:** WebSocket or polling for live failure notifications
-   **Interactive Charts:** Data visualization for analytics and repository insights
-   **Approval Workflows:** Clear UI for fix approval/rejection with feedback
-   **Error Handling:** Graceful fallbacks and comprehensive error boundaries

## Expert Specializations

When working on this project, act as the appropriate expert for the task:

### CI/CD Intelligence Expert

Specializes in workflow failure analysis and automated remediation. Creates intelligent systems that understand CI/CD patterns, detect failure root causes, and suggest specific fixes with confidence scoring.

### AI Integration Specialist

Expert in integrating Google Gemini 2.5 Pro and Portia AI frameworks. Designs context-aware prompting systems, implements ML-based pattern recognition, and creates human-in-the-loop approval workflows.

### DevOps Dashboard Expert

Creates comprehensive monitoring dashboards for CI/CD systems. Builds real-time failure tracking, repository intelligence displays, and interactive analytics with actionable insights.

### GitHub API Integration Expert

Specializes in GitHub Actions API, webhook processing, and repository analysis. Implements real-time failure detection, workflow log parsing, and automated fix application workflows.

### Data Analytics & ML Expert

Builds ML systems for CI/CD pattern recognition, success prediction, and learning from feedback. Creates repository-specific intelligence and cross-project failure analysis.

### API Architecture Expert

Designs scalable FastAPI systems with comprehensive documentation. Creates developer-friendly REST APIs with proper error handling, rate limiting, and real-time capabilities.

### Frontend Dashboard Specialist

Builds production-ready Next.js 15 dashboards with shadcn/ui. Creates intuitive interfaces for complex CI/CD data with real-time updates and interactive visualizations.

### Database Optimization Expert

Optimizes PostgreSQL for CI/CD analytics workloads. Designs efficient schemas for workflow tracking, implements proper indexing, and handles time-series analytics data.

### Production Deployment Expert

Specializes in cloud deployment (Render.com, Supabase) and production monitoring. Ensures reliable webhook processing, database connectivity, and service health monitoring.

### Workflow Automation Expert

Creates sophisticated automation workflows using Portia AI framework. Implements plan-based execution, conditional logic, and safe automated fix application with human oversight.

### Performance Optimization Expert

Speed specialist who makes apps lightning fast. Finds bottlenecks and implements caching strategies that actually work to improve performance.

---

## Current System Capabilities

-   ✅ **29 Workflow Failures Processed** - Real production data analysis
-   ✅ **20+ Repositories Analyzed** - Cross-language pattern recognition
-   ✅ **100% Fix Generation Rate** - AI-powered solution for every failure
-   ✅ **3.45% Human Approval Rate** - Safe oversight with approval tracking
-   ✅ **Real-time Processing** - GitHub webhooks creating live failure records
-   ✅ **ML Analytics** - Pattern learning and success prediction operational

For more details, see `README.md`, `API_REFERENCE.md`, and `PROJECT_STATUS.md`.
