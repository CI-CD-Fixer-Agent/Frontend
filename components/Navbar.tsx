"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Analytics", href: "/repository" },
    { name: "Failures", href: "/failures" },
];

export function Navbar() {
    const pathname = usePathname();

    const isActiveRoute = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="flex items-center justify-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="group size-8 md:hidden"
                                variant="ghost"
                                size="icon"
                            >
                                <svg
                                    className="pointer-events-none"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4 12L20 12"
                                        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                    />
                                    <path
                                        d="M4 12H20"
                                        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                    />
                                </svg>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            className="w-56 p-2 md:hidden"
                        >
                            <NavigationMenu className="max-w-none">
                                <NavigationMenuList className="flex-col items-start space-y-1">
                                    {navigationItems.map((link, index) => (
                                        <NavigationMenuItem
                                            key={index}
                                            className="w-full"
                                        >
                                            <NavigationMenuLink
                                                href={link.href}
                                                active={isActiveRoute(
                                                    link.href
                                                )}
                                                className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    isActiveRoute(link.href)
                                                        ? "bg-accent text-accent-foreground"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                                }`}
                                            >
                                                {link.name}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </PopoverContent>
                    </Popover>

                    <Link href="/" className="flex items-center gap-2">
                        <Bot className="size-6 mb-1" />
                        <span className="hidden font-bold sm:inline-block">
                            CI/CD Fixer Agent
                        </span>
                    </Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                    <NavigationMenu>
                        <NavigationMenuList className="flex items-center space-x-1">
                            {navigationItems.map((link, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        href={link.href}
                                        active={isActiveRoute(link.href)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
                                            isActiveRoute(link.href)
                                                ? "bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-200/30 dark:border-blue-800/30"
                                                : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-slate-50/50 dark:hover:from-blue-950/20 dark:hover:to-slate-950/20 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Shimmer effect for active link */}
                                        {isActiveRoute(link.href) && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full animate-pulse rounded-lg" />
                                        )}
                                        <span className="relative z-10">
                                            {link.name}
                                        </span>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    <ThemeToggle />
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-emerald-600 to-indigo-600 hover:from-blue-500 hover:via-emerald-500 hover:to-indigo-500 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                        <span className="relative z-10">Get Started</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
