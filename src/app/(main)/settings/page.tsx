"use client"

import Heading from "@/components/common/heading/heading"
import { Card } from "@/components/settings/Card"
import {
    Settings,
    FolderTree,
    Users,
    Shield,
    Bell,
    Globe,
    Database,
    LayoutDashboard,
    FileText,
    BriefcaseBusinessIcon
} from "lucide-react"
import { useRouter } from "next/navigation"

const SettingsPage = () => {
    const router = useRouter()

    const settingsModules = [
        {
            id: "news-category",
            title: "Manage News Categories",
            description: "Add, edit, delete, and organize news categories",
            icon: <FolderTree className="h-6 w-6" />,
            path: "/settings/categories",
            available: true
        },
        {
            id: "marketplace-config",
            title: "Marketplace Configuration",
            description: "Configure Marketplace , niches, categories",
            icon: <BriefcaseBusinessIcon className="h-6 w-6" />,
            path: "/settings/marketplace-configuration",
            available: true
        },
        {
            id: "roles-permissions",
            title: "Roles & Permissions",
            description: "Configure user roles and access controls",
            icon: <Shield className="h-6 w-6" />,
            path: "/settings/roles",
            available: true
        },
        {
            id: "user-management",
            title: "User Management",
            description: "Manage admin users and their permissions",
            icon: <Users className="h-6 w-6" />,
            path: "/settings/users",
            available: true
        },
        {
            id: "general",
            title: "General Settings",
            description: "Update site name, logo, and basic configurations",
            icon: <Settings className="h-6 w-6" />,
            path: "/settings/general",
            available: false
        }
    ]

    const handleModuleClick = (module: typeof settingsModules[0]) => {
        if (module.available && module.path) {
            router.push(module.path)
        }
    }

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="Settings"
                    subHeading="Manage your application settings from one place"
                    showButton={false}
                />

                <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {settingsModules.map((module) => (
                            <Card
                                key={module.id}
                                className={`
                  p-4 transition-all duration-200 
                  border border-gray-800
                  ${module.available
                                        ? "cursor-pointer hover:border-white hover:bg-gray-900"
                                        : "opacity-50 cursor-not-allowed"
                                    }
                `}
                                onClick={() => handleModuleClick(module)}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`
                    p-2 rounded-lg 
                    ${module.available
                                            ? "bg-white text-black"
                                            : "bg-gray-800 text-gray-400"
                                        }
                  `}>
                                        {module.icon}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`
                        text-base font-medium truncate
                        ${module.available ? "text-white" : "text-gray-500"}
                      `}>
                                                {module.title}
                                            </h3>
                                            {!module.available && (
                                                <span className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded">
                                                    Soon
                                                </span>
                                            )}
                                        </div>

                                        <p className={`
                      text-sm mt-1 truncate
                      ${module.available ? "text-gray-400" : "text-gray-600"}
                    `}>
                                            {module.description}
                                        </p>

                                        {module.available && (
                                            <div className="mt-3 flex items-center text-white text-xs font-medium">
                                                <span>Manage</span>
                                                <svg
                                                    className="w-3 h-3 ml-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="mt-8">
                    <Card className="p-4 border-gray-800">
                        <div className="flex items-start">
                            <div className="p-2 bg-gray-800 rounded-lg mr-3">
                                <Bell className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white mb-1">
                                    More Features Coming
                                </h3>
                                <p className="text-xs text-gray-400">
                                    Additional settings modules will be available soon.
                                    Check back regularly for updates.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage