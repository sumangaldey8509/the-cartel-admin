"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
// import { useSidebarLayout } from "@/contexts/sidebar-layout-context";

const BreadCrumbs = () => {
    const pathname = usePathname() || "";
    const segments = pathname
        .split("/")
        .filter((seg): seg is string => Boolean(seg));


    // const { isSidebarCollapsed } = useSidebarLayout();

    return (
        <div
            className={`transition-all duration-300 h-[24px] pt-1"
                }`}
        >
            <nav className={`text-body5 text-text-heading flex items-center gap-1`}>
                <Home size={16} className="text-gray-400 mb-0.5" fill="#ffffff" />
                {segments.length > 0 &&
                    segments.map((crumb, idx) => {
                        const href = `/${segments.slice(0, idx + 1).join("/")}`;
                        const isLast = idx === segments.length - 1;

                        return (
                            <React.Fragment key={idx}>
                                {idx != 0 && (
                                    <ChevronRight size={16} className="text-gray-400" />
                                )}
                                {isLast ? (
                                    <span className="text-gray-100 capitalize">
                                        {decodeURIComponent(crumb.replace(/-/g, " "))}
                                    </span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="hover:underline text-gray-300 capitalize"
                                    >
                                        {decodeURIComponent(crumb.replace(/-/g, " "))}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
            </nav>
        </div>
    );
};

export default BreadCrumbs;
