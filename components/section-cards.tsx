"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-api";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    GitBranch,
    Bot,
} from "lucide-react";

export function SectionCards() {
    const { summary, isLoading, error } = useDashboard();

    if (isLoading) {
        return (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[80px] sm:w-[100px]" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 sm:h-8 w-[40px] sm:w-[60px] mb-2" />
                            <Skeleton className="h-3 w-[100px] sm:w-[120px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">
                            Error Loading Data
                        </CardTitle>
                        <CardDescription>
                            Unable to connect to the backend API
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Failures
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">
                        {summary?.total_failures || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Workflow failures tracked
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Repositories
                    </CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">
                        {summary?.total_repositories || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Active repositories monitored
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Fixes
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-xl sm:text-2xl font-bold">
                        {summary?.active_fixes || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Pending human approval
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Success Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {((summary?.success_rate || 0) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Fix approval rate
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Avg Processing
                    </CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {summary?.processing_time_avg || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        AI analysis time
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        System Status
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="outline"
                            className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800"
                        >
                            Operational
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        All services healthy
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
