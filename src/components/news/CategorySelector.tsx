// app/news/create/components/CategorySelector.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Search, Plus, X } from "lucide-react";
import appClient from "@/lib/appClient";
import { CategoryInterface } from "@/interface/cateogry";
import { useRouter } from "next/navigation";


interface CategorySelectorProps {
    selectedCategory: CategoryInterface | null;
    onCategoryChange: (category: CategoryInterface | null) => void;
}

const CategorySelector = ({
    // categories,
    selectedCategory,
    onCategoryChange
}: CategorySelectorProps) => {
    const router = useRouter()

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<CategoryInterface[]>([])

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

    const handleGetCategoryData = async () => {
        setLoading(true);
        try {
            const response = await appClient.get("/api/category/get", {
                params: { search: searchTerm, page: 1, limit: 200 }
            });
            if (response.data.status) {
                setCategories(response.data.categories.docs || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetCategoryData()
    }, [searchTerm])

    const handleSelectCategory = (category: CategoryInterface) => {
        onCategoryChange(category);
        setIsOpen(false);
        setSearchTerm("");
    };

    const clearSelection = () => {
        onCategoryChange(null);
    };

    return (
        <div>
            <label className="flex items-center space-x-2 text-sm font-bold text-[#bf953f] mb-3 font-mono">
                <FolderOpen className="w-4 h-4" />
                <span>CATEGORY</span>
            </label>

            <div className="relative" ref={dropdownRef}>
                {/* Selected Category Display */}
                {selectedCategory ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#333]"
                    >
                        <span className="text-white font-medium">{selectedCategory.name.toUpperCase()}</span>
                        <button
                            type="button"
                            onClick={clearSelection}
                            className="p-1 hover:bg-[#333] rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-[#666]" />
                        </button>
                    </motion.div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full p-3 rounded-lg bg-[#0A0A0A] border-2 border-[#333] hover:border-[#bf953f] transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[#666]">Select category...</span>
                            <FolderOpen className="w-4 h-4 text-[#666]" />
                        </div>
                    </button>
                )}

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
                                        placeholder="Search categories..."
                                        className="w-full pl-10 pr-4 py-2 bg-[#0A0A0A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Categories List */}
                            <div className="max-h-48 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-[#666]">
                                        Loading categories...
                                    </div>
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            onClick={() => handleSelectCategory(category)}
                                            className="w-full p-3 text-left hover:bg-[#bf953f]/10 transition-colors border-b border-[#333] last:border-b-0 disabled:opacity-50"
                                            disabled={category.parent == null}
                                        >
                                            <div className="text-sm text-white font-medium">{category.name.toUpperCase()} <span className="text-[#666] text-sm mt-1"> {category.parent ? `| Sub category of - ${category?.parent?.name.toLocaleUpperCase()}` : ""} </span> </div>
                                            {/* {category.description && (
                                                <div className="text-[#666] text-sm mt-1">
                                                    {category.description}
                                                </div>
                                            )} */}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-[#666]">
                                        No categories found
                                    </div>
                                )}
                            </div>

                            {/* Custom Category Input */}
                            <div onClick={() => router.push("/settings/category")} className="p-3 border-t border-[#333] bg-[#0A0A0A]">
                                <p>or Create a new category</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategorySelector;