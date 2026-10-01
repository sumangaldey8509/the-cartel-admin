"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import appClient from "@/lib/appClient";
import { useAppSelector } from "@/store/hooks/hooks";
import { Coins, GitPullRequest, Home, Newspaper, Settings, Users, Server } from "lucide-react";
import { usePermissions } from "@/providers/PermissionProvider";
import { getAllSidebarItems } from "@/utils/permissions/permissionUtils";

interface UserProfile {
    name: string;
    email: string;
    role: string;
    avatar: string;
}

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const authedUser = useAppSelector((state) => state.auth.user)
    // Check if we're on mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    // Mock user data
    const user: UserProfile = {
        name: "Admin User",
        email: "admin@thecoincartel.com",
        role: "Administrator",
        avatar: "/assets/cat_avatar.png",
    };

    const { permissions, isEmployee } = usePermissions();
    // Get all sidebar items with permission status
    const allSidebarItems = getAllSidebarItems(permissions);
    // Icon mapping
    const getIcon = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            Home: <Home size={18} />,
            Coins: <Coins size={18} />,
            Users: <Users size={18} />,
            Newspaper: <Newspaper size={18} />,
            GitPullRequest: <GitPullRequest size={18} />,
            Server: <Server size={18} />,
            Settings: <Settings size={18} />,
        };
        return icons[iconName] || <Home size={18} />;
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = async () => {
        setLoading(true)
        try {
            const res = await appClient.post('/api/auth/logout', {})

            if (res.data.status) {
                router.replace("/auth/signin")
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
        }
    };

    // Helper function to check if a menu item is active
    const isItemActive = (itemHref: string) => {
        // Check if current path is exactly the item href
        if (pathname === itemHref) {
            return true;
        }

        // Check if current path starts with item href followed by "/"
        // This covers all subpages like /settings/categories, /news/article, etc.
        if (pathname.startsWith(itemHref + "/")) {
            return true;
        }

        return false;
    };

    return (
        <>
            {/* Mobile menu button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 right-4 z-50 p-2 rounded-md bg-[#121212] text-[#bf953f] border border-[#aa771c] shadow-lg md:hidden"
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-[#0A0A0A] border-r border-[#333] z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:relative md:z-0 w-64 flex-shrink-0 overflow-hidden`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and portal name */}
                    <div className="flex items-center justify-center p-2 border-b border-[#333]">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/assets/logo_svg.png"
                                    alt="The Cartel"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-[#bf953f] to-[#aa771c] bg-clip-text text-transparent">
                                The Cartel
                            </span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
                        <ul className="space-y-2 w-full">
                            {allSidebarItems
                                .filter((item) => item.isAccessible)
                                .map((item) => {
                                    const isActive = isItemActive(item.href);

                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                                    ? "bg-gradient-to-r from-[#8B0000] to-[#700000] text-white shadow-lg"
                                                    : "text-[#C0C0C0] hover:bg-[#121212] hover:text-white"
                                                    }`}
                                            >
                                                <span className={`mr-3 ${isActive ? "text-[#FFD700]" : "text-[#bf953f]"}`}>
                                                    {getIcon(item.icon)}
                                                </span>
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                        </ul>
                    </nav>

                    {/* Profile Section with Sign Out - Moved to bottom */}
                    <div className="p-4 border-t border-[#333]">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#bf953f]">
                                    <Image
                                        src={user.avatar || "/assets/default-avatar.png"}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-[#C0C0C0] truncate">{authedUser?.email}</p>

                                </div>
                            </div>
                        </div>

                        {/* Additional sign out button for better mobile accessibility */}
                        <button
                            onClick={handleSignOut}
                            className="cursor-pointer w-full flex items-center justify-center py-2 px-4 text-sm bg-opacity-20 text-[#C0C0C0] hover:text-white hover:bg-opacity-30 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {loading ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;