"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatterns, useEffectiveness } from "@/hooks/use-api";
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
} from "recharts";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function AnalyticsPage() {
    const {
        patterns,
        recommendations,
        isLoading: patternsLoading,
        error: patternsError,
    } = usePatterns({ daysBack: 30 });
    const {
        metrics,
        isLoading: effectivenessLoading,
        error: effectivenessError,
    } = useEffectiveness();

    const isLoading = patternsLoading || effectivenessLoading;
    const hasError = patternsError || effectivenessError;

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
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="px-4 lg:px-6">
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        {[...Array(4)].map((_, i) => (
                                            <Card key={i}>
                                                <CardHeader className="pb-2">
                                                    <Skeleton className="h-4 w-[100px]" />
                                                    <Skeleton className="h-8 w-[60px]" />
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2 mt-6">
                                        <Card>
                                            <CardHeader>
                                                <Skeleton className="h-6 w-[200px]" />
                                            </CardHeader>
                                            <CardContent>
                                                <Skeleton className="h-[300px] w-full" />
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <Skeleton className="h-6 w-[200px]" />
                                            </CardHeader>
                                            <CardContent>
                                                <Skeleton className="h-[300px] w-full" />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
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
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <div className="px-4 lg:px-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-destructive">
                                                Error Loading Analytics
                                            </CardTitle>
                                            <CardDescription>
                                                Unable to load analytics data
                                                from the backend API
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    // Prepare chart data
    const repoFailuresData = patterns?.most_failing_repos
        ? Object.entries(patterns.most_failing_repos).map(
              ([name, failures]) => ({
                  name: name.length > 20 ? name.substring(0, 20) + "..." : name,
                  failures,
              })
          )
        : [];

    const errorTypesData = patterns?.common_error_types
        ? Object.entries(patterns.common_error_types).map(
              ([name, value], index) => ({
                  name: name.length > 15 ? name.substring(0, 15) + "..." : name,
                  value,
                  color: COLORS[index % COLORS.length],
              })
          )
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
                    {/* Effectiveness Metrics */}
                    {metrics && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Fixes Generated
                                    </CardTitle>
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {metrics.total_fixes_generated}
                                    </div>
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
                                        {Math.round(
                                            metrics.overall_approval_rate * 100
                                        )}
                                        %
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Approved Fixes
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {metrics.total_fixes_approved}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Pending Review
                                    </CardTitle>
                                    <TrendingDown className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {metrics.pending_fixes}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Repository Failures Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Most Failing Repositories</CardTitle>
                                <CardDescription>
                                    Repositories with the highest number of
                                    failures
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={repoFailuresData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar
                                            dataKey="failures"
                                            fill="#8884d8"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Error Types Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Error Types Distribution</CardTitle>
                                <CardDescription>
                                    Most common types of workflow failures
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
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
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Language Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Language Distribution</CardTitle>
                                <CardDescription>
                                    Programming languages in failing
                                    repositories
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={languageData}
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
                                            {languageData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        {recommendations && recommendations.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>AI Recommendations</CardTitle>
                                    <CardDescription>
                                        Insights and suggestions based on
                                        failure patterns
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {recommendations.map(
                                            (
                                                recommendation: string,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs shrink-0 mt-0.5"
                                                    >
                                                        {index + 1}
                                                    </Badge>
                                                    <p className="text-sm text-muted-foreground">
                                                        {recommendation}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
