"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Zap,
    RefreshCw,
    Play,
    Search,
    Settings,
    Download,
    Upload,
    TestTube,
} from "lucide-react";

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    action: () => void;
    variant: "default" | "destructive" | "outline" | "secondary";
    badge?: string;
}

export function QuickActionsPanel() {
    const quickActions: QuickAction[] = [
        {
            id: "manual-scan",
            title: "Manual Repository Scan",
            description: "Trigger immediate scan for new failures",
            icon: Search,
            action: () => {
                console.log("Triggering manual scan...");
                // In real app: api.triggerManualScan()
            },
            variant: "default",
            badge: "Instant",
        },
        {
            id: "force-refresh",
            title: "Force Data Refresh",
            description: "Refresh all dashboard data",
            icon: RefreshCw,
            action: () => {
                window.location.reload();
            },
            variant: "outline",
        },
        {
            id: "test-webhook",
            title: "Test Webhook",
            description: "Send test webhook to verify connectivity",
            icon: TestTube,
            action: () => {
                console.log("Testing webhook...");
                // In real app: api.testWebhook()
            },
            variant: "secondary",
            badge: "Test",
        },
        {
            id: "run-gemini",
            title: "Force Gemini Analysis",
            description: "Manually trigger AI analysis on pending failures",
            icon: Zap,
            action: () => {
                console.log("Forcing Gemini analysis...");
                // In real app: api.forceGeminiAnalysis()
            },
            variant: "default",
            badge: "AI",
        },
        {
            id: "export-data",
            title: "Export Analytics",
            description: "Download failure and fix analytics as CSV",
            icon: Download,
            action: () => {
                console.log("Exporting analytics...");
                // In real app: api.exportAnalytics()
            },
            variant: "outline",
        },
        {
            id: "configure",
            title: "System Configuration",
            description: "Configure agent settings and thresholds",
            icon: Settings,
            action: () => {
                console.log("Opening configuration...");
                // In real app: router.push('/settings')
            },
            variant: "secondary",
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Quick Actions
                </CardTitle>
                <CardDescription>
                    Common actions and manual triggers for the CI/CD fixer agent
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Button
                                key={action.id}
                                variant={action.variant}
                                className="h-auto p-4 justify-start"
                                onClick={action.action}
                            >
                                <div className="flex items-start gap-3 text-left">
                                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-sm">
                                                {action.title}
                                            </p>
                                            {action.badge && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {action.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground opacity-90">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
