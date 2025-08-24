"use client";

import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle,
    XCircle,
    Clock,
    GitBranch,
    ExternalLink,
    Loader2,
    AlertTriangle,
    TrendingUp,
} from "lucide-react";
import { useFixes } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Fix } from "@/lib/types";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface FixStatistics {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    applied: number;
    avgConfidence: number;
    successRate: number;
}

export default function FixesPage() {
    const [processingFixes, setProcessingFixes] = useState<Set<string>>(
        new Set()
    );
    const [reviewComment, setReviewComment] = useState("");
    const [selectedFix, setSelectedFix] = useState<string | null>(null);
    const { fixes: apiFixes, error, isLoading: loading, refresh } = useFixes();

    // Calculate statistics directly from API data
    const statistics = React.useMemo(() => {
        if (!apiFixes || apiFixes.length === 0) {
            return {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                applied: 0,
                avgConfidence: 0,
                successRate: 0,
            };
        }

        const stats = apiFixes.reduce(
            (acc: FixStatistics, fix: Fix) => {
                acc.total++;
                acc[
                    fix.status as keyof Pick<
                        FixStatistics,
                        "pending" | "approved" | "rejected" | "applied"
                    >
                ]++;
                acc.avgConfidence += fix.confidence_score || 0;
                return acc;
            },
            {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                applied: 0,
                avgConfidence: 0,
                successRate: 0,
            }
        );

        if (stats.total > 0) {
            stats.avgConfidence = stats.avgConfidence / stats.total;
            stats.successRate =
                ((stats.approved + stats.applied) / stats.total) * 100;
        }

        return stats;
    }, [apiFixes]);

    const fixes = apiFixes || [];

    const handleApplyFix = async (fixId: string) => {
        setProcessingFixes((prev) => new Set(prev).add(fixId));
        try {
            await api.applyFix(fixId);
            refresh();
            toast.success("Fix has been applied successfully!");
        } catch (error) {
            console.error("Error applying fix:", error);
            toast.error("Failed to apply fix");
        } finally {
            setProcessingFixes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(fixId);
                return newSet;
            });
        }
    };
    const handleApprove = async (fixId: string) => {
        setProcessingFixes((prev) => new Set(prev).add(fixId));
        try {
            await api.approveFix(fixId, reviewComment);
            refresh();
            setReviewComment("");
            setSelectedFix(null);
        } catch (error) {
            console.error("Error approving fix:", error);
        } finally {
            setProcessingFixes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(fixId);
                return newSet;
            });
        }
    };

    const handleReject = async (fixId: string) => {
        setProcessingFixes((prev) => new Set(prev).add(fixId));
        try {
            await api.rejectFix(fixId, reviewComment);
            refresh();
            setReviewComment("");
            setSelectedFix(null);
        } catch (error) {
            console.error("Error rejecting fix:", error);
        } finally {
            setProcessingFixes((prev) => {
                const newSet = new Set(prev);
                newSet.delete(fixId);
                return newSet;
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-500" />;
            case "applied":
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: "secondary",
            approved: "default",
            rejected: "destructive",
            applied: "default",
        } as const;

        return (
            <Badge
                variant={
                    variants[status as keyof typeof variants] || "secondary"
                }
            >
                {getStatusIcon(status)}
                <span className="ml-1 capitalize">{status}</span>
            </Badge>
        );
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 0.8) return "text-green-600";
        if (score >= 0.6) return "text-yellow-600";
        return "text-red-600";
    };

    if (loading) {
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
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
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
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Fix Management
                            </h1>
                            <p className="text-muted-foreground">
                                Review and approve AI-generated fixes for CI/CD
                                failures
                            </p>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Fixes
                                </CardTitle>
                                <GitBranch className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {statistics.total}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Review
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {statistics.pending}
                                </div>
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
                                    {statistics.successRate.toFixed(1)}%
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Avg Confidence
                                </CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {(statistics.avgConfidence * 100).toFixed(
                                        1
                                    )}
                                    %
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {error && (
                        <Card className="border-red-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center space-x-2 text-red-600">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Error loading fixes: {error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Fixes List */}
                    <div className="space-y-4">
                        {fixes.length === 0 ? (
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <p className="text-muted-foreground">
                                        No fixes available for review
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            fixes.map((fix) => (
                                <Card key={fix.id} className="relative">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <CardTitle className="text-lg">
                                                    Fix #
                                                    {String(fix.id).slice(0, 8)}
                                                </CardTitle>
                                                {getStatusBadge(fix.status)}
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                {fix.confidence_score && (
                                                    <span
                                                        className={getConfidenceColor(
                                                            fix.confidence_score
                                                        )}
                                                    >
                                                        Confidence:{" "}
                                                        {(
                                                            fix.confidence_score *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </span>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`https://github.com/${fix.repository}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                        <CardDescription>
                                            Repository: {fix.repository}
                                            {fix.workflow_name &&
                                                ` | Workflow: ${fix.workflow_name}`}
                                            {fix.fix_complexity &&
                                                ` | Complexity: ${fix.fix_complexity}`}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">
                                                Proposed Fix:
                                            </h4>
                                            <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                                                {fix.suggested_fix ||
                                                    fix.description ||
                                                    "No fix details available"}
                                            </pre>
                                        </div>

                                        {(fix.status === "pending" ||
                                            fix.status ===
                                                "pending_approval") && (
                                            <div className="space-y-3 border-t pt-4">
                                                <div>
                                                    <label className="text-sm font-medium">
                                                        Review Comment
                                                        (Optional)
                                                    </label>
                                                    <Textarea
                                                        value={
                                                            selectedFix ===
                                                            fix.id
                                                                ? reviewComment
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            setReviewComment(
                                                                e.target.value
                                                            );
                                                            setSelectedFix(
                                                                fix.id
                                                            );
                                                        }}
                                                        placeholder="Add your review comments..."
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleReject(fix.id)
                                                        }
                                                        disabled={processingFixes.has(
                                                            fix.id
                                                        )}
                                                        size="lg"
                                                        className="min-w-[120px] border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                                                    >
                                                        {processingFixes.has(
                                                            fix.id
                                                        ) ? (
                                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 mr-2" />
                                                        )}
                                                        Reject
                                                    </Button>

                                                    <Button
                                                        onClick={() =>
                                                            handleApprove(
                                                                fix.id
                                                            )
                                                        }
                                                        disabled={processingFixes.has(
                                                            fix.id
                                                        )}
                                                        size="lg"
                                                        className="min-w-[120px] bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        {processingFixes.has(
                                                            fix.id
                                                        ) ? (
                                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                        ) : (
                                                            <CheckCircle className="h-5 w-5 mr-2" />
                                                        )}
                                                        Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {fix.status === "approved" && (
                                            <div className="space-y-3 border-t pt-4">
                                                <div className="flex justify-end">
                                                    <Button
                                                        onClick={() =>
                                                            handleApplyFix(
                                                                fix.id
                                                            )
                                                        }
                                                        disabled={processingFixes.has(
                                                            fix.id
                                                        )}
                                                        size="lg"
                                                        className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        {processingFixes.has(
                                                            fix.id
                                                        ) ? (
                                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                        ) : (
                                                            <GitBranch className="h-5 w-5 mr-2" />
                                                        )}
                                                        Apply Fix
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="text-xs text-muted-foreground flex justify-between">
                                            <span>
                                                Created:{" "}
                                                {new Date(
                                                    fix.created_at
                                                ).toLocaleString()}
                                            </span>
                                            <span>Status: {fix.status}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
