"use client"

import { PublihserInterface } from "@/interface/publishers"
import { CheckSquare, Edit, Square, Trash2, FileText, CheckCircle, Clock, XCircle, MessageCircle, User, Phone, Building, AlertCircle, PauseCircle, ChevronDown, ChevronRight } from "lucide-react"
import React from "react"
import { useState } from "react"

interface TableProps {
    data: PublihserInterface[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (submission: PublihserInterface) => void
    onDelete: (payload: string[]) => void
    onViewPDF?: (url: string) => void
}

const PublisherRequestTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
}) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return <CheckCircle size={14} className="text-green-400" />
            case 'rejected':
                return <XCircle size={14} className="text-red-400" />
            case 'hold':
                return <AlertCircle size={14} className="text-yellow-400" />
            case 'pause':
                return <PauseCircle size={14} className="text-orange-400" />
            case 'pending':
                return <Clock size={14} className="text-blue-400" />
            default:
                return <Clock size={14} className="text-gray-400" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'verified':
                return 'bg-green-400/20 text-green-300'
            case 'rejected':
                return 'bg-red-400/20 text-red-300'
            case 'hold':
                return 'bg-yellow-400/20 text-yellow-300'
            case 'pause':
                return 'bg-orange-400/20 text-orange-300'
            case 'pending':
                return 'bg-blue-400/20 text-blue-300'
            default:
                return 'bg-gray-400/20 text-gray-300'
        }
    }

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'verified': 'Verified',
            'rejected': 'Rejected',
            'hold': 'On Hold',
            'pause': 'Paused'
        }
        return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    const truncateText = (text: string, maxLength: number = 20) => {
        if (!text || text === "Not provided") return "—"
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const toggleRowExpansion = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id)
    }

    return (
        <div className="space-y-4">
            {/* Table Container */}
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
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
                                    Publisher
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden md:table-cell">
                                    Account
                                </th>
                                <th className="px-6 py-4 text-left text-[#bf953f] font-semibold text-sm uppercase tracking-wider hidden lg:table-cell">
                                    Contact
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
                            {data.map((submission, index) => (
                                <React.Fragment key={submission._id}>
                                    <tr className={`group hover:bg-[#1a1a1a]/60 transition-all duration-200 ${selectedRows.includes(submission._id) ? 'bg-[#bf953f]/10' : ''}`}>
                                        {/* Checkbox */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => onSelectRow(submission._id)}
                                                    className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                                >
                                                    {selectedRows.includes(submission._id) ?
                                                        <CheckSquare size={18} /> : <Square size={18} />
                                                    }
                                                </button>
                                            </div>
                                        </td>

                                        {/* Publisher Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                                                        <span className="text-[#bf953f] font-semibold">
                                                            {submission.fullName.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1a1a1a] rounded-full border border-[#333] flex items-center justify-center">
                                                        {submission.accountType === 'company' ?
                                                            <Building size={8} className="text-blue-400" /> :
                                                            <User size={8} className="text-purple-400" />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-white font-medium truncate">
                                                            {submission.fullName}
                                                        </h4>
                                                        <button
                                                            onClick={() => toggleRowExpansion(submission._id)}
                                                            className="text-[#666] hover:text-[#bf953f] transition-colors"
                                                        >
                                                            {expandedRow === submission._id ?
                                                                <ChevronDown size={16} /> :
                                                                <ChevronRight size={16} />
                                                            }
                                                        </button>
                                                    </div>
                                                    <div className="text-[#888] text-sm mt-0.5 truncate">
                                                        {submission.userId.email}
                                                    </div>
                                                    <div className="text-[#666] text-xs mt-1">
                                                        Created {formatDate(submission.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Account Type (Desktop only) */}
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex flex-col space-y-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${submission.accountType === 'company' ? 'bg-blue-400/10 text-blue-300' : 'bg-purple-400/10 text-purple-300'}`}>
                                                    {submission.accountType === 'company' ? 'Company' : 'Individual'}
                                                </span>
                                                {submission.organizationName && submission.organizationName !== "Not provided" && (
                                                    <div className="text-[#888] text-sm truncate max-w-[150px]">
                                                        {truncateText(submission.organizationName, 25)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Contact (Desktop only) */}
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Phone size={12} className="text-[#666]" />
                                                    <span className="text-[#C0C0C0]">
                                                        {submission.countryCode} {submission.phoneNumber}
                                                    </span>
                                                </div>
                                                {submission.telegramUsername && submission.telegramUsername !== "Not provided" && (
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <MessageCircle size={12} className="text-[#666]" />
                                                        <span className="text-[#C0C0C0]">
                                                            {truncateText(submission.telegramUsername, 20)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(submission.verificationStatus)}
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.verificationStatus)}`}>
                                                        {formatStatus(submission.verificationStatus)}
                                                    </span>
                                                </div>
                                                {submission.actionTakenBy && (
                                                    <div className="text-[#666] text-xs">
                                                        by {truncateText(submission.actionTakenBy.email, 15)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onEdit(submission)}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete([submission._id])}
                                                    className={`p-2 rounded-lg transition-all duration-200
    ${submission.verificationStatus === "rejected"
                                                            ? "bg-[#222] hover:bg-[#333] text-red-400 hover:text-red-300 cursor-pointer"
                                                            : "bg-gray-500 text-gray-300 cursor-not-allowed"}`}
                                                    title="Delete"
                                                    disabled={submission.verificationStatus !== "rejected"}
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
                            <FileText size={32} className="text-[#666]" />
                        </div>
                        <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">No publishers found</h3>
                        <p className="text-[#666] text-sm">No publisher requests have been submitted yet</p>
                    </div>
                )}
            </div>

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] border border-[#bf953f]/30 rounded-xl shadow-2xl px-6 py-3 flex items-center space-x-6">
                        <div className="text-[#bf953f] font-medium">
                            {selectedRows.length} publisher{selectedRows.length !== 1 ? 's' : ''} selected
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

export default PublisherRequestTable