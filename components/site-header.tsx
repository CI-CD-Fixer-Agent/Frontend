import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-sm sm:text-base font-medium truncate">
                    Documents
                </h1>
                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        asChild
                        size="sm"
                        className="hidden sm:flex"
                    >
                        <a
                            href="https://github.com/CI-CD-Fixer-Agent/Frontend"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
