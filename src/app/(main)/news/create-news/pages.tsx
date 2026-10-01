"use client";

import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
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
    Edit
} from "lucide-react";
import appClient from "@/lib/appClient";
import { useAppSelector } from "@/store/hooks/hooks";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message";
import { useRouter } from "next/navigation";


const CreateNewsPage = () => {
    const user = useAppSelector((state) => state.auth.user)

    const [heading, setHeading] = useState("");
    const [subheading, setSubheading] = useState("");
    const [author, setAuthr] = useState("")
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const router = useRouter()


    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Write your compelling news description here...</p>",
        immediatelyRender: false,
    });

    // Handle image preview
    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(image);
        } else {
            setImagePreview("");
        }
    }, [image]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);


        const toastId = toastLoading("Creating News(s)", {
            description: `Publighing news`
        })

        try {
            // Ensure user is logged in
            if (!user?._id) {
                console.error("User not logged in");
                setIsSubmitting(false);
                return;
            }

            const description = editor?.getHTML() || "";

            // Build FormData
            const formData = new FormData();
            formData.append("heading", heading);
            formData.append("subheading", subheading);
            formData.append("author", author || "");
            formData.append("createdBy", String(user._id)); // MongoDB User ID
            formData.append("description", description);
            formData.append("createdAt", new Date().toISOString());

            // Only append image if selected
            if (image) {
                formData.append("image", image); // File object from input
            }

            console.log("Submitting News FormData...");

            // Send to Next.js API route
            const res = await appClient.post("/api/news/create", formData);

            console.log("News created successfully:", res.data);

            if (res.data.status) {
                toastUpdate(toastId, "success", "News Published", {
                    description: res.data.message || "News Published!"
                })
                router.push("/news")
            }

            // TODO: show success toast, redirect, or reset form
        } catch (err: any) {
            console.error("Error creating news:", err.message || err);
            // TODO: show error toast
        } finally {
            setIsSubmitting(false);
        }
    };




    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#121212] to-[#0A0A0A] py-8 px-4 overflow-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >

                {/* Form Container */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-[#121212] border-2 border-[#aa771c] rounded-2xl shadow-2xl overflow-hidden metallic-border"
                >
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-[#bf953f]/10 to-[#aa771c]/10 border-b-2 border-[#aa771c] p-6">
                        <div className="flex items-center space-x-3">
                            <Sparkles className="w-6 h-6 text-[#FFD700]" />
                            <h2 className="text-2xl font-bold text-white-800 font-serif">News Details</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Two Column Layout for Desktop */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                        value={heading}
                                        onChange={(e) => setHeading(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white-800 border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
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
                                        value={subheading}
                                        onChange={(e) => setSubheading(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white-800 border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
                                        placeholder="Brief supporting text..."
                                        required
                                    />
                                </div>

                                {/* Created By */}
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                        <User className="w-4 h-4" />
                                        <span>AUTHOR *</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthr(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-[#0A0A0A] text-white-800 border-2 border-[#333] focus:outline-none focus:ring-2 focus:ring-[#bf953f] focus:border-transparent duration-300 font-mono placeholder-[#666]"
                                        placeholder="Your name or alias..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column - Image Upload */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>FEATURED IMAGE</span>
                                </label>

                                {/* Image Upload Area */}
                                <div
                                    className="border-2 border-dashed border-[#333] rounded-lg p-6 text-center hover:border-[#bf953f] transition-all duration-300 bg-[#0A0A0A] cursor-pointer relative"
                                    onClick={!imagePreview ? triggerFileInput : undefined}
                                >
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg mb-4"
                                            />
                                            {/* Image Action Buttons */}
                                            <div className="absolute top-2 right-2 flex space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        triggerFileInput();
                                                    }}
                                                    className="p-2 bg-[#bf953f] hover:bg-[#aa771c] rounded-full transition-all shadow-lg"
                                                >
                                                    <Edit className="w-3 h-3 text-white-800" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage();
                                                    }}
                                                    className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full transition-all shadow-lg"
                                                >
                                                    <X className="w-3 h-3 text-white-800" />
                                                </button>
                                            </div>
                                            <p className="text-[#C0C0C0] text-sm mt-2">
                                                Click the edit icon to change image
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-[#666] mx-auto mb-4" />
                                            <p className="text-[#C0C0C0] text-sm mb-2">
                                                Click to upload featured image
                                            </p>
                                            <p className="text-[#666] text-xs">
                                                PNG, JPG, WEBP up to 10MB
                                            </p>
                                        </>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
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
                                <div className="border-b border-[#333] bg-[#121212] p-3 flex space-x-2 relative">
                                    {editor && (
                                        <>
                                            {/* Bold */}
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleBold().run()}
                                                className={`p-2 rounded ${editor.isActive("bold")
                                                    ? "bg-[#bf953f] text-black"
                                                    : "text-[#C0C0C0] hover:bg-[#333]"
                                                    }`}
                                            >
                                                <span className="font-bold text-sm">B</span>
                                            </button>

                                            {/* Italic */}
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                                className={`p-2 rounded ${editor.isActive("italic")
                                                    ? "bg-[#bf953f] text-black"
                                                    : "text-[#C0C0C0] hover:bg-[#333]"
                                                    }`}
                                            >
                                                <span className="italic text-sm">I</span>
                                            </button>

                                            {/* Heading */}
                                            <button
                                                type="button"
                                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                                className={`p-2 rounded ${editor.isActive("heading", { level: 2 })
                                                    ? "bg-[#bf953f] text-black"
                                                    : "text-[#C0C0C0] hover:bg-[#333]"
                                                    }`}
                                            >
                                                H2
                                            </button>

                                            {/* Emoji Button */}
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                    className="p-2 rounded text-[#C0C0C0] hover:bg-[#333]"
                                                >
                                                    😀
                                                </button>

                                                {/* Floating Emoji Picker */}
                                                {showEmojiPicker && (
                                                    <div className="absolute top-10 left-0 z-[9999]">
                                                        <Picker
                                                            data={data}
                                                            theme="dark"
                                                            onEmojiSelect={(emoji: any) => {
                                                                editor.chain().focus().insertContent(emoji.native).run();
                                                                setShowEmojiPicker(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Editor Content */}
                                <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                                    {editor && (
                                        <EditorContent
                                            editor={editor}
                                            className="prose prose-invert max-w-none text-[#C0C0C0] [&_.ProseMirror]:outline-none"
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

                /* Custom scrollbar for editor */
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