"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    User,
    Eye,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Copy,
    CheckCheck,
    Tag,
    Folder,
    Link,
    Star
} from "lucide-react";
import Image from "next/image";

interface Blog {
    _id: string;
    heading: string;
    subheading: string;
    slug: string;
    author: string;
    description: string;
    excerpt: string;
    image: string;
    category: {
        _id: string;
        name: string;
        slug: string;
    };
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

interface ViewNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    blog: Blog | null;
}

const ViewNewsModal = ({ isOpen, onClose, blog }: ViewNewsModalProps) => {
    console.log(blog)
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);

    // Check if description content is overflowing
    useEffect(() => {
        if (descriptionRef.current) {
            const element = descriptionRef.current;
            const isOverflowing = element.scrollHeight > element.clientHeight;
            setIsOverflowing(isOverflowing);
        }
    }, [blog?.description]);

    // Reset states when modal opens/closes
    useEffect(() => {
        if (isOpen && blog) {
            setShowFullDescription(false);
        }
    }, [isOpen, blog]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Function to safely render HTML description
    const renderDescription = (description: string) => {
        return { __html: description };
    };

    if (!blog) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto"
                        onClick={handleBackdropClick}
                    >
                        {/* Modal Container */}
                        <div className="min-h-screen flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
                            >
                                {/* Modal Content */}
                                <div className="bg-[#121212] border-2 border-[#aa771c] rounded-2xl shadow-2xl overflow-hidden metallic-border">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-[#bf953f]/10 to-[#aa771c]/10 border-b-2 border-[#aa771c] p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Eye className="w-6 h-6 text-[#FFD700]" />
                                                <h2 className="text-2xl font-bold text-white font-serif">
                                                    News Details
                                                </h2>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="p-2 hover:bg-[#333] rounded-lg transition-colors text-[#C0C0C0] hover:text-white"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="overflow-y-auto max-h-[70vh]">
                                        <div className="p-6 space-y-6">
                                            {/* Featured Image */}
                                            <div className="relative rounded-xl overflow-hidden border-2 border-[#333]">
                                                <Image
                                                    src={blog.image}
                                                    alt={blog.heading}
                                                    width={800}
                                                    height={400}
                                                    className="w-full h-64 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                {blog.isFeatured && (
                                                    <div className="absolute top-4 left-4">
                                                        <div className="flex items-center space-x-1 bg-[#bf953f] text-black px-3 py-1 rounded-full text-sm font-semibold">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span>Featured</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#bf953f] via-[#FFD700] to-[#aa771c]" />
                                            </div>

                                            {/* Heading with Copy Button */}
                                            <div className="group relative">
                                                <h1 className="text-2xl font-bold text-white pr-12">
                                                    {blog.heading}
                                                </h1>
                                                <button
                                                    onClick={() => copyToClipboard(blog.heading, 'heading')}
                                                    className="absolute top-0 right-0 p-2 text-[#666] hover:text-[#bf953f] transition-colors"
                                                    title="Copy heading"
                                                >
                                                    {copiedField === 'heading' ? (
                                                        <CheckCheck className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Subheading with Copy Button */}
                                            <div className="group relative">
                                                <p className="text-[#bf953f] font-semibold text-lg pr-12">
                                                    {blog.subheading}
                                                </p>
                                                <button
                                                    onClick={() => copyToClipboard(blog.subheading, 'subheading')}
                                                    className="absolute top-0 right-0 p-2 text-[#666] hover:text-[#bf953f] transition-colors"
                                                    title="Copy subheading"
                                                >
                                                    {copiedField === 'subheading' ? (
                                                        <CheckCheck className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Excerpt */}
                                            <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                <p className="text-[#C0C0C0] italic">{blog.excerpt}</p>
                                            </div>

                                            {/* Metadata Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-[#0A0A0A] rounded-lg border border-[#333]">
                                                <div className="flex items-center space-x-3">
                                                    <User className="w-4 h-4 text-[#bf953f]" />
                                                    <div>
                                                        <p className="text-[#666] text-xs">Author</p>
                                                        <p className="text-white text-sm font-medium">{blog.author}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="w-4 h-4 text-[#bf953f]" />
                                                    <div>
                                                        <p className="text-[#666] text-xs">Published</p>
                                                        <p className="text-white text-sm font-medium">
                                                            {formatDate(blog.publishedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Eye className="w-4 h-4 text-[#bf953f]" />
                                                    <div>
                                                        <p className="text-[#666] text-xs">Views</p>
                                                        <p className="text-white text-sm font-medium">
                                                            {blog.viewsCount?.toLocaleString() || '0'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Folder className="w-4 h-4 text-[#bf953f]" />
                                                    <div>
                                                        <p className="text-[#666] text-xs">Category</p>
                                                        <p className="text-white text-sm font-medium capitalize">
                                                            {blog.category?.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        <div className={`w-2 h-2 rounded-full ${blog.status === 'published'
                                                            ? 'bg-green-400'
                                                            : blog.status === 'draft'
                                                                ? 'bg-yellow-400'
                                                                : 'bg-gray-400'
                                                            }`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[#666] text-xs">Status</p>
                                                        <p className="text-white text-sm font-medium capitalize">
                                                            {blog.status}
                                                        </p>
                                                    </div>
                                                </div>
                                                {blog.credibilityScore !== undefined && (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-4 h-4 flex items-center justify-center">
                                                            <div className={`w-2 h-2 rounded-full ${blog.credibilityScore >= 80
                                                                ? 'bg-green-400'
                                                                : blog.credibilityScore >= 60
                                                                    ? 'bg-yellow-400'
                                                                    : 'bg-red-400'
                                                                }`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[#666] text-xs">Credibility</p>
                                                            <p className="text-white text-sm font-medium">
                                                                {blog.credibilityScore}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            {blog.tags && blog.tags.length > 0 && (
                                                <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <Tag className="w-4 h-4 text-[#bf953f]" />
                                                        <span className="text-[#666] text-sm font-medium">Tags</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {blog.tags.map((tag) => (
                                                            <span
                                                                key={tag._id}
                                                                className="px-3 py-1 bg-[#333] text-[#C0C0C0] rounded-full text-sm border border-[#444]"
                                                            >
                                                                #{tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="text-center p-4 bg-[#0A0A0A] border border-[#333] rounded-lg">
                                                    <div className="text-2xl font-bold text-[#bf953f]">
                                                        {blog.viewsCount?.toLocaleString() || '0'}
                                                    </div>
                                                    <div className="text-[#666] text-sm mt-1">Views</div>
                                                </div>
                                                <div className="text-center p-4 bg-[#0A0A0A] border border-[#333] rounded-lg">
                                                    <div className="text-2xl font-bold text-[#bf953f]">
                                                        {blog.likesCount?.toLocaleString() || '0'}
                                                    </div>
                                                    <div className="text-[#666] text-sm mt-1">Likes</div>
                                                </div>
                                                <div className="text-center p-4 bg-[#0A0A0A] border border-[#333] rounded-lg">
                                                    <div className="text-2xl font-bold text-[#bf953f]">
                                                        {blog.commentsCount?.toLocaleString() || '0'}
                                                    </div>
                                                    <div className="text-[#666] text-sm mt-1">Comments</div>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="border-2 border-[#333] rounded-lg bg-[#0A0A0A] overflow-hidden">
                                                <div className="border-b border-[#333] bg-[#121212] p-4">
                                                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                                        <span>Article Content</span>
                                                        <ExternalLink className="w-4 h-4 text-[#666]" />
                                                    </h3>
                                                </div>

                                                <div className="relative">
                                                    <div
                                                        ref={descriptionRef}
                                                        className={`p-6 prose prose-invert max-w-none text-[#C0C0C0] 
                                                            ${!showFullDescription ? 'max-h-96 overflow-hidden' : ''}
                                                            [&_a]:text-[#bf953f] [&_a]:underline
                                                            [&_strong]:text-white [&_strong]:font-bold
                                                            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-6
                                                            [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-5
                                                            [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-4
                                                            [&_p]:mb-4 [&_p:last-child]:mb-0
                                                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:list-style-position:inside !important
                                                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:list-style-position:inside !important
                                                            [&_li]:mb-2 [&_li]:text-[#C0C0C0]`}
                                                        dangerouslySetInnerHTML={renderDescription(blog.description)}
                                                    />

                                                    {/* Gradient overlay for truncated content */}
                                                    {!showFullDescription && isOverflowing && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                                                    )}
                                                </div>

                                                {/* See More/Less Button */}
                                                {isOverflowing && (
                                                    <div className="border-t border-[#333] p-4 bg-[#121212]">
                                                        <button
                                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                                            className="flex items-center space-x-2 text-[#bf953f] hover:text-[#FFD700] transition-colors font-medium mx-auto"
                                                        >
                                                            <span>
                                                                {showFullDescription ? 'Show Less' : 'See More'}
                                                            </span>
                                                            {showFullDescription ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* SEO & Additional Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {blog.metaTitle && (
                                                    <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                        <h4 className="text-[#bf953f] text-sm font-semibold mb-2">Meta Title</h4>
                                                        <p className="text-[#C0C0C0] text-sm">{blog.metaTitle}</p>
                                                    </div>
                                                )}
                                                {blog.metaDescription && (
                                                    <div className="bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                        <h4 className="text-[#bf953f] text-sm font-semibold mb-2">Meta Description</h4>
                                                        <p className="text-[#C0C0C0] text-sm">{blog.metaDescription}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* URLs */}
                                            <div className="space-y-3">
                                                {blog.canonicalUrl && (
                                                    <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                            <Link className="w-4 h-4 text-[#bf953f] flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[#666] text-xs mb-1">Canonical URL</p>
                                                                <p className="text-[#C0C0C0] text-sm truncate">{blog.canonicalUrl}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(blog.canonicalUrl!, 'canonical')}
                                                            className="p-2 text-[#666] hover:text-[#bf953f] transition-colors flex-shrink-0"
                                                            title="Copy URL"
                                                        >
                                                            {copiedField === 'canonical' ? (
                                                                <CheckCheck className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                                {blog.sourceUrl && (
                                                    <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#333] rounded-lg p-4">
                                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                            <ExternalLink className="w-4 h-4 text-[#bf953f] flex-shrink-0" />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[#666] text-xs mb-1">Source URL</p>
                                                                <p className="text-[#C0C0C0] text-sm truncate">{blog.sourceUrl}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(blog.sourceUrl!, 'source')}
                                                            className="p-2 text-[#666] hover:text-[#bf953f] transition-colors flex-shrink-0"
                                                            title="Copy URL"
                                                        >
                                                            {copiedField === 'source' ? (
                                                                <CheckCheck className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="border-t border-[#333] bg-[#121212] p-4">
                                        <div className="flex items-center justify-between text-sm text-[#666]">
                                            <span>Last updated: {formatDate(blog.updatedAt)}</span>
                                            <span className="font-mono">ID: {blog._id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <style jsx>{`
                        .metallic-border {
                            background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
                            box-shadow: 
                                0 0 30px rgba(191, 149, 63, 0.1),
                                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                                inset 0 -1px 0 rgba(0, 0, 0, 0.5);
                        }

                        /* Custom scrollbar */
                        .overflow-y-auto::-webkit-scrollbar {
                            width: 8px;
                        }
                        
                        .overflow-y-auto::-webkit-scrollbar-track {
                            background: #1a1a1a;
                            border-radius: 0 0 12px 0;
                        }
                        
                        .overflow-y-auto::-webkit-scrollbar-thumb {
                            background: #bf953f;
                            border-radius: 4px;
                        }
                        
                        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                            background: #FFD700;
                        }

                        /* Prose styles for description */
                        .prose {
                            line-height: 1.6;
                        }
                        
                        .prose p {
                            margin-bottom: 1rem;
                        }
                        
                        .prose strong {
                            color: white;
                            font-weight: 600;
                        }
                        
                        .prose a {
                            color: #bf953f;
                            text-decoration: underline;
                        }
                        
                        .prose a:hover {
                            color: #FFD700;
                        }

                        /* Force list styles */
                        .prose ul {
                            list-style-type: disc !important;
                            list-style-position: inside !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1rem !important;
                        }

                        .prose ol {
                            list-style-type: decimal !important;
                            list-style-position: inside !important;
                            padding-left: 1.5rem !important;
                            margin-bottom: 1rem !important;
                        }

                        .prose li {
                            margin-bottom: 0.5rem !important;
                            color: #C0C0C0 !important;
                        }
                    `}</style>
                </>
            )}
        </AnimatePresence>
    );
};

export default ViewNewsModal;