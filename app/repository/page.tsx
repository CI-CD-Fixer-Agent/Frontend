"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepositoryAnalytics } from "@/hooks/use-api";
import { Search, GitBranch, AlertTriangle, CheckCircle } from "lucide-react";

export default function RepositoryAnalyticsPage() {
    const [owner, setOwner] = useState("");
    const [repo, setRepo] = useState("");
    const [searchQuery, setSearchQuery] = useState<{
        owner: string;
        repo: string;
    } | null>(null);

    const { profile, isLoading, error } = useRepositoryAnalytics(
        searchQuery?.owner || "",
        searchQuery?.repo || ""
    );

    const handleSearch = () => {
        if (owner.trim() && repo.trim()) {
            setSearchQuery({ owner: owner.trim(), repo: repo.trim() });
        }
    };

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
                                {/* Search Form */}
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle>
                                            Repository Analytics
                                        </CardTitle>
                                        <CardDescription>
                                            Get detailed analytics for a
                                            specific GitHub repository
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="owner">
                                                    Repository Owner
                                                </Label>
                                                <Input
                                                    id="owner"
                                                    placeholder="e.g., facebook"
                                                    value={owner}
                                                    onChange={(e) =>
                                                        setOwner(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="repo">
                                                    Repository Name
                                                </Label>
                                                <Input
                                                    id="repo"
                                                    placeholder="e.g., react"
                                                    value={repo}
                                                    onChange={(e) =>
                                                        setRepo(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    onClick={handleSearch}
                                                    className="w-full md:w-auto flex items-center gap-2"
                                                    disabled={
                                                        !owner.trim() ||
                                                        !repo.trim()
                                                    }
                                                >
                                                    <Search className="h-4 w-4" />
                                                    Analyze Repository
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Loading State */}
                                {isLoading && searchQuery && (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {[...Array(6)].map((_, i) => (
                                            <Card key={i}>
                                                <CardHeader>
                                                    <Skeleton className="h-4 w-[100px]" />
                                                    <Skeleton className="h-8 w-[60px]" />
                                                </CardHeader>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Error State */}
                                {error && searchQuery && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-destructive flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5" />
                                                Error Loading Repository
                                                Analytics
                                            </CardTitle>
                                            <CardDescription>
                                                Unable to load analytics for{" "}
                                                {searchQuery.owner}/
                                                {searchQuery.repo}. Please check
                                                the repository name and try
                                                again.
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                )}

                                {/* Analytics Results */}
                                {profile && searchQuery && !isLoading && (
                                    <div className="space-y-6">
                                        {/* Repository Header */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <GitBranch className="h-5 w-5" />
                                                    {searchQuery.owner}/
                                                    {searchQuery.repo}
                                                </CardTitle>
                                                <CardDescription>
                                                    Repository analytics and
                                                    CI/CD failure patterns
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>

                                        {/* Analytics Content */}
                                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">
                                                        Total Runs
                                                    </CardTitle>
                                                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">
                                                        {profile.total_runs ||
                                                            0}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">
                                                        Success Rate
                                                    </CardTitle>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {profile.success_rate
                                                            ? `${Math.round(
                                                                  profile.success_rate *
                                                                      100
                                                              )}%`
                                                            : "N/A"}
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-sm font-medium">
                                                        Primary Language
                                                    </CardTitle>
                                                    <div className="h-4 w-4" />
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold">
                                                        {profile
                                                            .language_profile
                                                            ?.primary || "N/A"}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Additional Analytics */}
                                        {profile.recommendations &&
                                            profile.recommendations.length >
                                                0 && (
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>
                                                            Recommendations
                                                        </CardTitle>
                                                        <CardDescription>
                                                            AI-generated
                                                            recommendations for
                                                            this repository
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {profile.recommendations.map(
                                                                (
                                                                    recommendation: string,
                                                                    index: number
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-start gap-2"
                                                                    >
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {
                                                                                recommendation
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                    </div>
                                )}

                                {/* No Search Yet */}
                                {!searchQuery && (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center py-8">
                                                <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-2">
                                                    Repository Analytics
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Enter a repository owner and
                                                    name above to get detailed
                                                    CI/CD analytics
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
