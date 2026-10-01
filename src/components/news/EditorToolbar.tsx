// app/news/create/components/EditorToolbar.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Image as ImageIcon,
    Smile,
} from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
    editor: Editor | null;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showImageInput, setShowImageInput] = useState(false);

    if (!editor) return null;


    const setLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl("");
            setShowLinkInput(false);
        }
    };

    const setImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
            setShowImageInput(false);
        }
    };

    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        tooltip
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        tooltip: string;
    }) => (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${isActive
                ? "bg-[#bf953f] text-black"
                : "text-[#C0C0C0] hover:bg-[#333] hover:text-white"
                }`}
            title={tooltip}
        >
            {children}
        </motion.button>
    );

    return (
        <div className="border-b border-[#333] bg-[#121212] p-3 flex flex-wrap gap-2 relative">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-[#333] pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    tooltip="Bold"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    tooltip="Italic"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    tooltip="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-[#333] pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    tooltip="Heading 1"
                >
                    H1
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    tooltip="Heading 2"
                >
                    H2
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    tooltip="Heading 3"
                >
                    H3
                </ToolbarButton>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-[#333] pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    tooltip="Align Left"
                >
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    tooltip="Align Center"
                >
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    tooltip="Align Right"
                >
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-[#333] pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    tooltip="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    tooltip="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
            </div>

            {/* Media & Links */}
            <div className="flex items-center gap-1 hidden">
                {/* Link Button */}
                <div className="relative">
                    <ToolbarButton
                        onClick={() => setShowLinkInput(!showLinkInput)}
                        isActive={editor.isActive('link')}
                        tooltip="Insert Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>

                    {showLinkInput && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl z-10 min-w-64"
                        >
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="Enter URL..."
                                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                                onKeyPress={(e) => e.key === 'Enter' && setLink()}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={setLink}
                                    className="flex-1 px-3 py-2 bg-[#bf953f] hover:bg-[#aa771c] rounded-lg text-white text-sm transition-colors"
                                >
                                    Insert
                                </button>
                                <button
                                    onClick={() => setShowLinkInput(false)}
                                    className="flex-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Image Button */}
                <div className="relative">
                    <ToolbarButton
                        onClick={() => setShowImageInput(!showImageInput)}
                        tooltip="Insert Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>

                    {showImageInput && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl z-10 min-w-64"
                        >
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Enter image URL..."
                                className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                                onKeyPress={(e) => e.key === 'Enter' && setImage()}
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={setImage}
                                    className="flex-1 px-3 py-2 bg-[#bf953f] hover:bg-[#aa771c] rounded-lg text-white text-sm transition-colors"
                                >
                                    Insert
                                </button>
                                <button
                                    onClick={() => setShowImageInput(false)}
                                    className="flex-1 px-3 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-white text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Emoji Button */}
                <div className="relative">
                    <ToolbarButton
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        tooltip="Insert Emoji"
                    >
                        <Smile className="w-4 h-4" />
                    </ToolbarButton>

                    {showEmojiPicker && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-0 mt-2 z-10"
                        >
                            <Picker
                                data={data}
                                theme="dark"
                                onEmojiSelect={(emoji: any) => {
                                    editor.chain().focus().insertContent(emoji.native).run();
                                    setShowEmojiPicker(false);
                                }}
                            />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorToolbar;