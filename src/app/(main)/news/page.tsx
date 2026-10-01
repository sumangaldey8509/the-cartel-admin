"use client"

import Heading from "@/components/common/heading/heading"
import appClient from "@/lib/appClient";
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Calendar, Edit, Eye, Loader2, Trash2, User, Search, AlertTriangle, ThumbsUp, View, FileText, Heart } from "lucide-react";
import DeleteDialog from "@/components/news/DeleteConfirmationModal";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import EditNewsModal from "@/components/news/EditNewsModal";
import ViewNewsModal from "@/components/news/ViewBlogModal";
import { CategoryInterface } from "@/interface/cateogry";
import { useAppSelector } from "@/store/hooks/hooks";
import { RoleInterface } from "@/interface/roles";


export interface TagInterface {
    _id: string;
    name: string;
    color?: string;
    slug?: string;
}

export interface Blog {
    _id: string;
    heading: string;
    subheading: string;
    slug: string;
    author: string;
    description: string;
    excerpt: string;
    image: string;
    category: CategoryInterface;
    tags: Array<{
        _id: string;
        name: string;
        slug: string;
    }>;
    status: string;
    isFeatured: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    sourceUrl?: string | null;
    credibilityScore?: number;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
}

const Page = () => {
    const router = useRouter()
    const [data, setData] = useState<Blog[]>([]);
    const [filteredData, setFilteredData] = useState<Blog[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)

    // Delete dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const observerTarget = useRef<HTMLDivElement>(null);

    const limit = 10

    const authedUser = useAppSelector((state) => state.auth.user)

    const isIntern = authedUser?.role.some(
        (r: RoleInterface) => r.roleCode === "intern"
    )

    const handleGetNews = useCallback(async (pageNum: number, isLoadMore = false) => {
        try {
            setLoading(true);
            const res = await appClient.get("/api/news/get", {
                params: { page: pageNum, limit }
            });

            console.log("API Response:", res.data);

            if (res.data.status && res.data.news) {
                const newsData = res.data.news;
                const newBlogs = newsData.docs || [];

                if (isLoadMore) {
                    setData(prev => [...prev, ...newBlogs]);
                } else {
                    setData(newBlogs);
                }

                setHasMore(newsData.hasNextPage || false);
            }
        } catch (error) {
            console.log("Error while getting news list", error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [limit]);

    // Filter and search functionality
    useEffect(() => {
        let result = data;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(blog =>
                blog.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.subheading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(blog => blog.status === statusFilter);
        }

        // Apply sorting
        result = [...result].sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
        });

        setFilteredData(result);
    }, [data, searchTerm, statusFilter, sortBy]);

    // Initial load
    useEffect(() => {
        if (data.length === 0) {
            setPage(1);
            handleGetNews(1, false);
        }
    }, [handleGetNews, data.length]);

    // Infinite scroll observer
    useEffect(() => {
        if (!hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    handleGetNews(nextPage, true);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, page, handleGetNews]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleButtonClick = () => {
        router.push("/news/create-news")
    }

    const handleEdit = (blog: Blog) => {
        setEditModalOpen(true)
        setSelectedBlog(blog)
    }

    const handleUpdate = () => {
        setPage(1)
        handleGetNews(1, false)
    }

    const handleView = (blog: Blog) => {
        setViewModalOpen(true)
        setSelectedBlog(blog)
    }

    // Delete handlers
    const handleDeleteClick = (blog: Blog) => {
        setBlogToDelete(blog);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = async () => {
        if (!blogToDelete) return;

        const toastId = toastLoading("Deleting News(s)", {
            description: `Removing news(s) from the system`
        })

        let payload = [blogToDelete._id]

        try {
            setIsDeleting(true);
            let res = await appClient.delete("/api/news/delete", {
                params: { ids: JSON.stringify(payload) }
            });
            console.log("delete response", res)
            // Remove from local state
            setData(prev => prev.filter(item => item._id !== blogToDelete._id));

            // Close dialog
            setDeleteDialogOpen(false);
            setBlogToDelete(null);

            // Optional: Show success message
            // You can add a toast notification here
            console.log("Article deleted successfully");

            if (res.data.status) {
                toastUpdate(toastId, "success", "News Deleted", {
                    description: res.data.message || "News Deleted from the system"
                })
                handleGetNews(page, false)
            }

        } catch (error) {
            console.error("Error deleting news:", error);
            alert("Failed to delete news article");
        } finally {
            setIsDeleting(false);
        }
    }

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setBlogToDelete(null);
        setIsDeleting(false);
    }

    const getStatusBadge = (status: string = 'published') => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        if (status === 'published') {
            return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
        } else {
            return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto">
                <Heading
                    heading="News Management"
                    subHeading="Manage and monitor all your news articles in one place."
                    showButton={true}
                    buttonText="Create New Article"
                    onButtonClick={handleButtonClick}
                />
            </div>

            {/* Stats and Filters */}
            <div className="mx-auto mt-6 sm:px-4 md:px-6">
                <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {/* Total Articles */}
                    <div className="bg-[#121212] border border-[#333] rounded-lg p-3 sm:p-4 hover:border-[#bf953f] transition-all duration-300 group cursor-default">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white-800 mb-1">
                                    {data.length}
                                </div>
                                <div className="text-[#C0C0C0] text-xs sm:text-sm lg:text-base">Total Articles</div>
                            </div>

                        </div>
                    </div>

                    {/* Total Likes */}
                    <div className="bg-[#121212] border border-[#333] rounded-lg p-3 sm:p-4 hover:border-[#bf953f] transition-all duration-300 group cursor-default">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1">
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#bf953f] mb-1">
                                    {data.reduce((acc, blog) => acc + (blog.viewsCount || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-[#C0C0C0] text-xs sm:text-sm lg:text-base">Total Likes</div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-[#121212] border border-[#333] rounded-lg p-1 sm:p-2 md:p-4 mb-6 text-sm ">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search articles by title, subtitle, or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white-800 placeholder-[#666] focus:outline-none focus:border-[#bf953f] transition-colors"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-white-800 focus:outline-none focus:border-[#bf953f] transition-colors"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="h-full overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="pb-30 sm:pt-4 md:pt-6 sm:pr-4 md:pr-6 sm:pl-4 md:pl-6 space-y-4"
                    >
                        {/* Initial Loader */}
                        {initialLoad && (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="w-8 h-8 text-[#bf953f] animate-spin" />
                            </div>
                        )}

                        {/* Articles List */}
                        {filteredData.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#121212] border border-[#333] rounded-lg hover:border-[#bf953f] transition-all duration-300 group"
                            >
                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={blog.image}
                                                alt={blog.heading}
                                                className="w-20 h-20 object-cover rounded-lg border border-[#333]"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-white-800 truncate group-hover:text-[#bf953f] transition-colors">
                                                            {blog.heading}
                                                        </h3>
                                                        <span className={getStatusBadge(blog.status)}>
                                                            {blog.status || 'published'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#bf953f] text-sm font-medium mb-1 truncate">
                                                        {blog.subheading}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-[#A8A8A8]">
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            <span>{blog.author}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formatDate(blog.createdAt)}</span>
                                                        </div>
                                                        {blog.viewsCount !== undefined && (
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="w-3 h-3" />
                                                                <span>{blog.viewsCount} views</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        // onClick={() => handleView(blog)}
                                                        onClick={() => router.push(`/news/${blog.slug}`)}
                                                        className="p-2 text-[#C0C0C0] hover:text-white-800 hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                                        title="View Article"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(blog)}
                                                        className="p-2 text-[#C0C0C0] hover:text-[#bf953f] hover:bg-[#1A1A1A] rounded-lg transition-colors"
                                                        title="Edit Article"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        disabled={isIntern}
                                                        onClick={() => handleDeleteClick(blog)}
                                                        className={`p-2 rounded-lg transition-colors
    ${isIntern
                                                                ? "text-gray-500 cursor-not-allowed"
                                                                : "text-[#C0C0C0] hover:text-red-400 hover:bg-[#1A1A1A]"
                                                            }`}
                                                        title="Delete Article"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Loading More Indicator */}
                        {loading && !initialLoad && (
                            <div className="flex justify-center items-center py-6">
                                <Loader2 className="w-6 h-6 text-[#bf953f] animate-spin" />
                                <span className="text-[#C0C0C0] ml-2 text-sm">Loading more articles...</span>
                            </div>
                        )}

                        {/* No More Data Message */}
                        {!hasMore && data.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-[#666] text-sm font-mono">
                                    🎉 You've reached the end of your news articles!
                                </p>
                            </div>
                        )}

                        {/* No Data Message */}
                        {!initialLoad && filteredData.length === 0 && (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-[#666] mx-auto mb-4" />
                                <p className="text-[#C0C0C0] text-lg">
                                    {searchTerm || statusFilter !== 'all' ? 'No articles match your filters' : 'No news articles found'}
                                </p>
                                <p className="text-[#666] text-sm mt-2">
                                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first news article to get started'}
                                </p>
                            </div>
                        )}

                        {/* Observer target for infinite scroll */}
                        <div ref={observerTarget} className="h-4" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                blog={blogToDelete}
                isLoading={isDeleting}
            />

            <EditNewsModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                news={selectedBlog}
                onNewsUpdate={handleUpdate}
            />

        </div>
    )
}

export default Page