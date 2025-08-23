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
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    GitBranch,
    AlertTriangle,
    Zap,
    BarChart3,
    Loader2,
} from "lucide-react";
import { useAnalytics, useDashboard } from "@/hooks/use-api";

interface Activity {
    id: string;
    type: "failure_detected" | "fix_applied" | "repo_analyzed";
    repo: string;
    timestamp: string;
    description: string;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color?: "green" | "red" | "blue" | "orange";
}

function MetricCard({
    title,
    value,
    change,
    icon: Icon,
    color = "blue",
}: MetricCardProps) {
    const colorClasses = {
        green: "text-green-600 bg-green-100",
        red: "text-red-600 bg-red-100",
        blue: "text-blue-600 bg-blue-100",
        orange: "text-orange-600 bg-orange-100",
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change !== undefined && (
                            <div className="flex items-center mt-1">
                                {change > 0 ? (
                                    <>
                                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                                        <span className="text-xs text-green-600">
                                            +{change}%
                                        </span>
                                    </>
                                ) : change < 0 ? (
                                    <>
                                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                                        <span className="text-xs text-red-600">
                                            {change}%
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        No change
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={`p-2 rounded-full ${colorClasses[color]}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface SuccessRateProgressProps {
    successRate: number;
    totalRuns: number;
    successfulRuns: number;
}

function SuccessRateProgress({
    successRate,
    totalRuns,
    successfulRuns,
}: SuccessRateProgressProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                    Fix Success Rate
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span>Overall Success</span>
                        <span className="font-medium">{successRate}%</span>
                    </div>
                    <Progress value={successRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{successfulRuns} successful</span>
                        <span>{totalRuns} total</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface RecentActivityProps {
    activities: Array<{
        id: string;
        type:
            | "fix_generated"
            | "fix_applied"
            | "fix_rejected"
            | "failure_detected";
        repo: string;
        timestamp: string;
        description: string;
    }>;
}

function RecentActivity({ activities }: RecentActivityProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case "fix_generated":
                return <Zap className="h-3 w-3 text-blue-600" />;
            case "fix_applied":
                return <CheckCircle2 className="h-3 w-3 text-green-600" />;
            case "fix_rejected":
                return <XCircle className="h-3 w-3 text-red-600" />;
            case "failure_detected":
                return <AlertTriangle className="h-3 w-3 text-orange-600" />;
            default:
                return <Activity className="h-3 w-3 text-gray-600" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case "fix_generated":
                return "bg-blue-100 text-blue-800";
            case "fix_applied":
                return "bg-green-100 text-green-800";
            case "fix_rejected":
                return "bg-red-100 text-red-800";
            case "failure_detected":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Latest CI/CD fixer actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 pb-3 border-b last:border-0"
                        >
                            <div className="mt-1">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                        variant="outline"
                                        className={getActivityColor(
                                            activity.type
                                        )}
                                    >
                                        {activity.type.replace("_", " ")}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    <GitBranch className="h-3 w-3 inline mr-1" />
                                    {activity.repo}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function RealTimeAnalytics() {
    const {
        analytics,
        isLoading: analyticsLoading,
        error: analyticsError,
    } = useAnalytics();
    const {
        dashboard,
        summary,
        recentActivity,
        isLoading: dashboardLoading,
        error: dashboardError,
    } = useDashboard();

    // Debug: Log the actual API responses to understand the data structure
    React.useEffect(() => {
        if (analytics) {
            console.log("Analytics data:", analytics);
        }
        if (dashboard) {
            console.log("Dashboard data:", dashboard);
        }
        if (summary) {
            console.log("Summary data:", summary);
        }
        if (recentActivity) {
            console.log("Recent activity data:", recentActivity);
        }
    }, [analytics, dashboard, summary, recentActivity]);

    const isLoading = analyticsLoading || dashboardLoading;
    const error = analyticsError || dashboardError;

    if (isLoading) {
        return (
            <div className="text-center py-6">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin opacity-50" />
                <p className="text-sm text-muted-foreground">
                    Loading analytics...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Failed to load analytics</p>
                <p className="text-xs">Please try again later</p>
            </div>
        );
    }

    // Extract metrics from the API response with proper type checking
    const overallStats = analytics;

    // Try to get success rate from different possible locations with type casting
    const successRate =
        (analytics as any)?.statistics?.overall_stats?.approval_rate ||
        (analytics as any)?.overall_approval_rate ||
        (analytics as any)?.approval_rate ||
        0;

    // Get active repositories count from various possible sources with type casting
    const activeRepositories =
        summary?.total_repositories ||
        summary?.key_metrics?.total_repos_analyzed ||
        (dashboard as any)?.summary?.total_repositories ||
        0;

    // Convert recent activity to the expected format with better fallbacks
    const formattedActivities: Activity[] = (recentActivity || [])
        .slice(0, 5)
        .map((activity: any, index: number) => ({
            id: activity.id || index.toString(),
            type: "failure_detected" as const,
            repo:
                activity.repository ||
                activity.repo_name ||
                `Repository ${index + 1}`,
            timestamp: activity.timestamp || activity.created_at || "Recently",
            description: activity.status
                ? `Status: ${activity.status}`
                : activity.workflow_name
                ? `Workflow: ${activity.workflow_name}`
                : "CI/CD workflow processed",
        }));

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Failures"
                    value={summary?.total_failures || 0}
                    icon={XCircle}
                    color="red"
                />
                <MetricCard
                    title="Active Fixes"
                    value={summary?.active_fixes || 0}
                    icon={CheckCircle2}
                    color="blue"
                />
                <MetricCard
                    title="Active Repositories"
                    value={activeRepositories}
                    icon={GitBranch}
                    color="orange"
                />
                <MetricCard
                    title="Success Rate"
                    value={`${Math.round(successRate)}%`}
                    icon={TrendingUp}
                    color={successRate > 50 ? "green" : "red"}
                />
            </div>

            {/* Success Rate Progress */}
            <SuccessRateProgress
                successRate={Math.round(successRate)}
                totalRuns={
                    (summary?.total_failures || 0) +
                    (summary?.active_fixes || 0)
                }
                successfulRuns={Math.round(
                    ((summary?.total_failures || 0) +
                        (summary?.active_fixes || 0)) *
                        (successRate / 100)
                )}
            />

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>
                        Latest CI/CD workflow events and fixes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {formattedActivities.length > 0 ? (
                        <div className="space-y-4">
                            {formattedActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start space-x-3"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.repo}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {activity.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No recent activity</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
