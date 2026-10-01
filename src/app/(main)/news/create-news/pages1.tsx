// app/news/create/page.tsx
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
    ListOrdered
} from "lucide-react";
import appClient from "@/lib/appClient";
import { useAppSelector } from "@/store/hooks/hooks";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/news/ImageUpload";
import CategorySelector from "@/components/news/CategorySelector";
import TagsSelector from "@/components/news/TagsSelector";
import EditorToolbar from "@/components/news/EditorToolbar";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import { uploadToCloudinary } from "@/cloudionary/uploadNewsPhoto";

// Types
interface CategoryInterface {
    _id: string;
    name: string;
    description?: string;
}

interface TagInterface {
    _id: string;
    name: string;
    color?: string;
}

interface FormData {
    heading: string;
    subheading: string;
    description: string;
    author: string;
    createdBy: string;
    category: string;
    tags: string[];
    isFeatured: boolean;
    imageUrl: string;
}

// Custom Components


const CreateNewsPage = () => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    // Form state
    const [formData, setFormData] = useState({
        heading: "",
        subheading: "",
        author: "",
        category: "",
        tags: [] as string[],
        isFeatured: false,
    });

    // Image state
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    // Data state
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
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
        content: "<p>Write your compelling news description here...</p>",
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-[#C0C0C0]",
            },
        },
    });

    // Load categories and tags
    useEffect(() => {
        handleGetCategoryData();
        handleGetTagsData();
    }, []);

    const handleGetCategoryData = async () => {
        setLoading(prev => ({ ...prev, categories: true }));
        try {
            const response = await appClient.get("/api/category/get");
            if (response.data.status) {
                setCategories(response.data.categories || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(prev => ({ ...prev, categories: false }));
        }
    };

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
        const toastId = toastLoading("Creating News", {
            description: "Publishing your news article..."
        });

        if (!image) {
            toastUpdate(toastId, "error", "News creatiin Failed", {
                description: "Upload a relavant image for your news"
            });
            return;
        }
        setIsSubmitting(true);


        try {
            const imageUrl = await uploadToCloudinary(image!, "news-image")

            const payload = {
                heading: formData.heading,
                subheading: formData.subheading,
                description: editor?.getHTML(),
                author: formData.author,
                createdBy: user?._id,
                category: formData.category,
                tags: JSON.stringify(formData.tags),
                isFeatured: formData.isFeatured,
                imageUrl
            }

            const res = await appClient.post("/api/news/create", payload);

            if (res.data.status) {
                toastUpdate(toastId, "success", "News Published", {
                    description: res.data.message || "News published successfully!"
                });
                router.push("/news");
            }
        } catch (err: any) {
            console.error("Error creating news:", err);
            toastUpdate(toastId, "error", "Publication Failed", {
                description: err.message || "Failed to publish news"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update form fields
    const updateField = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#0A0A0A] py-8 px-4 overflow-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-white mb-4 font-serif bg-gradient-to-r from-[#bf953f] via-[#FFD700] to-[#aa771c] bg-clip-text text-transparent"
                    >
                        Create News Article
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#C0C0C0] text-lg max-w-2xl mx-auto"
                    >
                        Craft compelling news stories with rich formatting, images, and tags to engage your audience.
                    </motion.p>
                </div>

                {/* Form Container */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="bg-[#121212] border-2 border-[#aa771c] rounded-2xl shadow-2xl overflow-hidden metallic-border"
                >
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-[#bf953f]/10 to-[#aa771c]/10 border-b-2 border-[#aa771c] p-2 sm:p-3 md:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-4 h-4 text-[#FFD700]" />
                                <h2 className="text-xl font-bold text-white font-serif">News Details</h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Featured Toggle */}
                                <label className="flex items-center space-x-2 cursor-pointer">
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
                                    <div className="flex items-center space-x-1 text-[#C0C0C0]">
                                        <Star className="w-4 h-4" />
                                        <span className="text-sm font-medium">Featured</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-1.5 sm:pt-3 md:pt-4 pr-1.5 sm:pr-3 md:pr-4 pl-1.5 sm:pl-3 md:pl-4 space-y-8" >
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
                                        className="text-sm w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
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
                                        className="text-sm w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
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
                                        className="text-sm w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
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
                                />

                                {/* Category Selector */}
                                {/* <CategorySelector
                                    categories={categories}
                                    loading={loading.categories}
                                    selectedCategory={formData.category}
                                    onCategoryChange={(category) => updateField("category", category)}
                                /> */}

                                {/* Tags Selector */}
                                <TagsSelector
                                    tags={tags}
                                    loading={loading.tags}
                                    selectedTags={formData.tags}
                                    onTagsChange={(tags) => updateField("tags", tags)}
                                />
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
                                <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
                                    {editor && (
                                        <EditorContent
                                            editor={editor}
                                            className="min-h-[300px]"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className="w-full bg-gradient-to-r from-[#bf953f] via-[#FFD700] to-[#aa771c] text-black py-4 px-6 rounded-lg font-bold text-lg shadow-2xl hover:shadow-[#bf953f]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed metallic-button relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine" />

                            <div className="flex items-center justify-center space-x-3 relative z-10">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        <span>PUBLISHING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>PUBLISH NEWS</span>
                                        <Sparkles className="w-5 h-5" />
                                    </>
                                )}
                            </div>
                        </motion.button>

                        {/* Footer Note */}
                        <p className="text-[#666] text-xs text-center font-mono">
                            🔒 All news articles are encrypted and stored securely
                        </p>

                    </div>

                </motion.form>
            </motion.div>

            <style jsx>{`
                .metallic-border {
                    background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
                    box-shadow: 
                        0 0 30px rgba(191, 149, 63, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.5);
                }
                
                .metallic-button {
                    background: linear-gradient(145deg, #b8860b 0%, #ffd700 50%, #b8860b 100%);
                    box-shadow: 
                        0 4px 15px rgba(255, 215, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.2);
                }
                
                .animate-shine {
                    animation: shine 3s ease-in-out infinite;
                }
                
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }

                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #bf953f;
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
};

export default CreateNewsPage;