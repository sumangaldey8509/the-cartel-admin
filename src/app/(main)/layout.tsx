"use client";

import BreadCrumbs from "@/components/common/breadcrumbs/bread-crumbs";
import Sidebar from "@/components/common/sidebar/sidebar";
import { PermissionProvider } from "@/providers/PermissionProvider";
import { RouteGuard } from "@/components/common/ProtectedRoute";

export default function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <PermissionProvider>
            <RouteGuard>
                <div className="flex h-screen overflow-hidden">
                    {/* Sidebar: fixed height, scrollable if needed */}
                    <div className="h-full">
                        <Sidebar />
                    </div>

                    {/* Main content: scrollable independently */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a]">
                        {/* Sticky breadcrumbs with subtle bottom border */}
                        {
                            <header className="sticky top-0 z-10 bg-primary">
                                <div className="px-4 pt-4 pb-2">
                                    <BreadCrumbs />
                                </div>
                            </header>
                        }

                        {/* Scrollable content area */}
                        <main className="flex-1 overflow-y-auto bg-primary">
                            {children}
                        </main>
                    </div>
                </div>
            </RouteGuard>
        </PermissionProvider>
    );
}
