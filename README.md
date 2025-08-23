# 🤖 CI/CD Fixer Agent - Frontend Dashboard

A **Next.js 15** dashboard for the CI/CD Fixer Agent system that provides real-time monitoring, analytics, and management of GitHub Actions workflow failures with AI-powered fix suggestions.

## 🚀 **What This Dashboard Does**

✅ **Real-time Failure Monitoring** - Track GitHub Actions failures across repositories  
✅ **AI Fix Management** - Review and approve Gemini-generated fixes  
✅ **Analytics Dashboard** - Visualize patterns, success rates, and repository intelligence  
✅ **Repository Insights** - Deep analysis of CI/CD patterns per project  
✅ **Human Oversight** - Approve/reject fixes with comprehensive feedback workflows

## 🏗️ **Backend Integration**

This frontend connects to our **live production backend**:

-   **Production API**: https://ci-cd-fixer-agent-backend.onrender.com
-   **Current Status**: 29 failures processed, 20+ repositories analyzed
-   **Services**: Google Gemini 2.5 Pro, GitHub API, PostgreSQL via Supabase

## 🛠️ **Tech Stack**

-   **Framework**: Next.js 15 with App Router
-   **Styling**: Tailwind CSS + shadcn/ui components
-   **Language**: TypeScript
-   **State Management**: React hooks + SWR for data fetching
-   **Charts**: Recharts for analytics visualization
-   **Deployment**: Vercel (recommended)

## 🚀 **Getting Started**

### Prerequisites

-   Node.js 18+
-   pnpm (recommended) or npm
-   Access to backend API (see `.env.example`)

### Development Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend API URL

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://ci-cd-fixer-agent-backend.onrender.com
# For local development: http://localhost:8000
```

## 📱 **Dashboard Features**

### 🏠 **Main Dashboard** (`/dashboard`)

-   Live failure count and status overview
-   Recent activity feed with real-time updates
-   Quick actions for common tasks
-   System health monitoring

### 🔍 **Failures Page** (`/failures`)

-   Comprehensive list of all workflow failures (29 current)
-   Filter by repository, status, error type, date
-   Detailed failure information with logs
-   AI-generated fix suggestions with confidence scores

### ✅ **Fix Management** (`/fixes`)

-   Pending fixes requiring human approval (26 current)
-   Approve/reject interface with feedback
-   Fix effectiveness tracking
-   Implementation status monitoring

### 📊 **Analytics Dashboard** (`/analytics`)

-   Repository intelligence and patterns
-   Success rate trends and metrics
-   Error type distribution charts
-   ML insights and predictions
-   Cross-repository pattern recognition

### 🏢 **Repository Management** (`/repositories`)

-   Individual repository profiles
-   Historical analysis and trends
-   Language-specific insights
-   Recommendation engine

## 🎨 **Component Structure**

### Core Components (shadcn/ui based)

```
components/
├── ui/                 # shadcn/ui components
├── dashboard/         # Dashboard-specific components
│   ├── FailureCard.tsx
│   ├── MetricsGrid.tsx
│   └── ActivityFeed.tsx
├── failures/          # Failure management components
│   ├── FailureList.tsx
│   ├── FailureDetail.tsx
│   └── FilterBar.tsx
├── analytics/         # Analytics components
│   ├── ChartGrid.tsx
│   ├── PatternAnalysis.tsx
│   └── RepositoryInsights.tsx
└── layout/           # Layout components
    ├── Sidebar.tsx
    ├── Header.tsx
    └── Breadcrumbs.tsx
```

### API Integration

```
lib/
├── api.ts           # Backend API client
├── types.ts         # TypeScript interfaces
├── utils.ts         # Utility functions
└── hooks/           # Custom React hooks
    ├── useFailures.ts
    ├── useAnalytics.ts
    └── useRealtime.ts
```

## 🔗 **API Integration Examples**

### Fetching Failures

```typescript
// lib/hooks/useFailures.ts
import useSWR from "swr";

export function useFailures() {
    const { data, error, mutate } = useSWR("/failures", fetcher);

    return {
        failures: data?.failures || [],
        totalCount: data?.total_failures || 0,
        isLoading: !error && !data,
        error,
        refresh: mutate,
    };
}
```

### Approving Fixes

```typescript
// lib/api.ts
export async function approveFix(fixId: string, comment?: string) {
    const response = await fetch(`${API_URL}/fixes/${fixId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", comment }),
    });

    return response.json();
}
```

## 📊 **Real-time Features**

-   **Live Updates**: Automatic refresh of failure counts and status
-   **WebSocket Ready**: Infrastructure for real-time notifications
-   **Progressive Enhancement**: Works without JavaScript for core features
-   **Offline Support**: Service worker for basic offline functionality

## 🎯 **Development Guidelines**

### Code Style

-   Use TypeScript for all components
-   Follow shadcn/ui component patterns
-   Implement responsive design (mobile-first)
-   Add proper error boundaries and loading states

### Performance

-   Use `next/image` for optimized images
-   Implement code splitting for large components
-   Cache API responses with SWR
-   Optimize bundle size with dynamic imports

### Accessibility

-   Follow WCAG 2.1 guidelines
-   Implement proper ARIA labels
-   Ensure keyboard navigation
-   Test with screen readers

## 🚀 **Deployment**

### Vercel (Recommended)

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

### Environment Setup

```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://ci-cd-fixer-agent-backend.onrender.com
NEXT_PUBLIC_APP_ENV=production
```

## 📈 **Current Production Metrics**

The dashboard displays real production data:

-   **29 Total Failures Processed** - All with AI-generated fixes
-   **20+ Repositories Analyzed** - Cross-language pattern recognition
-   **3.45% Human Approval Rate** - 1 approved, 2 rejected, 26 pending
-   **100% Uptime** - Reliable backend connectivity

## 🔧 **Available Scripts**

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
```

## 📚 **Learn More**

-   [Next.js 15 Documentation](https://nextjs.org/docs)
-   [shadcn/ui Components](https://ui.shadcn.com)
-   [Backend API Documentation](../API_REFERENCE.md)
-   [Project Status](../PROJECT_STATUS.md)

## 🤝 **Contributing**

This dashboard is part of the CI/CD Fixer Agent system. See the main project documentation for contribution guidelines and system architecture details.

---

**Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui** ⚡
