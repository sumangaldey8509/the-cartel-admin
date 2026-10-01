import { Blog } from "@/app/(main)/news/page"
import { Tag } from "lucide-react"

interface AdminNewsContentProps {
    newsData: Blog
}

const AdminNewsContent = ({ newsData }: AdminNewsContentProps) => {
    return (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 md:p-8">
            {/* Article Body */}
            <div
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed mb-8
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-6
                    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-5
                    [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-4
                    [&_p]:mb-4 [&_p]:leading-relaxed
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:list-style-position:inside
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:list-style-position:inside
                    [&_li]:mb-2 [&_li]:text-gray-300"
                dangerouslySetInnerHTML={{ __html: newsData.description }}
            />

            {/* Tags */}
            {newsData.tags && newsData.tags.length > 0 && (
                <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Tag size={18} className="text-yellow-500" />
                        <h3 className="text-lg font-semibold text-white">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {newsData.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                            >
                                #{typeof tag === 'object' ? tag.name : `Tag ${index + 1}`}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* SEO Information */}
            <div className="border-t border-gray-800 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">SEO Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newsData.metaTitle && (
                        <div className="bg-gray-800/30 p-4 rounded-lg">
                            <h4 className="text-yellow-500 text-sm font-semibold mb-2">Meta Title</h4>
                            <p className="text-gray-300 text-sm">{newsData.metaTitle}</p>
                        </div>
                    )}
                    {newsData.metaDescription && (
                        <div className="bg-gray-800/30 p-4 rounded-lg">
                            <h4 className="text-yellow-500 text-sm font-semibold mb-2">Meta Description</h4>
                            <p className="text-gray-300 text-sm">{newsData.metaDescription}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminNewsContent