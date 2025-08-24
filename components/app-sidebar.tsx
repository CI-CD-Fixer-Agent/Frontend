"use client";

import * as React from "react";
import {
    IconBrain,
    IconBug,
    IconChartBar,
    IconDashboard,
    IconGitBranch,
    IconFileAi,
    IconRobot,
    IconFolder,
    IconHelp,
    IconSettings,
    IconSearch,
    IconActivity,
    IconShield,
    IconCode,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "CI/CD Agent",
        email: "agent@cicd-fixer.com",
        avatar: "/avatars/ai-agent.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Failures",
            url: "/failures",
            icon: IconBug,
        },
        {
            title: "Fixes",
            url: "/fixes",
            icon: IconFileAi,
        },
        {
            title: "Analytics",
            url: "/analytics",
            icon: IconChartBar,
        },
        {
            title: "Repository",
            url: "/repository",
            icon: IconFolder,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "/settings",
            icon: IconSettings,
        },
        {
            title: "Documentation",
            url: "/docs",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "/search",
            icon: IconSearch,
        },
    ],
    documents: [
        {
            name: "GitHub Integration",
            url: "/integrations/github",
            icon: IconGitBranch,
        },
        {
            name: "AI Agent Status",
            url: "/agent/status",
            icon: IconRobot,
        },
        {
            name: "Code Analysis",
            url: "/analysis/code",
            icon: IconCode,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="/dashboard">
                                <IconRobot className="!size-5" />
                                <span className="text-base font-semibold">
                                    CI/CD Fixer Agent
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
