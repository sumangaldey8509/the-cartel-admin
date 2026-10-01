"use client"

import { CategoryInterface } from "@/interface/cateogry"
import { CheckSquare, Edit, Square, Trash2, FileText, Folder, FolderOpen, Eye, EyeOff, Star, ChevronDown, ChevronRight, Hash, Calendar, User, Globe } from "lucide-react"
import React from "react"
import { useState } from "react"

interface TableProps {
    data: CategoryInterface[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (category: CategoryInterface) => void
    onDelete: (payload: string[]) => void
}

const CategoryTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
}) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    const getStatusIcon = (isActive: boolean) => {
        return isActive ? (
            <div className="flex items-center space-x-1">
                <Eye size={14} className="text-green-400" />
                <span className="text-green-400 text-xs">Active</span>
            </div>
        ) : (
            <div className="flex items-center space-x-1">
                <EyeOff size={14} className="text-red-400" />
                <span className="text-red-400 text-xs">Inactive</span>
            </div>
        )
    }

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
    }

    const getFeaturedIcon = (isFeatured: boolean) => {
        return isFeatured ? (
            <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs">Featured</span>
            </div>
        ) : null
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const truncateText = (text: string | null, maxLength: number = 20) => {
        if (!text || text === "null") return "—"
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const toggleRowExpansion = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id)
    }

    const getCategoryIcon = (category: CategoryInterface) => {
        if (category.icon) return (
            <div className="w-8 h-8 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#bf953f] text-xs">Icon</span>
            </div>
        )
        return category.parent ? (
            <Folder size={20} className="text-blue-400" />
        ) : (
            <FolderOpen size={20} className="text-purple-400" />
        )
    }

    return (
        <div className="space-y-4">
            {/* Table Container */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#222]">
                                <th className="px-6 py-4 text-left">
                                    <button
                                        onClick={onSelectAll}
                                        className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                    >
                                        {data.length > 0 && selectedRows.length === data.length ?
                                            <CheckSquare size={18} /> : <Square size={18} />
                                        }
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden md:table-cell">
                                    Details
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden lg:table-cell">
                                    SEO
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {data.map((category, index) => (
                                <React.Fragment key={category._id}>
                                    <tr className={`group hover:bg-[#1a1a1a]/60 transition-all duration-200 ${selectedRows.includes(category._id) ? 'bg-[#bf953f]/10' : ''}`}>
                                        {/* Checkbox */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => onSelectRow(category._id)}
                                                    className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                                >
                                                    {selectedRows.includes(category._id) ?
                                                        <CheckSquare size={18} /> : <Square size={18} />
                                                    }
                                                </button>
                                            </div>
                                        </td>

                                        {/* Category Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                                                        {getCategoryIcon(category)}
                                                    </div>
                                                    {category.isFeatured && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                                            <Star size={10} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-white font-medium truncate">
                                                            {category.name.toUpperCase()}
                                                        </h4>
                                                        <button
                                                            onClick={() => toggleRowExpansion(category._id)}
                                                            className="text-[#666] hover:text-[#bf953f] transition-colors"
                                                        >
                                                            {expandedRow === category._id ?
                                                                <ChevronDown size={16} /> :
                                                                <ChevronRight size={16} />
                                                            }
                                                        </button>
                                                    </div>
                                                    <div className="text-[#888] text-sm mt-0.5 flex items-center space-x-2">
                                                        <Hash size={12} />
                                                        <span className="truncate">{category.slug}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-[#666] text-xs mt-1">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar size={10} />
                                                            <span>Created {formatDate(category.createdAt)}</span>
                                                        </div>
                                                        {category.parent && (
                                                            <div className="flex items-center space-x-1">
                                                                <Folder size={10} />
                                                                <span>Has Parent</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Details (Desktop only) */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="space-y-2">
                                                <div className="text-[#C0C0C0] text-sm line-clamp-2">
                                                    {truncateText(category.description, 50)}
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <User size={10} className="text-[#666]" />
                                                    <span className="text-[#888]">
                                                        Created by: {truncateText(category.createdBy?.email || "System", 15)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* SEO Info (Desktop only) */}
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="space-y-2">
                                                {category.metaTitle && (
                                                    <div className="text-[#C0C0C0] text-sm truncate" title={category.metaTitle}>
                                                        <Globe size={10} className="inline mr-1 text-[#666]" />
                                                        {truncateText(category.metaTitle, 30)}
                                                    </div>
                                                )}
                                                {category.metaDescription && (
                                                    <div className="text-[#888] text-xs truncate" title={category.metaDescription}>
                                                        {truncateText(category.metaDescription, 40)}
                                                    </div>
                                                )}
                                                {!category.metaTitle && !category.metaDescription && (
                                                    <span className="text-[#666] text-xs">No SEO data</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(category.isActive)}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getFeaturedIcon(category.isFeatured)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onEdit(category)}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete([category._id])}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-red-400 hover:text-red-300 transition-all duration-200"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Row Details */}
                                    {expandedRow === category._id && (
                                        <tr className="bg-[#1a1a1a]/80">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#0f0f0f]/50 rounded-lg border border-[#333]">
                                                    {/* Basic Info */}
                                                    <div className="space-y-2">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">Basic Information</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Name:</span>
                                                                <span className="text-white">{category.name}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Slug:</span>
                                                                <span className="text-white">{category.slug}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Parent:</span>
                                                                <span className="text-white">{category?.parent?.name || "None"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="space-y-2">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">Description</h5>
                                                        <p className="text-[#C0C0C0] text-sm">
                                                            {category.description || "No description provided"}
                                                        </p>
                                                    </div>

                                                    {/* SEO Data */}
                                                    <div className="space-y-2">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">SEO Information</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <div>
                                                                <div className="text-[#888]">Meta Title:</div>
                                                                <div className="text-white">{category.metaTitle || "Not set"}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-[#888]">Meta Description:</div>
                                                                <div className="text-white">{category.metaDescription || "Not set"}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Media & Status */}
                                                    <div className="space-y-2">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">Media & Status</h5>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Banner:</span>
                                                                <span className={`${category.banner ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {category.banner ? "Uploaded" : "Not set"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Icon:</span>
                                                                <span className={`${category.icon ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {category.icon ? "Uploaded" : "Not set"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Last Updated:</span>
                                                                <span className="text-white">{formatDate(category.updatedAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                            <Folder size={32} className="text-[#666]" />
                        </div>
                        <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">No categories found</h3>
                        <p className="text-[#666] text-sm">No categories have been created yet</p>
                    </div>
                )}
            </div>

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border border-[#bf953f]/30 rounded-xl shadow-2xl px-6 py-3 flex items-center space-x-6">
                        <div className="text-[#bf953f] font-medium">
                            {selectedRows.length} categor{selectedRows.length !== 1 ? 'ies' : 'y'} selected
                        </div>
                        <div className="h-6 w-px bg-[#333]" />
                        <button
                            onClick={() => onDelete(selectedRows)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:text-red-300 hover:border-red-400/40 transition-all duration-200"
                        >
                            <Trash2 size={16} />
                            <span className="font-medium">Delete Selected</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryTable