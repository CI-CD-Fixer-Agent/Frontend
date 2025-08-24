"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Brain,
    Cpu,
    Activity,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { useHealth, useAnalytics } from "@/hooks/use-api";

interface AgentMetrics {
    name: string;
    status: "active" | "idle" | "error";
    tasksProcessed: number;
    successRate: number;
    avgResponseTime: string;
    lastActivity: string;
    icon: React.ElementType;
    color: string;
}

function AgentCard({ agent }: { agent: AgentMetrics }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300">
                        Active
                    </Badge>
                );
            case "idle":
                return <Badge variant="outline">Idle</Badge>;
            case "error":
                return <Badge variant="destructive">Error</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const Icon = agent.icon;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={`p-2 rounded-full ${agent.color} text-white`}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <div>
                            <CardTitle className="text-sm">
                                {agent.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                AI Processing Agent
                            </CardDescription>
                        </div>
                    </div>
                    {getStatusBadge(agent.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                            Tasks Processed
                        </span>
                        <p className="font-medium text-sm sm:text-base">
                            {agent.tasksProcessed}
                        </p>
                    </div>
                    <div>
                        <span className="text-muted-foreground text-xs sm:text-sm">
                            Avg Response
                        </span>
                        <p className="font-medium text-sm sm:text-base">
                            {agent.avgResponseTime}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground text-xs sm:text-sm">
                            Success Rate
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                            {agent.successRate}%
                        </span>
                    </div>
                    <Progress value={agent.successRate} className="h-2" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <span className="text-xs">
                        Last activity: {agent.lastActivity}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 self-end sm:self-auto"
                    >
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function AIAgentStatus() {
    const {
        health,
        isLoading: healthLoading,
        error: healthError,
    } = useHealth();
    const { analytics, isLoading: analyticsLoading } = useAnalytics();

    const getAgentData = React.useMemo((): AgentMetrics[] => {
        if (!health || healthError) {
            return [
                {
                    name: "Gemini AI Agent",
                    status: "error",
                    tasksProcessed: 0,
                    successRate: 0,
                    avgResponseTime: "N/A",
                    lastActivity: "Unknown",
                    icon: Brain,
                    color: "bg-blue-500",
                },
                {
                    name: "Portia Orchestrator",
                    status: "error",
                    tasksProcessed: 0,
                    successRate: 0,
                    avgResponseTime: "N/A",
                    lastActivity: "Unknown",
                    icon: Cpu,
                    color: "bg-purple-500",
                },
            ];
        }

        const geminiStatus =
            health.services?.gemini_api === "healthy" ? "active" : "error";
        const databaseStatus =
            health.services?.database === "healthy" ? "active" : "error";

        const analyticsData = analytics as Record<string, unknown> | undefined;
        const statsData = (
            analyticsData?.statistics as Record<string, unknown> | undefined
        )?.overall_stats as Record<string, unknown> | undefined;

        const totalFixes = Number(
            statsData?.total_fixes || analyticsData?.total_fixes_generated || 0
        );

        const approvedFixes = Number(
            statsData?.approved_fixes ||
                analyticsData?.total_fixes_approved ||
                0
        );

        const successRate =
            totalFixes > 0 ? Math.round((approvedFixes / totalFixes) * 100) : 0;

        return [
            {
                name: "Gemini AI Agent",
                status: geminiStatus,
                tasksProcessed: totalFixes,
                successRate: successRate,
                avgResponseTime:
                    health.services?.gemini_api === "available"
                        ? "Real-time"
                        : "N/A",
                lastActivity: health.timestamp
                    ? new Date(health.timestamp).toLocaleTimeString()
                    : "Unknown",
                icon: Brain,
                color: "bg-blue-500",
            },
            {
                name: "Portia Orchestrator",
                status: databaseStatus,
                tasksProcessed: totalFixes,
                successRate: successRate,
                avgResponseTime:
                    health.services?.database === "connected"
                        ? "Real-time"
                        : "N/A",
                lastActivity: health.timestamp
                    ? new Date(health.timestamp).toLocaleTimeString()
                    : "Unknown",
                icon: Cpu,
                color: "bg-purple-500",
            },
        ];
    }, [health, analytics, healthError]);

    const isSystemHealthy = health?.status === "healthy" && !healthError;

    if (healthLoading || analyticsLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                AI Agent Status
                            </CardTitle>
                            <CardDescription>
                                Real-time status of CI/CD fixing agents
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin opacity-50" />
                        <p className="text-sm text-muted-foreground">
                            Loading agent status...
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                            AI Agent Status
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Real-time status of CI/CD fixing agents
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    {getAgentData.map((agent) => (
                        <AgentCard key={agent.name} agent={agent} />
                    ))}
                </div>

                {/* Overall System Health */}
                <div
                    className={`mt-6 p-4 rounded-lg border ${
                        isSystemHealthy
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        {isSystemHealthy ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">
                                    All agents operational - System healthy
                                </span>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">
                                    {healthError
                                        ? "Failed to connect to services"
                                        : "Some services are experiencing issues"}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
