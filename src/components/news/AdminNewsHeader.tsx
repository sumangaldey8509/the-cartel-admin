import { Blog } from "@/app/(main)/news/page"
import { Calendar, User, Eye, Heart, MessageCircle, Clock, Tag, Share2, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface AdminNewsHeaderProps {
    newsData: Blog
    likeCount: number
    commentCount: number
}

const AdminNewsHeader = ({ newsData, likeCount, commentCount }: AdminNewsHeaderProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return formatDate(dateString)
    }

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            {/* Featured Image */}
            <div className="relative h-80 md:h-96 overflow-hidden">
                <Image
                    src={newsData.image}
                    alt={newsData.heading}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Admin Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                        <Edit size={16} />
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${newsData.status === 'published'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-black'
                        }`}>
                        {newsData.status}
                    </span>
                    {newsData.isFeatured && (
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                        </span>
                    )}
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold uppercase">
                        {typeof newsData.category === 'object' ? newsData.category.name : 'Crypto'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(newsData.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{getTimeAgo(newsData.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{newsData.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{(newsData.viewsCount || 0).toLocaleString()} views</span>
                    </div>
                </div>

                {/* Title and Subtitle */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {newsData.heading}
                </h1>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    {newsData.subheading}
                </p>

                {/* Excerpt */}
                <div className="bg-gray-800/50 border-l-4 border-yellow-500 p-4 mb-6">
                    <p className="text-gray-300 italic">{newsData.excerpt}</p>
                </div>

                {/* Interaction Stats */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-gray-300">
                            <Heart size={20} className="text-red-400" />
                            <span className="font-semibold">{likeCount}</span>
                            <span className="text-gray-400">Likes</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                            <MessageCircle size={20} className="text-blue-400" />
                            <span className="font-semibold">{commentCount}</span>
                            <span className="text-gray-400">Comments</span>
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminNewsHeader