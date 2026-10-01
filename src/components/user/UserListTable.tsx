"use client"

import { UserInterface } from "@/interface/user"
import { CheckSquare, Edit, Square, Trash2, User, Mail, Phone, Globe, Link, Eye, EyeOff, ChevronDown, ChevronRight, Calendar, Shield, MoreHorizontal, ToggleLeft, ToggleRight } from "lucide-react"
import React from "react"
import { useState } from "react"

interface TableProps {
    data: UserInterface[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (user: UserInterface) => void
    onDelete: (payload: string[]) => void
    onToggleActive: (id: string, isActive: boolean) => void // New prop for toggling user active status
}

const UserListTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
    onToggleActive,
}) => {
    const [showAllRoles, setShowAllRoles] = useState<Record<string, boolean>>({})

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

    const toggleShowAllRoles = (userId: string) => {
        setShowAllRoles(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }))
    }

    const getRoleBadgeColor = (roleName: string) => {
        const colors: Record<string, string> = {
            'Super Admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Editor': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Employee': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Admin': 'bg-red-500/20 text-red-400 border-red-500/30',
            'User': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        }
        return colors[roleName] || 'bg-[#bf953f]/20 text-[#bf953f] border-[#bf953f]/30'
    }

    const getInitials = (name: string | null) => {
        if (!name) return "U"
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
    }

    return (
        <div className="space-y-4">
            {/* Table Container */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
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
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden md:table-cell">
                                    Profile Links
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden lg:table-cell">
                                    Country
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden xl:table-cell">
                                    Roles
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {data.map((user, index) => (
                                <React.Fragment key={user._id}>
                                    <tr className={`group hover:bg-[#1a1a1a]/60 transition-all duration-200 ${selectedRows.includes(user._id) ? 'bg-[#bf953f]/10' : ''}`}>
                                        {/* Checkbox */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => onSelectRow(user._id)}
                                                    disabled={user.role.length > 0 && user.role[0].roleCode === "superadmin"}
                                                    className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                                >
                                                    {selectedRows.includes(user._id) ?
                                                        <CheckSquare size={18} /> : <Square size={18} />
                                                    }
                                                </button>
                                            </div>
                                        </td>

                                        {/* User Info - Merged cell for fullName, profileImage, email, phoneNumber with country code */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-full flex items-center justify-center">
                                                        {user.profileImage ? (
                                                            <img
                                                                src={user.profileImage}
                                                                alt={user.fullName || user.email}
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-[#bf953f] font-semibold text-lg">
                                                                {getInitials(user.fullName)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {user.isVerified && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <Shield size={10} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-white font-medium truncate">
                                                            {user.fullName || ""}
                                                        </h4>
                                                    </div>
                                                    <div className="space-y-1 mt-1">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Mail size={12} className="text-[#888]" />
                                                            <span className="text-[#C0C0C0] truncate">{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Phone size={12} className="text-[#888]" />
                                                            <span className="text-[#C0C0C0]">
                                                                {user.phoneNumber ?
                                                                    `${user.countryCode || ''} ${user.phoneNumber}` :
                                                                    "No phone"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Profile Links (Desktop only) */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center space-x-2">
                                                <Link size={16} className="text-[#bf953f]" />
                                                <span className="text-white font-medium">
                                                    {user.profileLinks?.length || 0}
                                                </span>
                                                <span className="text-[#888] text-sm">
                                                    link{user.profileLinks?.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Country (Desktop only) */}
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="flex items-center space-x-2">
                                                <Globe size={14} className="text-[#888]" />
                                                <span className="text-[#C0C0C0]">
                                                    {user.country || "—"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status with Toggle */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(user.isUserActive)}
                                                </div>
                                                <button
                                                    onClick={() => onToggleActive(user._id, !user.isUserActive)}
                                                    className="flex items-center space-x-2 text-xs text-[#888] hover:text-[#bf953f] transition-colors"
                                                >
                                                    {user.isUserActive ? (
                                                        <>
                                                            <ToggleRight size={16} className="text-green-400" />
                                                            <span>Click to deactivate</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft size={16} className="text-red-400" />
                                                            <span>Click to activate</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>

                                        {/* Roles (Desktop only) */}
                                        <td className="px-6 py-4 hidden xl:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {user.role?.slice(0, showAllRoles[user._id] ? undefined : 3).map((role, index) => (
                                                    <span
                                                        key={role._id}
                                                        className={`px-2 py-1 rounded-full text-xs border ${getRoleBadgeColor(role.roleName)}`}
                                                    >
                                                        {role.roleName}
                                                    </span>
                                                ))}
                                                {user.role && user.role.length > 3 && !showAllRoles[user._id] && (
                                                    <button
                                                        onClick={() => toggleShowAllRoles(user._id)}
                                                        className="px-2 py-1 rounded-full text-xs bg-[#222] text-[#888] hover:text-[#bf953f] transition-colors"
                                                    >
                                                        +{user.role.length - 3} more
                                                    </button>
                                                )}
                                                {showAllRoles[user._id] && user.role && user.role.length > 3 && (
                                                    <button
                                                        onClick={() => toggleShowAllRoles(user._id)}
                                                        className="px-2 py-1 rounded-full text-xs bg-[#222] text-[#888] hover:text-[#bf953f] transition-colors"
                                                    >
                                                        Show less
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onEdit(user)}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete([user._id])}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-red-400 hover:text-red-300 transition-all duration-200"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                            <User size={32} className="text-[#666]" />
                        </div>
                        <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">No users found</h3>
                        <p className="text-[#666] text-sm">No users have been created yet</p>
                    </div>
                )}
            </div>

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border border-[#bf953f]/30 rounded-xl shadow-2xl px-6 py-3 flex items-center space-x-6">
                        <div className="text-[#bf953f] font-medium">
                            {selectedRows.length} user{selectedRows.length !== 1 ? 's' : ''} selected
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

export default UserListTable