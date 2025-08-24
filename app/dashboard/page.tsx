import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { FailuresTableEnhanced } from "@/components/failures-table-enhanced";
import { PendingFixesComponent } from "@/components/pending-fixes";
import { RealTimeAnalytics } from "@/components/real-time-analytics";
import { AIAgentStatus } from "@/components/ai-agent-status";
import { LiveWorkflowMonitor } from "@/components/live-workflow-monitor";
import { QuickActionsPanel } from "@/components/quick-actions-panel";
import { SectionCards } from "@/components/section-cards";
import { SystemStatusBanner } from "@/components/system-status-banner";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
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
                <div className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:p-6 bg-background dark:bg-gray-950/30">
                    <SystemStatusBanner />
                    <RealTimeAnalytics />

                    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                        <AIAgentStatus />
                        <LiveWorkflowMonitor />
                    </div>

                    <SectionCards />

                    <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
                        <FailuresTableEnhanced />
                        <PendingFixesComponent />
                    </div>

                    <QuickActionsPanel />

                    <ChartAreaInteractive />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
