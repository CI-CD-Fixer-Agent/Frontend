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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useFailures } from "@/hooks/use-api";
import { api } from "@/lib/api";
import {
    ExternalLink,
    GitBranch,
    Search,
    Filter,
    RefreshCw,
    Eye,
    Zap,
    CheckCircle,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export function FailuresTableEnhanced() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [limit] = React.useState(20);

    const { failures, totalCount, isLoading, error, refresh } = useFailures({
        limit,
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

    const filteredFailures = failures.filter((failure) => {
        const matchesSearch =
            searchTerm === "" ||
            failure.repo_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            failure.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            failure.workflow_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || failure.fix_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-600"
                    >
                        Pending
                    </Badge>
                );
            case "generated":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                    >
                        Fix Generated
                    </Badge>
                );
            case "approved":
                return (
                    <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                    >
                        Approved
                    </Badge>
                );
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "generated":
                return (
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                );
            case "pending":
                return (
                    <Clock className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                );
            case "approved":
                return (
                    <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                );
            case "rejected":
                return (
                    <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                );
            default:
                return (
                    <AlertTriangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                );
        }
    };

    const getPriorityColor = (errorLog?: string) => {
        if (!errorLog) return "bg-gray-50 dark:bg-gray-800/50";

        const log = errorLog.toLowerCase();
        const highPriorityKeywords = [
            "security",
            "vulnerability",
            "exploit",
            "critical",
        ];
        const mediumPriorityKeywords = ["error", "failed", "timeout", "crash"];

        if (highPriorityKeywords.some((keyword) => log.includes(keyword))) {
            return "bg-red-50 border-l-4 border-red-500 dark:bg-red-950/30 dark:border-red-400";
        }
        if (mediumPriorityKeywords.some((keyword) => log.includes(keyword))) {
            return "bg-orange-50 border-l-4 border-orange-500 dark:bg-orange-950/30 dark:border-orange-400";
        }
        return "bg-blue-50 border-l-4 border-blue-500 dark:bg-blue-950/30 dark:border-blue-400";
    };

    const triggerAnalysis = async (
        owner: string,
        repo: string,
        runId: number
    ) => {
        try {
            toast.promise(
                api.triggerAnalysis({
                    owner,
                    repo,
                    run_id: runId,
                }),
                {
                    loading: "Triggering AI analysis...",
                    success: "Analysis triggered successfully!",
                    error: "Failed to trigger analysis",
                }
            );
            refresh();
        } catch (error) {
            console.error("Failed to trigger analysis:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[100px]" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-4 w-[300px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Failed to Load Failures
                    </CardTitle>
                    <CardDescription>
                        Unable to fetch workflow failures from the backend API
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => refresh()} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <Input
                        placeholder="Search repositories, workflows..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="generated">Fix Generated</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={() => refresh()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Showing {filteredFailures.length} of {totalCount} failures
                </span>
                <span>
                    {
                        failures.filter((f) => f.fix_status === "generated")
                            .length
                    }{" "}
                    fixes generated
                </span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        CI/CD Failures
                    </CardTitle>
                    <CardDescription>
                        Monitor and manage workflow failures with AI-powered fix
                        suggestions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Repository</TableHead>
                                <TableHead>Workflow</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Fix Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFailures.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8"
                                    >
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <GitBranch className="h-8 w-8 opacity-50" />
                                            <p>No failures found</p>
                                            {searchTerm && (
                                                <p className="text-xs">
                                                    Try adjusting your search
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFailures.map((failure) => (
                                    <TableRow
                                        key={failure.id}
                                        className={getPriorityColor(
                                            failure.error_log
                                        )}
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {failure.owner}/
                                                    {failure.repo_name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    Run #{failure.run_id}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(failure.status)}
                                                <span className="truncate max-w-[200px]">
                                                    {failure.workflow_name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    failure.conclusion ===
                                                    "failure"
                                                        ? "destructive"
                                                        : "secondary"
                                                }
                                            >
                                                {failure.conclusion}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(failure.fix_status)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {formatTimeAgo(failure.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                // View failure details
                                                                console.log(
                                                                    "View failure:",
                                                                    failure
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Failure Details:{" "}
                                                                {
                                                                    failure.workflow_name
                                                                }
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                {failure.owner}/
                                                                {
                                                                    failure.repo_name
                                                                }{" "}
                                                                - Run #
                                                                {failure.run_id}
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-medium mb-2">
                                                                    Error Log
                                                                </h4>
                                                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto max-h-60 whitespace-pre-wrap break-words">
                                                                    {failure.error_log ||
                                                                        "No error log available"}
                                                                </pre>
                                                            </div>
                                                            {failure.suggested_fix && (
                                                                <div>
                                                                    <h4 className="font-medium mb-2">
                                                                        Suggested
                                                                        Fix
                                                                    </h4>
                                                                    <pre className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded text-sm overflow-auto max-h-60 whitespace-pre-wrap break-words border border-blue-200 dark:border-blue-700">
                                                                        {
                                                                            failure.suggested_fix
                                                                        }
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {failure.fix_status ===
                                                    "pending" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            triggerAnalysis(
                                                                failure.owner,
                                                                failure.repo_name,
                                                                failure.run_id
                                                            )
                                                        }
                                                    >
                                                        <Zap className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={`https://github.com/${failure.owner}/${failure.repo_name}/actions/runs/${failure.run_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
