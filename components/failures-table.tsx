"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useFailures } from "@/hooks/use-api";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ExternalLink,
    GitBranch,
} from "lucide-react";

// Helper functions to validate GitHub data
const isValidRunId = (runId: string | number): boolean => {
    // GitHub Actions run IDs are typically 10+ digit numbers
    const runIdStr = String(runId);
    return (
        runIdStr.length >= 10 &&
        /^\d+$/.test(runIdStr) &&
        !runIdStr.match(/^(777|888|999)/)
    );
};

const isValidRepo = (owner: string, repoName: string): boolean => {
    // Check if this looks like real repo data vs test data
    const testPatterns = [
        "production-test",
        "test-final",
        "manual-analysis",
        "test-repo-",
        "fake-",
        "example-",
        "sample-",
    ];
    const fullName = `${owner}/${repoName}`.toLowerCase();
    return (
        !testPatterns.some((pattern) => fullName.includes(pattern)) &&
        owner !== "test" &&
        repoName !== "test"
    );
};

export function FailuresTable() {
    const { failures, totalCount, isLoading, error } = useFailures({
        limit: 10,
    });

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60)
        );

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Failures</CardTitle>
                    <CardDescription>
                        Loading recent workflow failures...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-4"
                            >
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-[200px]" />
                                <Skeleton className="h-4 w-[100px]" />
                                <Skeleton className="h-4 w-[80px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive">
                        Failed to Load Failures
                    </CardTitle>
                    <CardDescription>
                        Unable to fetch workflow failures from the backend API
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "generated":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "approved":
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case "rejected":
                return <AlertTriangle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            generated: "default",
            pending: "secondary",
            approved: "default",
            rejected: "destructive",
        } as const;

        return (
            <Badge
                variant={
                    variants[status as keyof typeof variants] || "secondary"
                }
            >
                {status}
            </Badge>
        );
    };

    const getErrorTypeBadge = (errorType: string | undefined) => {
        if (!errorType) {
            return <Badge variant="outline">Unknown</Badge>;
        }

        // Handle different error type formats
        const normalizedType = errorType
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_");

        const variants = {
            // GitHub Actions conclusions
            failure: "destructive",
            cancelled: "secondary",
            timed_out: "default",
            action_required: "outline",
            neutral: "outline",
            skipped: "secondary",
            // Custom error types
            dependency_error: "destructive",
            test_failure: "secondary",
            build_failure: "outline",
            timeout: "default",
            manual_analysis: "secondary",
            deployment_error: "destructive",
            compilation_error: "destructive",
            configuration_error: "outline",
            network_error: "default",
        } as const;

        // Format display text - handle different cases
        let displayText = errorType;
        if (errorType.toLowerCase() === "failure") {
            displayText = "Build Failure";
        } else if (errorType.toLowerCase() === "timed_out") {
            displayText = "Timeout";
        } else if (errorType.toLowerCase() === "action_required") {
            displayText = "Action Required";
        } else {
            // For other cases, format normally
            displayText = errorType
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
        }

        return (
            <Badge
                variant={
                    variants[normalizedType as keyof typeof variants] ||
                    "outline"
                }
            >
                {displayText}
            </Badge>
        );
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" />
                    Recent Failures
                </CardTitle>
                <CardDescription>
                    {totalCount} total workflow failures tracked
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Repository</TableHead>
                            <TableHead>Workflow</TableHead>
                            <TableHead>Error Type</TableHead>
                            <TableHead>Fix Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {failures.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground"
                                >
                                    No failures found
                                </TableCell>
                            </TableRow>
                        ) : (
                            failures.map((failure) => (
                                <TableRow key={failure.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(failure.fix_status)}
                                            <span className="font-medium">
                                                {failure.owner}/
                                                {failure.repo_name}
                                            </span>
                                            {!isValidRepo(
                                                failure.owner,
                                                failure.repo_name
                                            ) && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    TEST
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {failure.workflow_name}
                                    </TableCell>
                                    <TableCell>
                                        {getErrorTypeBadge(
                                            failure.conclusion || failure.status
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(failure.fix_status)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatTimeAgo(failure.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        {failure.run_id &&
                                        isValidRunId(failure.run_id) ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const url = `https://github.com/${failure.owner}/${failure.repo_name}/actions/runs/${failure.run_id}`;
                                                    window.open(url, "_blank");
                                                }}
                                                title="View GitHub Actions Run"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        ) : failure.owner &&
                                          failure.repo_name &&
                                          isValidRepo(
                                              failure.owner,
                                              failure.repo_name
                                          ) ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const url = `https://github.com/${failure.owner}/${failure.repo_name}`;
                                                    window.open(url, "_blank");
                                                }}
                                                title="View Repository"
                                            >
                                                <GitBranch className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled
                                                title="Test Data - No Link Available"
                                            >
                                                <ExternalLink className="h-4 w-4 opacity-50" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
