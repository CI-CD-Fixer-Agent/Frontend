"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
    Book,
    Code,
    Rocket,
    Bot,
    Database,
    Github,
    ExternalLink,
    Copy,
    Activity,
    Terminal,
    CheckCircle,
    Info,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface APIEndpoint {
    method: string;
    endpoint: string;
    description: string;
    example?: string;
    response?: string;
}

const apiEndpoints: APIEndpoint[] = [
    {
        method: "GET",
        endpoint: "/health",
        description: "Check system health and service status",
        example: `curl https://ci-cd-fixer-agent-backend.onrender.com/health`,
        response: `{
  "status": "healthy",
  "timestamp": "2025-08-25T10:30:00Z",
  "services": {
    "database": "connected",
    "gemini_api": "available"
  }
}`,
    },
    {
        method: "GET",
        endpoint: "/failures",
        description: "Get all processed CI/CD failures",
        example: `curl https://ci-cd-fixer-agent-backend.onrender.com/failures`,
        response: `{
  "total": 17,
  "failures": [
    {
      "id": 1,
      "repository": "chaitanyak175/ci-cd-test-repo",
      "status": "analyzed",
      "error_type": "build_failure"
    }
  ]
}`,
    },
    {
        method: "GET",
        endpoint: "/analytics/dashboard",
        description: "Get comprehensive analytics dashboard data",
        example: `curl https://ci-cd-fixer-agent-backend.onrender.com/analytics/dashboard`,
        response: `{
  "summary": {
    "total_failures": 17,
    "approved_fixes": 4,
    "success_rate": 41.18
  },
  "ml_insights": {
    "confidence_score": 82.38
  }
}`,
    },
    {
        method: "POST",
        endpoint: "/analyze",
        description: "Trigger AI analysis on a GitHub repository workflow",
        example: `curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292
  }'`,
        response: `{
  "analysis_id": "abc123",
  "status": "processing",
  "confidence": 85.5,
  "estimated_completion": "2025-08-25T10:35:00Z"
}`,
    },
    {
        method: "GET",
        endpoint: "/fixes/{fix_id}",
        description: "Get detailed information about a specific fix",
        example: `curl https://ci-cd-fixer-agent-backend.onrender.com/fixes/1`,
        response: `{
  "id": 1,
  "title": "Fix Node.js dependency conflict",
  "confidence": 82.38,
  "status": "pending_approval",
  "implementation_steps": [
    "Update package.json dependencies",
    "Run npm audit fix"
  ]
}`,
    },
    {
        method: "POST",
        endpoint: "/fixes/{fix_id}/approve",
        description: "Approve a generated fix for implementation",
        example: `curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/fixes/1/approve \\
  -H "Content-Type: application/json" \\
  -d '{"approved": true, "comments": "Looks good to implement"}'`,
        response: `{
  "status": "approved",
  "implementation_scheduled": "2025-08-25T10:40:00Z"
}`,
    },
];

function CodeBlock({
    children,
    className = "",
}: {
    children: string;
    className?: string;
}) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(children);
    };

    return (
        <div className={`relative ${className}`}>
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm max-w-full">
                <code className="break-words">{children}</code>
            </pre>
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={copyToClipboard}
            >
                <Copy className="h-3 w-3" />
            </Button>
        </div>
    );
}

function APIEndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
    const methodColors = {
        GET: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300",
        POST: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
        PUT: "bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
        DELETE: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300",
    };

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0">
                    <Badge
                        className={
                            methodColors[
                                endpoint.method as keyof typeof methodColors
                            ]
                        }
                    >
                        {endpoint.method}
                    </Badge>
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded break-all">
                        {endpoint.endpoint}
                    </code>
                </div>
                <CardDescription className="mt-2 text-sm">
                    {endpoint.description}
                </CardDescription>
            </CardHeader>
            {(endpoint.example || endpoint.response) && (
                <CardContent className="space-y-4">
                    {endpoint.example && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Terminal className="h-4 w-4 flex-shrink-0" />
                                Example Request
                            </h4>
                            <CodeBlock>{endpoint.example}</CodeBlock>
                        </div>
                    )}
                    {endpoint.response && (
                        <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Code className="h-4 w-4 flex-shrink-0" />
                                Example Response
                            </h4>
                            <CodeBlock>{endpoint.response}</CodeBlock>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export default function DocumentationPage() {
    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
                                <Book className="h-6 w-6 lg:h-8 lg:w-8" />
                                Documentation
                            </h1>
                            <p className="text-muted-foreground text-sm lg:text-base">
                                Complete guide to the CI/CD Fixer Agent system
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                asChild
                                className="w-full sm:w-auto"
                            >
                                <a
                                    href="https://ci-cd-fixer-agent-backend.onrender.com/docs"
                                    target="_blank"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    <span className="hidden sm:inline">
                                        Swagger UI
                                    </span>
                                    <span className="sm:hidden">API Docs</span>
                                </a>
                            </Button>
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 justify-center sm:justify-start"
                            >
                                <Activity className="h-3 w-3 mr-1" />
                                Live Production
                            </Badge>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="w-full">
                        <div className="overflow-x-auto">
                            <TabsList className="grid w-full grid-cols-4 min-w-[400px]">
                                <TabsTrigger
                                    value="overview"
                                    className="text-xs sm:text-sm"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="api"
                                    className="text-xs sm:text-sm"
                                >
                                    API Ref
                                </TabsTrigger>
                                <TabsTrigger
                                    value="setup"
                                    className="text-xs sm:text-sm"
                                >
                                    Setup
                                </TabsTrigger>
                                <TabsTrigger
                                    value="examples"
                                    className="text-xs sm:text-sm"
                                >
                                    Examples
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            {/* System Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Rocket className="h-5 w-5" />
                                        System Overview
                                    </CardTitle>
                                    <CardDescription>
                                        Intelligent CI/CD failure analysis and
                                        fixing platform
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-muted rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                17
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Failures Processed
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-muted rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                41.18%
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Approval Rate
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-muted rounded-lg sm:col-span-2 lg:col-span-1">
                                            <div className="text-2xl font-bold text-purple-600">
                                                100%
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Fix Generation
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <h3 className="font-semibold">
                                            Key Features
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    Automatic failure detection
                                                    via GitHub webhooks
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    AI-powered analysis with
                                                    Gemini 2.5 Pro
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    Portia AI orchestration
                                                    framework
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    Human approval workflow for
                                                    safety
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    ML analytics and pattern
                                                    recognition
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">
                                                    PostgreSQL audit trail
                                                    storage
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="h-5 w-5" />
                                        System Architecture
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        <Card className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Github className="h-5 w-5 text-purple-500 flex-shrink-0" />
                                                <h3 className="font-semibold text-sm lg:text-base">
                                                    GitHub Integration
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Webhook-based failure detection
                                                and repository analysis
                                            </p>
                                        </Card>
                                        <Card className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Bot className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                                <h3 className="font-semibold text-sm lg:text-base">
                                                    AI Processing
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Gemini 2.5 Pro analysis with
                                                Portia orchestration
                                            </p>
                                        </Card>
                                        <Card className="p-4 md:col-span-2 xl:col-span-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Database className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <h3 className="font-semibold text-sm lg:text-base">
                                                    Data Storage
                                                </h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                PostgreSQL database with
                                                comprehensive audit trails
                                            </p>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="api" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code className="h-5 w-5" />
                                        API Reference
                                    </CardTitle>
                                    <CardDescription>
                                        Complete API documentation for the CI/CD
                                        Fixer Agent
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm break-all">
                                                <strong>Base URL:</strong>{" "}
                                                <span className="break-all">
                                                    https://ci-cd-fixer-agent-backend.onrender.com
                                                </span>
                                            </span>
                                        </div>

                                        {apiEndpoints.map((endpoint, index) => (
                                            <APIEndpointCard
                                                key={index}
                                                endpoint={endpoint}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="setup" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Setup Guide</CardTitle>
                                    <CardDescription>
                                        How to integrate the CI/CD Fixer Agent
                                        with your repositories
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            1. GitHub Webhook Setup
                                        </h3>
                                        <CodeBlock>{`# Set up webhook in your repository settings
URL: https://ci-cd-fixer-agent-backend.onrender.com/webhook
Content Type: application/json
Events: Check runs, Pull requests, Workflow runs`}</CodeBlock>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            2. Repository Configuration
                                        </h3>
                                        <CodeBlock>{`# Add to your .github/workflows/main.yml
name: CI/CD Fixer Integration
on:
  workflow_run:
    workflows: ["*"]
    types: [completed]
    
jobs:
  notify-fixer:
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - name: Notify CI/CD Fixer
        run: |
          curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/analyze \\\\
            -H "Content-Type: application/json" \\\\
            -d '{
              "owner": "${"${{ github.repository_owner }}"}",
              "repo": "${"${{ github.event.repository.name }}"}",
              "run_id": "${"${{ github.run_id }}"}"
            }'`}</CodeBlock>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            3. Environment Variables
                                        </h3>
                                        <CodeBlock>{`# Required environment variables
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_postgresql_url
PORTIA_CONFIG=your_portia_configuration`}</CodeBlock>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="examples" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage Examples</CardTitle>
                                    <CardDescription>
                                        Real-world examples of using the CI/CD
                                        Fixer Agent
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            Check System Status
                                        </h3>
                                        <CodeBlock>{`# Quick health check
curl https://ci-cd-fixer-agent-backend.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "services": {
    "database": "connected",
    "gemini_api": "available"
  }
}`}</CodeBlock>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            Analyze a Failed Workflow
                                        </h3>
                                        <CodeBlock>{`# Trigger analysis for a specific GitHub Actions run
curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "microsoft",
    "repo": "vscode",
    "run_id": 17152193292
  }'

# The system will:
# 1. Fetch the workflow logs from GitHub
# 2. Analyze the failure with Gemini AI
# 3. Generate intelligent fix suggestions
# 4. Store results for approval workflow`}</CodeBlock>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            View Analytics Dashboard
                                        </h3>
                                        <CodeBlock>{`# Get comprehensive analytics
curl https://ci-cd-fixer-agent-backend.onrender.com/analytics/dashboard

# Returns insights including:
# - Success rates and trends
# - Repository-specific patterns
# - AI confidence scores
# - Historical analysis data`}</CodeBlock>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-3">
                                            Approve/Reject Fixes
                                        </h3>
                                        <CodeBlock>{`# Approve a generated fix
curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/fixes/1/approve \\
  -H "Content-Type: application/json" \\
  -d '{
    "approved": true,
    "comments": "Fix looks good, implement it"
  }'

# Reject a fix
curl -X POST https://ci-cd-fixer-agent-backend.onrender.com/fixes/1/approve \\
  -H "Content-Type: application/json" \\
  -d '{
    "approved": false,
    "comments": "Need more testing before implementation"
  }'`}</CodeBlock>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
