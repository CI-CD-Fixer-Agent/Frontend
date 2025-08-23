"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    RefreshCw,
    CheckCircle,
    AlertCircle,
    XCircle,
    Server,
    Database,
    Bot,
} from "lucide-react";
import { useHealth } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

export function SystemStatusBanner() {
    const { health, isLoading, error, refresh, isHealthy } = useHealth();

    const getServiceIcon = (service: string) => {
        switch (service) {
            case "database":
                return <Database className="h-4 w-4 text-blue-600" />;
            case "github_api":
                return <Server className="h-4 w-4 text-gray-700" />;
            case "gemini_api":
                return <Bot className="h-4 w-4 text-purple-600" />;
            default:
                return <CheckCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getServiceStatus = (status: string) => {
        switch (status) {
            case "connected":
            case "available":
            case "healthy":
                return (
                    <Badge
                        variant="outline"
                        className="border-green-500 text-green-700 bg-green-50 text-xs"
                    >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                    </Badge>
                );
            case "degraded":
                return (
                    <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-700 bg-yellow-50 text-xs"
                    >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Degraded
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="outline"
                        className="border-red-500 text-red-700 bg-red-50 text-xs"
                    >
                        <XCircle className="h-3 w-3 mr-1" />
                        Offline
                    </Badge>
                );
        }
    };

    if (isLoading) {
        return (
            <Card className="mb-4">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                            Checking system status...
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                "mb-4",
                isHealthy
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Overall status */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {isHealthy ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="font-medium text-sm">
                                System Status:
                            </span>
                            <Badge
                                variant={isHealthy ? "outline" : "destructive"}
                                className={
                                    isHealthy
                                        ? "border-green-500 text-green-700 bg-green-50"
                                        : ""
                                }
                            >
                                {health?.status || "Unknown"}
                            </Badge>
                        </div>
                    </div>

                    {/* Right side - Refresh button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => refresh()}
                        disabled={isLoading}
                        className="gap-2 hover:bg-white/50"
                    >
                        <RefreshCw
                            className={cn(
                                "h-4 w-4",
                                isLoading && "animate-spin"
                            )}
                        />
                        Refresh
                    </Button>
                </div>

                {/* Services status - organized in a grid */}
                {health?.services && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(health.services).map(
                                ([service, status]) => (
                                    <div
                                        key={service}
                                        className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-2">
                                            {getServiceIcon(service)}
                                            <span className="text-sm font-medium capitalize">
                                                {service === "github_api"
                                                    ? "GitHub API"
                                                    : service === "gemini_api"
                                                    ? "Gemini AI"
                                                    : service === "database"
                                                    ? "Database"
                                                    : service.replace("_", " ")}
                                            </span>
                                        </div>
                                        {getServiceStatus(status as string)}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
