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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixes } from "@/hooks/use-api";
import { Check, X } from "lucide-react";

export default function FixesPage() {
    const { fixes, isLoading, error } = useFixes();

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
                                    <Card>
                                        <CardHeader>
                                            <Skeleton className="h-8 w-[200px]" />
                                            <Skeleton className="h-4 w-[400px]" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {[...Array(3)].map((_, i) => (
                                                    <Skeleton
                                                        key={i}
                                                        className="h-24 w-full"
                                                    />
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        );
    }

    if (error) {
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
                                                Error Loading Fixes
                                            </CardTitle>
                                            <CardDescription>
                                                Unable to load AI-generated
                                                fixes from the backend API
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
                                        <CardTitle>
                                            AI-Generated Fixes
                                        </CardTitle>
                                        <CardDescription>
                                            Review and manage AI-generated fixes
                                            for workflow failures
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {fixes && fixes.length > 0 ? (
                                            <div className="space-y-4">
                                                {fixes.map((fix) => (
                                                    <Card
                                                        key={fix.id}
                                                        className="border-l-4 border-l-blue-500"
                                                    >
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <CardTitle className="text-base">
                                                                        Fix #
                                                                        {fix.id}
                                                                    </CardTitle>
                                                                    <Badge
                                                                        variant={
                                                                            fix.status ===
                                                                            "approved"
                                                                                ? "default"
                                                                                : fix.status ===
                                                                                  "rejected"
                                                                                ? "destructive"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {
                                                                            fix.status
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        Confidence:{" "}
                                                                        {fix.confidence_score
                                                                            ? `${Math.round(
                                                                                  fix.confidence_score *
                                                                                      100
                                                                              )}%`
                                                                            : "N/A"}
                                                                    </Badge>
                                                                    {fix.fix_complexity && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs"
                                                                        >
                                                                            {
                                                                                fix.fix_complexity
                                                                            }
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <CardDescription className="flex items-center gap-2">
                                                                <span>
                                                                    {
                                                                        fix.repository
                                                                    }
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    Generated{" "}
                                                                    {new Date(
                                                                        fix.created_at
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <h4 className="font-medium text-sm mb-1">
                                                                        Description
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {fix.description ||
                                                                            "No description available"}
                                                                    </p>
                                                                </div>

                                                                {fix.status ===
                                                                    "pending_approval" && (
                                                                    <div className="flex gap-2 pt-2">
                                                                        <Button
                                                                            size="sm"
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <Check className="h-3 w-3" />
                                                                            Approve
                                                                        </Button>
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="flex items-center gap-1"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">
                                                    No fixes available
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
