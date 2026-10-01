// components/news/EditNewsModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Image as ImageIcon,
    User,
    Type,
    Heading,
    FileText,
    Send,
    Sparkles,
    X,
    Edit,
    Tag,
    FolderOpen,
    Star,
    Link as LinkIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Save
} from "lucide-react";
import appClient from "@/lib/appClient";
import { useAppSelector } from "@/store/hooks/hooks";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/news/ImageUpload";
import CategorySelector from "@/components/news/CategorySelector";
import TagsSelector from "@/components/news/TagsSelector";
import EditorToolbar from "@/components/news/EditorToolbar";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import { uploadToCloudinary } from "@/cloudionary/uploadNewsPhoto";
import { Blog, TagInterface } from "@/app/(main)/news/page";
import { CategoryInterface } from "@/interface/cateogry";


interface EditNewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    news: Blog | null;
    onNewsUpdate?: (updatedNews: Blog) => void;
}

const EditNewsModal: React.FC<EditNewsModalProps> = ({
    isOpen,
    onClose,
    news,
    onNewsUpdate
}) => {
    const user = useAppSelector((state) => state.auth.user);

    // Form state
    const [formData, setFormData] = useState({
        heading: "",
        subheading: "",
        author: "",
        category: "",
        tags: [] as string[],
        isFeatured: false,
        createdBy: user?._id,
    });

    const [selectedCategory, setSelectedCategory] = useState<CategoryInterface | null>(news?.category || null)

    useEffect(() => {
        if (news) {
            setSelectedCategory(news?.category)
        }
    }, [news])

    // Image state
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

    // Data state
    const [tags, setTags] = useState<TagInterface[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState({ categories: false, tags: false });

    // Editor
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#bf953f] underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
        ],
        content: "<p>Loading news content...</p>",
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-[#C0C0C0]",
            },
        },
    });

    // Load categories and tags
    useEffect(() => {
        if (isOpen) {
            handleGetTagsData();
        }
    }, [isOpen]);

    // Initialize form with news data
    useEffect(() => {
        if (news && isOpen) {
            // Set form data
            setFormData({
                heading: news.heading || "",
                subheading: news.subheading || "",
                author: news.author || "",
                category: typeof news.category === 'string' ? news.category : news.category?.name || "",
                tags: Array.isArray(news.tags)
                    ? news.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
                    : [],
                isFeatured: news.isFeatured || false,
                createdBy: user?._id
            });

            // Set image preview
            setCurrentImageUrl(news.image || "");
            setImagePreview(news.image || "");

            // Set editor content
            if (editor && news.description) {
                editor.commands.setContent(news.description);
            }
        }
    }, [news, isOpen, editor]);

    const handleGetTagsData = async () => {
        setLoading(prev => ({ ...prev, tags: true }));
        try {
            const response = await appClient.get("/api/tag/get");
            if (response.data.status) {
                setTags(response.data.tags || []);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoading(prev => ({ ...prev, tags: false }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!news) return;

        const toastId = toastLoading("Updating News", {
            description: "Updating your news article..."
        });


        if (!selectedCategory) {
            toastUpdate(toastId, "error", "News creatiin Failed", {
                description: "Choose a category"
            });
            return;
        }

        setIsSubmitting(true);
        console.log({ formData }, editor?.getHTML())
        try {
            let imageUrl = currentImageUrl;

            // Upload new image if provided
            if (image) {
                imageUrl = await uploadToCloudinary(image, "news-image");
            }

            const payload = {
                heading: formData.heading,
                subheading: formData.subheading,
                description: editor?.getHTML(),
                author: formData.author,
                category: selectedCategory._id,
                tags: JSON.stringify(formData.tags),
                isFeatured: formData.isFeatured,
                imageUrl,
                status: news.status,// Preserve current status
                _id: news._id
            };

            const res = await appClient.post(`/api/news/update`, payload);

            if (res.data.status) {
                toastUpdate(toastId, "success", "News Updated", {
                    description: res.data.message || "News updated successfully!"
                });

                // Call update callback if provided
                if (onNewsUpdate && res.data.news) {
                    onNewsUpdate(res.data.news);
                }

                onClose();
            }
        } catch (err: any) {
            console.error("Error updating news:", err);
            toastUpdate(toastId, "error", "Update Failed", {
                description: err.response?.data?.message || err.message || "Failed to update news"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update form fields
    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                heading: "",
                subheading: "",
                author: "",
                category: "",
                tags: [],
                isFeatured: false,
                createdBy: user?._id
            });
            setImage(null);
            setImagePreview("");
            setCurrentImageUrl("");
            if (editor) {
                editor.commands.setContent("<p>Loading news content...</p>");
            }
        }
    }, [isOpen, editor]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#121212] border-2 border-[#aa771c] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden metallic-border"
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#bf953f]/10 to-[#aa771c]/10 border-b-2 border-[#aa771c] p-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Edit className="w-6 h-6 text-[#FFD700]" />
                                <h2 className="text-2xl font-bold text-white font-serif">
                                    Edit News Article
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#bf953f]/20 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-6 h-6 text-[#C0C0C0] hover:text-white" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                            <form onSubmit={handleSubmit} className="p-6 space-y-8">
                                {/* Basic Information Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column - Text Fields */}
                                    <div className="space-y-6">
                                        {/* Heading */}
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                                <Heading className="w-4 h-4" />
                                                <span>HEADING *</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.heading}
                                                onChange={(e) => updateField("heading", e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
                                                placeholder="Enter compelling headline..."
                                                required
                                            />
                                        </div>

                                        {/* Subheading */}
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                                <Type className="w-4 h-4" />
                                                <span>SUBHEADING *</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.subheading}
                                                onChange={(e) => updateField("subheading", e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
                                                placeholder="Brief supporting text..."
                                                required
                                            />
                                        </div>

                                        {/* Author */}
                                        <div>
                                            <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                                <User className="w-4 h-4" />
                                                <span>AUTHOR *</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.author}
                                                onChange={(e) => updateField("author", e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
                                                placeholder="Your name or alias..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column - Media & Categories */}
                                    <div className="space-y-6">
                                        {/* Image Upload */}
                                        <ImageUpload
                                            image={image}
                                            imagePreview={imagePreview}
                                            setImage={setImage}
                                            setImagePreview={setImagePreview}
                                        // currentImageUrl={currentImageUrl}
                                        />

                                        {/* Category Selector */}
                                        <CategorySelector
                                            // categories={categories}
                                            // loading={loading.categories}
                                            selectedCategory={selectedCategory}
                                            onCategoryChange={(category) => setSelectedCategory(category)}
                                        />

                                        {/* Tags Selector */}
                                        <TagsSelector
                                            tags={tags}
                                            loading={loading.tags}
                                            selectedTags={formData.tags}
                                            onTagsChange={(tags) => updateField("tags", tags)}
                                        />

                                        {/* Featured Toggle */}
                                        <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border-2 border-[#333]">
                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                <Star className="w-5 h-5 text-[#FFD700]" />
                                                <span className="text-white font-medium">Featured Article</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isFeatured}
                                                    onChange={(e) => updateField("isFeatured", e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-[#bf953f]' : 'bg-[#333]'
                                                    }`} />
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isFeatured ? 'transform translate-x-7' : 'transform translate-x-1'
                                                    }`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Editor */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                        <FileText className="w-4 h-4" />
                                        <span>DESCRIPTION *</span>
                                    </label>

                                    <div className="border-2 border-[#333] rounded-lg bg-[#0A0A0A] overflow-hidden focus-within:border-[#bf953f] transition-all duration-300">
                                        {/* Editor Toolbar */}
                                        <EditorToolbar editor={editor} />

                                        {/* Editor Content */}
                                        <div className="min-h-[300px] max-h-[400px] overflow-y-auto">
                                            {editor && (
                                                <EditorContent
                                                    editor={editor}
                                                    className="min-h-[300px]"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#333]">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="px-6 py-3 rounded-lg font-medium text-white bg-[#333] hover:bg-[#444] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        className="flex items-center space-x-2 bg-gradient-to-r from-[#bf953f] via-[#FFD700] to-[#aa771c] text-black py-3 px-6 rounded-lg font-bold shadow-2xl hover:shadow-[#bf953f]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed metallic-button relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine" />

                                        <div className="flex items-center space-x-2 relative z-10">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                    <span>UPDATING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>UPDATE NEWS</span>
                                                </>
                                            )}
                                        </div>
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditNewsModal;