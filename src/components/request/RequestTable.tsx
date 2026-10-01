import { TokenSubmission } from "@/interface/request"
import { CheckSquare, Edit, Square, Trash2, FileText, User, Building2, ExternalLink, CheckCircle, Clock, XCircle, Eye } from "lucide-react"

interface TableProps {
    data: TokenSubmission[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (submission: TokenSubmission) => void
    onDelete: (payload: string[]) => void
    onViewPDF?: (url: string) => void
    onStatusChange?: (id: string, status: "pending" | "verified" | "rejected") => void
}

const RequestTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
    onViewPDF,
    onStatusChange
}) => {
    const allSelected = data.length > 0 && selectedRows.length === data.length

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published':
                return <Eye size={16} className="text-green-400" />
            case 'verified':
                return <CheckCircle size={16} className="text-blue-400" />
            case 'rejected':
                return <XCircle size={16} className="text-red-400" />
            default:
                return <Clock size={16} className="text-yellow-400" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'verified':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'rejected':
                return 'text-red-400 bg-red-400/10 border-red-400/20'
            default:
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
        }
    }

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case "premium":
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
            default:
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
        }
    }

    const getUserTypeIcon = (userType: string) => {
        return userType === 'organization' ?
            <Building2 size={16} className="text-blue-400" /> :
            <User size={16} className="text-green-400" />
    }

    return (
        <div className="bg-gradient-to-br from-[#121212] to-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border-b border-[#333]">
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={onSelectAll}
                                    className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                >
                                    {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">#</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">User</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden md:table-cell">Token</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden lg:table-cell">Contact</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Plan</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Status</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Submitted</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {data.map((submission, index) => (
                            <tr
                                key={submission._id}
                                className={`hover:bg-[#1a1a1a]/50 transition-colors ${selectedRows.includes(submission._id) ? 'bg-[#bf953f]/10' : ''
                                    }`}
                            >
                                {/* Checkbox */}
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onSelectRow(submission._id)}
                                        className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                    >
                                        {selectedRows.includes(submission._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                </td>

                                {/* Index */}
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm font-mono">{index + 1}</div>
                                </td>

                                {/* User Info */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        {getUserTypeIcon(submission.userType)}
                                        <div>
                                            <div className="text-white-800 text-sm font-medium">{submission.name}</div>
                                            <div className="text-[#C0C0C0] text-xs">{submission.email}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Token Info */}
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <div>
                                        <div className="text-white-800 text-sm font-medium">{submission.tokenName}</div>
                                        <div className="text-[#bf953f] text-xs font-mono">{submission.tokenSymbol}</div>
                                    </div>
                                </td>

                                {/* Contact Info */}
                                <td className="px-4 py-3 text-[#C0C0C0] text-sm hidden lg:table-cell">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-1">
                                            <span>{submission.telegram}</span>
                                        </div>
                                        {submission.website && (
                                            <div className="flex items-center space-x-1 text-blue-400">
                                                <ExternalLink size={12} />
                                                <span className="text-xs truncate max-w-[120px]">{submission.website}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Plan */}
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(submission.plan)}`}>
                                        {submission.plan.charAt(0).toUpperCase() + submission.plan.slice(1)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(submission.status)}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                        </span>
                                    </div>
                                    {submission.actionTakenBy && (
                                        <div className="text-[#666] text-xs mt-1">
                                            by {submission.actionTakenBy.email}
                                        </div>
                                    )}
                                </td>

                                {/* Submitted Date */}
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm">
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-[#666] text-xs">
                                        {new Date(submission.createdAt).toLocaleTimeString()}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-1">
                                        {/* View PDF */}
                                        {submission.pdfFileUrl && (
                                            <button
                                                onClick={() => onViewPDF?.(submission.pdfFileUrl!)}
                                                className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                                title="View PDF"
                                            >
                                                <FileText size={16} className="text-blue-400" />
                                            </button>
                                        )}

                                        {/* Edit */}
                                        <button
                                            onClick={() => onEdit(submission)}
                                            className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} className="text-[#bf953f]" />
                                        </button>

                                        {/* Status Actions */}
                                        {onStatusChange && submission.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onStatusChange(submission._id, 'verified')}
                                                    className="p-1.5 rounded-lg bg-[#333] hover:bg-green-500/20 transition-colors"
                                                    title="Verify"
                                                >
                                                    <CheckCircle size={16} className="text-green-400" />
                                                </button>
                                                <button
                                                    onClick={() => onStatusChange(submission._id, 'rejected')}
                                                    className="p-1.5 rounded-lg bg-[#333] hover:bg-red-500/20 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle size={16} className="text-red-400" />
                                                </button>
                                            </>
                                        )}

                                        {/* Delete */}
                                        <button
                                            onClick={() => onDelete([submission._id])}
                                            className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} className="text-red-400" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-[#666] mb-3" />
                    <div className="text-[#666] mb-2">No token submissions found</div>
                    <div className="text-[#C0C0C0] text-sm">No token launch requests have been submitted yet</div>
                </div>
            )}

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="px-4 py-3 bg-[#bf953f]/10 border-t border-[#333]">
                    <div className="text-[#bf953f] text-sm">
                        {selectedRows.length} submission{selectedRows.length !== 1 ? 's' : ''} selected
                    </div>
                </div>
            )}
        </div>
    )
}

export default RequestTable