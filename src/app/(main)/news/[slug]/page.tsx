"use client"

import appClient from "@/lib/appClient"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Comment } from "@/interface/news"
// import AdminNewsHeader from "./components/AdminNewsHeader"
// import AdminNewsContent from "./components/AdminNewsContent"
// import AdminNewsSidebar from "./components/AdminNewsSidebar"
// import AdminCommentsSection from "./components/AdminCommentsSection"
import { collection, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebaseConfig"
import { Blog } from "../page"
import AdminNewsHeader from "@/components/news/AdminNewsHeader"
import AdminNewsContent from "@/components/news/AdminNewsContent"
import AdminCommentsSection from "@/components/news/AdminCommentsSection"
import AdminNewsSidebar from "@/components/news/AdminNewsSidebar"

const AdminNewsDetailPage = () => {
    const pathName = usePathname()
    const router = useRouter()
    const slug = pathName.split('/').filter(Boolean).pop()

    const [newsData, setNewsData] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [likeCount, setLikeCount] = useState(0)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentCount, setCommentCount] = useState(0)

    const handleGetNews = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await appClient.get("/api/news/slug", {
                params: { slug }
            })
            console.log(response)
            if (response.data.status && response.data.existingNews) {
                setNewsData(response.data.existingNews)
                setLikeCount(response.data.existingNews.likesCount || 0)
            } else {
                setError("News article not found")
            }
        } catch (error) {
            console.error("Error fetching news:", error)
            setError("Failed to load news article. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (slug) {
            handleGetNews()
        }
    }, [slug])

    // Real-time comments listener
    useEffect(() => {
        if (!newsData?._id) return

        const q = query(collection(db, "newsComments"), where("newsId", "==", newsData?._id))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list: Comment[] = []
            snapshot.forEach((doc) => list.push(doc.data() as Comment))
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setComments(list)
            setCommentCount(list.length)
        })

        return () => unsubscribe()
    }, [newsData])

    // Real-time likes listener
    useEffect(() => {
        if (!newsData?._id) return

        const ref = doc(db, "newsLike", newsData._id)
        const unsubscribe = onSnapshot(ref, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data()
                setLikeCount(data.likeCount || 0)
            } else {
                setLikeCount(0)
            }
        })

        return () => unsubscribe()
    }, [newsData])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto" />
                    <p className="text-gray-400 text-lg">Loading news article...</p>
                </div>
            </div>
        )
    }

    if (error || !newsData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-white">Article Not Found</h1>
                    <p className="text-gray-400">{error || "The news article you're looking for doesn't exist."}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors mx-auto"
                        >
                            <ArrowLeft size={20} />
                            <span>Go Back</span>
                        </button>
                        <Link
                            href="/admin/news"
                            className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                        >
                            Back to News Management
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a]">
            {/* Back Navigation */}
            <div className="border-b border-gray-800 bg-[#0A0A0A]/50">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to News Management</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Article Header & Content */}
                        <AdminNewsHeader
                            newsData={newsData}
                            likeCount={likeCount}
                            commentCount={commentCount}
                        />

                        {/* Article Content */}
                        <AdminNewsContent newsData={newsData} />

                        {/* Comments Section */}
                        <AdminCommentsSection
                            comments={comments}
                            commentCount={commentCount}
                            newsId={newsData._id}
                        />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <AdminNewsSidebar
                            newsData={newsData}
                            likeCount={likeCount}
                            commentCount={commentCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminNewsDetailPage