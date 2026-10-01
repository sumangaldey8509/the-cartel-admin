import { Blog } from "@/app/(main)/news/page"
import { BarChart3, Users, MessageSquare, Eye, Calendar, Edit, Settings } from "lucide-react"

interface AdminNewsSidebarProps {
    newsData: Blog
    likeCount: number
    commentCount: number
}

const AdminNewsSidebar = ({ newsData, likeCount, commentCount }: AdminNewsSidebarProps) => {
    const stats = [
        {
            icon: Eye,
            label: "Total Views",
            value: newsData.viewsCount?.toLocaleString() || "0",
            color: "text-blue-400"
        },
        {
            icon: Users,
            label: "Likes",
            value: likeCount.toLocaleString(),
            color: "text-red-400"
        },
        {
            icon: MessageSquare,
            label: "Comments",
            value: commentCount.toLocaleString(),
            color: "text-green-400"
        }
    ]

    const quickActions = [
        {
            icon: Edit,
            label: "Edit Article",
            action: () => console.log("Edit article"),
            color: "text-blue-400 hover:bg-blue-500/10"
        },
        {
            icon: BarChart3,
            label: "View Analytics",
            action: () => console.log("View analytics"),
            color: "text-green-400 hover:bg-green-500/10"
        },
        {
            icon: Settings,
            label: "Article Settings",
            action: () => console.log("Article settings"),
            color: "text-yellow-400 hover:bg-yellow-500/10"
        }
    ]

    return (
        <div className="sticky top-24 space-y-6">
            {/* Stats Overview */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <BarChart3 size={20} className="text-yellow-500" />
                    <span>Performance</span>
                </h3>
                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <stat.icon size={18} className={stat.color} />
                                <span className="text-gray-300 text-sm">{stat.label}</span>
                            </div>
                            <span className="text-white font-semibold">{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${action.color} border border-gray-700 hover:border-current`}
                        >
                            <action.icon size={18} />
                            <span className="text-sm font-medium">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Article Information */}
            <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Article Info</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={`font-semibold ${newsData.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                            {newsData.status}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Featured</span>
                        <span className={newsData.isFeatured ? "text-yellow-400 font-semibold" : "text-gray-400"}>
                            {newsData.isFeatured ? "Yes" : "No"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="text-gray-300">
                            {new Date(newsData.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Updated</span>
                        <span className="text-gray-300">
                            {new Date(newsData.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                    {newsData.credibilityScore && (
                        <div className="flex justify-between">
                            <span className="text-gray-400">Credibility</span>
                            <span className={`font-semibold ${newsData.credibilityScore >= 80 ? 'text-green-400' :
                                newsData.credibilityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {newsData.credibilityScore}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminNewsSidebar