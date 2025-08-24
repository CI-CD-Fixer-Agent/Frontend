"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MLPredictionPanel } from "@/components/ml-prediction-panel";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePatterns, useEffectiveness, useDashboard } from "@/hooks/use-api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import {
    Target,
    Award,
    Brain,
    GitBranch,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
} from "lucide-react";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
];

export default function AnalyticsPageEnhanced() {
    const {
        patterns,
        recommendations,
        isLoading: patternsLoading,
        error: patternsError,
        refresh: refreshPatterns,
    } = usePatterns({ daysBack: 30 });

    const {
        metrics,
        isLoading: effectivenessLoading,
        error: effectivenessError,
        refresh: refreshEffectiveness,
    } = useEffectiveness();

    const {
        summary,
        isLoading: dashboardLoading,
        error: dashboardError,
        refresh: refreshDashboard,
    } = useDashboard();

    const repoFailuresData = patterns?.most_failing_repos
        ? Object.entries(patterns.most_failing_repos)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 10)
              .map(([name, failures]) => ({
                  name: name.length > 20 ? name.substring(0, 20) + "..." : name,
                  failures,
                  fullName: name,
              }))
        : [];

    const errorTypesData = patterns?.common_error_types
        ? Object.entries(patterns.common_error_types)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([name, value], index) => ({
                  name: name.length > 15 ? name.substring(0, 15) + "..." : name,
                  value,
                  color: COLORS[index % COLORS.length],
                  fullName: name,
              }))
        : [];

    const languageData = patterns?.language_distribution
        ? Object.entries(patterns.language_distribution).map(
              ([name, value], index) => ({
                  name,
                  value,
                  color: COLORS[index % COLORS.length],
              })
          )
        : [];

    const metricsData = metrics as Record<string, unknown> | undefined;
    const statsData = (
        metricsData?.statistics as Record<string, unknown> | undefined
    )?.overall_stats as Record<string, unknown> | undefined;

    const totalFixes = Number(
        statsData?.total_fixes || metricsData?.total_fixes_generated || 0
    );
    const approvedFixes = Number(
        statsData?.approved_fixes || metricsData?.total_fixes_approved || 0
    );
    const pendingFixes = Number(
        statsData?.pending_fixes || metricsData?.pending_fixes || 0
    );
    const approvalRate = Number(
        statsData?.approval_rate || metricsData?.overall_approval_rate || 0
    );

    const trendData = React.useMemo(() => {
        // Use only real data from the API
        const currentWeek = {
            date: "Current Period",
            failures: summary?.total_failures || 0,
            fixes: totalFixes,
            approvals: approvedFixes,
        };

        return [currentWeek];
    }, [summary?.total_failures, totalFixes, approvedFixes]);

    const isLoading =
        patternsLoading || effectivenessLoading || dashboardLoading;
    const hasError = patternsError || effectivenessError || dashboardError;

    const refreshAll = () => {
        refreshPatterns();
        refreshEffectiveness();
        refreshDashboard();
    };

    if (isLoading) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-[60px]" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-[200px]" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-[300px] w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (hasError) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-destructive flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Error Loading Analytics
                                </CardTitle>
                                <CardDescription>
                                    Unable to load analytics data from the
                                    backend API
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={refreshAll} variant="outline">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Advanced Analytics
                            </h1>
                            <p className="text-muted-foreground">
                                Deep insights into CI/CD failure patterns and
                                fix effectiveness
                            </p>
                        </div>
                        <Button onClick={refreshAll} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh All
                        </Button>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Fixes Generated
                                </CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalFixes}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    AI-powered solutions
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Approval Rate
                                </CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(approvalRate * 100)}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Human-approved fixes
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Repositories
                                </CardTitle>
                                <GitBranch className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {summary?.total_repositories ||
                                        Object.keys(
                                            patterns?.most_failing_repos || {}
                                        ).length ||
                                        0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Under monitoring
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Learning Progress
                                </CardTitle>
                                <Brain className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {String(
                                        (
                                            metricsData?.trends as Record<
                                                string,
                                                unknown
                                            >
                                        )?.learning_velocity
                                    ) || "Steady"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    AI improvement rate
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Most Failing Repositories
                                </CardTitle>
                                <CardDescription>
                                    Top 10 repositories by failure count
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {repoFailuresData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart data={repoFailuresData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                            />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [
                                                    value,
                                                    "Failures",
                                                ]}
                                                labelFormatter={(label) => {
                                                    const item =
                                                        repoFailuresData.find(
                                                            (d) =>
                                                                d.name === label
                                                        );
                                                    return (
                                                        item?.fullName || label
                                                    );
                                                }}
                                            />
                                            <Bar
                                                dataKey="failures"
                                                fill="#8884d8"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No failure data available</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChartIcon className="h-5 w-5" />
                                    Error Types Distribution
                                </CardTitle>
                                <CardDescription>
                                    Common failure categories
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {errorTypesData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={errorTypesData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {errorTypesData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [
                                                    value,
                                                    "Count",
                                                ]}
                                                labelFormatter={(label) => {
                                                    const item =
                                                        errorTypesData.find(
                                                            (d) =>
                                                                d.name === label
                                                        );
                                                    return (
                                                        item?.fullName || label
                                                    );
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No error data available</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Failure & Fix Trends
                                </CardTitle>
                                <CardDescription>
                                    Weekly progress over time
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={trendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="failures"
                                            stroke="#ff7c7c"
                                            strokeWidth={2}
                                            name="Failures"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="fixes"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            name="Fixes Generated"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="approvals"
                                            stroke="#82ca9d"
                                            strokeWidth={2}
                                            name="Approvals"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GitBranch className="h-5 w-5" />
                                    Language Distribution
                                </CardTitle>
                                <CardDescription>
                                    Programming languages in analyzed projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {languageData.length > 0 ? (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart data={languageData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="value"
                                                fill="#00C49F"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>No language data available</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {recommendations && recommendations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    AI Recommendations
                                </CardTitle>
                                <CardDescription>
                                    Intelligent insights based on failure
                                    patterns
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recommendations.map((rec, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                                        >
                                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-blue-900">
                                                {rec}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <MLPredictionPanel />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Fix Effectiveness Breakdown
                            </CardTitle>
                            <CardDescription>
                                Detailed analysis of fix generation and approval
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">
                                        {totalFixes}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Total Generated
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">
                                        {approvedFixes}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Approved
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600">
                                        {pendingFixes}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Pending Review
                                    </p>
                                </div>
                            </div>

                            {metricsData?.effectiveness_by_type ? (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3">
                                        Effectiveness by Error Type
                                    </h4>
                                    <div className="space-y-2">
                                        {Object.entries(
                                            metricsData.effectiveness_by_type as Record<
                                                string,
                                                unknown
                                            >
                                        ).map(
                                            ([type, data]: [
                                                string,
                                                unknown
                                            ]) => {
                                                const dataObj = data as Record<
                                                    string,
                                                    unknown
                                                >;
                                                return (
                                                    <div
                                                        key={type}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm">
                                                            {type}
                                                        </span>
                                                        <Badge variant="outline">
                                                            {Math.round(
                                                                Number(
                                                                    dataObj.approval_rate
                                                                ) * 100
                                                            )}
                                                            % success rate
                                                        </Badge>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
