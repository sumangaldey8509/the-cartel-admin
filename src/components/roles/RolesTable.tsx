"use client"

import { RoleInterface } from "@/interface/roles"
import { CheckSquare, Edit, Square, Trash2, FileText, Hash, Calendar, User, ChevronDown, ChevronRight, Shield, Key } from "lucide-react"
import React, { JSX } from "react"
import { useState } from "react"

interface TableProps {
    data: RoleInterface[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (role: RoleInterface) => void
    onDelete: (payload: string[]) => void
}

const RolesTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
}) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

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

    const truncateText = (text: string, maxLength: number = 20) => {
        if (!text) return "—"
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const toggleRowExpansion = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id)
    }

    const getRoleIcon = (roleCode: string) => {
        const roleIcons: Record<string, JSX.Element> = {
            admin: <Shield size={20} className="text-red-400" />,
            editor: <Edit size={20} className="text-blue-400" />,
            viewer: <FileText size={20} className="text-green-400" />,
            user: <User size={20} className="text-purple-400" />
        }

        return roleIcons[roleCode] || <Key size={20} className="text-[#bf953f]" />
    }

    const getPermissionCount = (contents: string[]) => {
        return contents.length
    }

    const formatPermissionText = (contents: string[]) => {
        if (contents.length === 0) return "No permissions"
        if (contents.length === 1) return "1 permission"
        return `${contents.length} permissions`
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
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden md:table-cell">
                                    Details
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden lg:table-cell">
                                    Permissions
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {data.map((role, index) => (
                                <React.Fragment key={role._id}>
                                    <tr className={`group hover:bg-[#1a1a1a]/60 transition-all duration-200 ${selectedRows.includes(role._id) ? 'bg-[#bf953f]/10' : ''}`}>
                                        {/* Checkbox */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => onSelectRow(role._id)}
                                                    className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                                >
                                                    {selectedRows.includes(role._id) ?
                                                        <CheckSquare size={18} /> : <Square size={18} />
                                                    }
                                                </button>
                                            </div>
                                        </td>

                                        {/* Role Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                                                        {getRoleIcon(role.roleCode)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-white font-medium truncate">
                                                            {role.roleName}
                                                        </h4>
                                                        <button
                                                            onClick={() => toggleRowExpansion(role._id)}
                                                            className="text-[#666] hover:text-[#bf953f] transition-colors"
                                                        >
                                                            {expandedRow === role._id ?
                                                                <ChevronDown size={16} /> :
                                                                <ChevronRight size={16} />
                                                            }
                                                        </button>
                                                    </div>
                                                    <div className="text-[#888] text-sm mt-0.5 flex items-center space-x-2">
                                                        <Hash size={12} />
                                                        <code className="bg-[#222] px-2 py-0.5 rounded text-xs font-mono">
                                                            {role.roleCode}
                                                        </code>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-[#666] text-xs mt-1">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar size={10} />
                                                            <span>Created {formatDate(role.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Details (Desktop only) */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <User size={10} className="text-[#666]" />
                                                    <span className="text-[#888]">
                                                        Created by: {truncateText(role.createdBy?.email || "System", 20)}
                                                    </span>
                                                </div>
                                                <div className="text-[#888] text-xs">
                                                    Last updated: {formatDate(role.updatedAt)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Permissions (Desktop only) */}
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="space-y-2">
                                                <div className="text-[#C0C0C0] text-sm">
                                                    {formatPermissionText(role.contents)}
                                                </div>
                                                {role.contents.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {role.contents.slice(0, 3).map((permission, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 bg-[#222] text-[#888] text-xs rounded-md truncate max-w-[120px]"
                                                                title={permission}
                                                            >
                                                                {truncateText(permission, 15)}
                                                            </span>
                                                        ))}
                                                        {role.contents.length > 3 && (
                                                            <span className="px-2 py-0.5 bg-[#333] text-[#666] text-xs rounded-md">
                                                                +{role.contents.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onEdit(role)}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                                    title="Edit Role"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete([role._id])}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-red-400 hover:text-red-300 transition-all duration-200"
                                                    title="Delete Role"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Row Details */}
                                    {expandedRow === role._id && (
                                        <tr className="bg-[#1a1a1a]/80">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-[#0f0f0f]/50 rounded-lg border border-[#333]">
                                                    {/* Role Information */}
                                                    <div className="space-y-3">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">Role Information</h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[#888]">Role Name:</span>
                                                                <span className="text-white font-medium">{role.roleName}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[#888]">Role Code:</span>
                                                                <code className="bg-[#222] px-2 py-1 rounded text-white text-xs font-mono">
                                                                    {role.roleCode}
                                                                </code>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Total Permissions:</span>
                                                                <span className="text-white">{getPermissionCount(role.contents)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Created Information */}
                                                    <div className="space-y-3">
                                                        <h5 className="text-[#bf953f] text-sm font-semibold">Created Information</h5>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Created By:</span>
                                                                <div className="text-right">
                                                                    <div className="text-white">{role.createdBy?.email}</div>
                                                                    <div className="text-[#666] text-xs">ID: {truncateText(role.createdBy?._id, 10)}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Created At:</span>
                                                                <span className="text-white">{formatDate(role.createdAt)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[#888]">Last Updated:</span>
                                                                <span className="text-white">{formatDate(role.updatedAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Permissions */}
                                                    <div className="space-y-3 md:col-span-2 lg:col-span-1">
                                                        <div className="flex justify-between items-center">
                                                            <h5 className="text-[#bf953f] text-sm font-semibold">Permissions ({role.contents.length})</h5>
                                                            <span className="text-[#666] text-xs">
                                                                {role.contents.length > 0 ? "Click to view details" : "No permissions"}
                                                            </span>
                                                        </div>
                                                        <div className="max-h-40 overflow-y-auto space-y-1">
                                                            {role.contents.length > 0 ? (
                                                                role.contents.map((permission, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="px-3 py-2 bg-[#222] hover:bg-[#333] rounded-md transition-colors cursor-pointer group"
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <div className="flex items-center space-x-2">
                                                                                <Key size={12} className="text-[#666]" />
                                                                                <code className="text-white text-sm font-mono">
                                                                                    {permission}
                                                                                </code>
                                                                            </div>
                                                                            <div className="text-[#666] text-xs group-hover:text-[#888]">
                                                                                {permission.split(':')[0]}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="px-3 py-4 bg-[#222] rounded-md text-center">
                                                                    <div className="text-[#666] text-sm">No permissions assigned to this role</div>
                                                                </div>
                                                            )}
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
                            <Shield size={32} className="text-[#666]" />
                        </div>
                        <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">No roles found</h3>
                        <p className="text-[#666] text-sm">No roles have been created yet</p>
                    </div>
                )}
            </div>

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border border-[#bf953f]/30 rounded-xl shadow-2xl px-6 py-3 flex items-center space-x-6">
                        <div className="text-[#bf953f] font-medium">
                            {selectedRows.length} role{selectedRows.length !== 1 ? 's' : ''} selected
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

export default RolesTable