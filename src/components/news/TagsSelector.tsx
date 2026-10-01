// app/news/create/components/TagsSelector.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Search, Plus, X } from "lucide-react";

interface TagInterface {
    _id: string;
    name: string;
    color?: string;
}

interface TagsSelectorProps {
    tags: TagInterface[];
    loading: boolean;
    selectedTags: string[];
    onTagsChange: (tags: string[]) => void;
}

const TagsSelector = ({ tags, loading, selectedTags, onTagsChange }: TagsSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customTag, setCustomTag] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.includes(tag.name)
    );

    const addTag = (tagName: string) => {
        if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
            onTagsChange([...selectedTags, tagName.trim()]);
        }
        setCustomTag("");
        setSearchTerm("");
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleAddCustomTag = () => {
        if (customTag.trim()) {
            addTag(customTag.trim());
        }
    };

    return (
        <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                <Tag className="w-4 h-4" />
                <span>TAGS</span>
            </label>

            <div className="relative" ref={dropdownRef}>
                {/* Selected Tags Display */}
                <div
                    className="min-h-12 p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#333] hover:border-[#bf953f] transition-all duration-300 cursor-text"
                    onClick={() => setIsOpen(true)}
                >
                    {selectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center space-x-1 px-3 py-1 bg-[#bf953f]/20 border border-[#bf953f] rounded-full text-[#bf953f] text-sm"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTag(tag);
                                        }}
                                        className="hover:bg-[#bf953f] hover:text-black rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-[#666]">Add tags...</span>
                            <Tag className="w-4 h-4 text-[#666]" />
                        </div>
                    )}
                </div>

                {/* Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border-2 border-[#333] rounded-lg shadow-2xl z-50 overflow-hidden"
                        >
                            {/* Search Input */}
                            <div className="p-3 border-b border-[#333]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666]" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search tags..."
                                        className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Tags List */}
                            <div className="max-h-48 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-[#666]">
                                        Loading tags...
                                    </div>
                                ) : filteredTags.length > 0 ? (
                                    <div className="p-2">
                                        {filteredTags.map((tag) => (
                                            <button
                                                key={tag._id}
                                                type="button"
                                                onClick={() => addTag(tag.name)}
                                                className="w-full p-2 text-left hover:bg-[#bf953f]/10 transition-colors rounded-lg"
                                            >
                                                <div className="text-white font-medium">{tag.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : searchTerm ? (
                                    <div className="p-4 text-center text-[#666]">
                                        No tags found
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-[#666]">
                                        Start typing to search tags
                                    </div>
                                )}
                            </div>

                            {/* Custom Tag Input */}
                            <div className="p-3 border-t border-[#333] bg-[#0A0A0A]">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={customTag}
                                        onChange={(e) => setCustomTag(e.target.value)}
                                        placeholder="Create new tag..."
                                        className="flex-1 min-w-0 px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                                        onKeyPress={(e) => e.key === "Enter" && handleAddCustomTag()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomTag}
                                        disabled={!customTag.trim()}
                                        className="flex-shrink-0 px-3 py-2 bg-[#bf953f] hover:bg-[#aa771c] disabled:bg-[#333] disabled:cursor-not-allowed rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TagsSelector;