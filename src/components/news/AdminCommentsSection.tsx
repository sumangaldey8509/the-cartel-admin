import { MessageCircle, User, Trash2, Flag, Search } from "lucide-react"
import { Comment } from "@/interface/news"
import { useState } from "react"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"

interface AdminCommentsSectionProps {
    comments: Comment[]
    commentCount: number
    newsId: string
}

const AdminCommentsSection = ({ comments, commentCount, newsId }: AdminCommentsSectionProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedComment, setSelectedComment] = useState<string | null>(null)

    const filteredComments = comments.filter(comment =>
        comment.commentText.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInMinutes < 1) return 'Just now'
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInDays < 7) return `${diffInDays}d ago`
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getAnonymousName = (anonymousId: string) => {
        const hash = anonymousId.split('-')[1]?.split('#')[0] || '000'
        return `User${parseInt(hash) % 1000}`
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        try {
            await deleteDoc(doc(db, "newsComments", commentId))
        } catch (error) {
            console.error("Error deleting comment:", error)
            alert('Failed to delete comment')
        }
    }

    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-white">
                        Comments ({commentCount})
                    </h2>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search comments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 w-64"
                    />
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredComments.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">
                            {searchTerm ? 'No comments match your search' : 'No comments yet'}
                        </p>
                    </div>
                ) : (
                    filteredComments.map((comment) => (
                        <div
                            key={comment.commentId}
                            className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/30 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={16} className="text-yellow-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-white font-semibold text-sm">
                                                {comment.anonymousId
                                                    ? getAnonymousName(comment.anonymousId)
                                                    : 'Anonymous'
                                                }
                                            </span>
                                            <span className="text-gray-500 text-xs">•</span>
                                            <span className="text-gray-500 text-xs">
                                                {getTimeAgo(comment.createdAt)}
                                            </span>
                                            <span className="text-gray-500 text-xs">•</span>
                                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                                ID: {comment.commentId.slice(-8)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {comment.commentText}
                                        </p>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Comment"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                                        title="Report Comment"
                                    >
                                        <Flag size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default AdminCommentsSection