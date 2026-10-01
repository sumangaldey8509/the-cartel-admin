import { consultaion } from "@/interface/consultation"
import { CheckSquare, Edit, Square, Trash2, FileText, CheckCircle, Clock, XCircle, Eye, Mail, MessageCircle, User, Phone, Wrench, ThumbsUp } from "lucide-react"

interface TableProps {
    data: consultaion[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (submission: consultaion) => void
    onDelete: (payload: string[]) => void
    onViewPDF?: (url: string) => void
    onStatusChange?: (id: string, status: "pending" | "not-contacted" | "contacted" | "in-progress" | "resolved") => void
}

const ConsultationRequestTable: React.FC<TableProps> = ({
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
            case 'resolved':
                return <ThumbsUp size={16} className="text-green-400" />
            case 'in-progress':
                return <Wrench size={16} className="text-blue-400" />
            case 'contacted':
                return <Phone size={16} className="text-purple-400" />
            case 'not-contacted':
                return <Clock size={16} className="text-yellow-400" />
            case 'pending':
                return <Clock size={16} className="text-orange-400" />
            default:
                return <Clock size={16} className="text-gray-400" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'text-green-400 bg-green-400/10 border-green-400/20'
            case 'in-progress':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case 'contacted':
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
            case 'not-contacted':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
            case 'pending':
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const formatStatus = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Pending',
            'not-contacted': 'Not Contacted',
            'contacted': 'Contacted',
            'in-progress': 'In Progress',
            'resolved': 'Resolved'
        }
        return statusMap[status] || status
    }

    const getTopicColor = (topic: string) => {
        switch (topic) {
            case "token-launch":
                return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
            case "marketing":
                return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
            case "listing":
                return 'text-green-400 bg-green-400/10 border-green-400/20'
            case "community":
                return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        }
    }

    const formatTopic = (topic: string) => {
        const topicMap: { [key: string]: string } = {
            'token-launch': 'Token Launch',
            'marketing': 'Marketing',
            'listing': 'Coin Listing',
            'community': 'Community',
            'other': 'Other'
        }
        return topicMap[topic] || topic
    }

    // Status progression options
    const getNextStatusOptions = (currentStatus: string) => {
        const statusFlow = {
            'pending': ['not-contacted', 'contacted', 'in-progress', 'resolved'],
            'not-contacted': ['contacted', 'in-progress', 'resolved'],
            'contacted': ['in-progress', 'resolved'],
            'in-progress': ['resolved'],
            'resolved': ['in-progress', 'contacted'] // Allow reopening if needed
        }
        return statusFlow[currentStatus as keyof typeof statusFlow] || []
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
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Name</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Email</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden lg:table-cell">Telegram</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Topic</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Status</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden md:table-cell">Date</th>
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

                                {/* Name */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-[#bf953f]/20 rounded-full flex items-center justify-center">
                                            <span className="text-[#bf953f] text-sm font-semibold">
                                                {submission.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">{submission.name}</div>
                                            <div className="text-[#666] text-xs md:hidden">{submission.email}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <Mail size={14} className="text-[#666]" />
                                        <div className="text-[#C0C0C0] text-sm truncate max-w-[150px]">
                                            {submission.email}
                                        </div>
                                    </div>
                                </td>

                                {/* Telegram */}
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <div className="flex items-center space-x-2">
                                        <MessageCircle size={14} className="text-[#666]" />
                                        <div className="text-[#C0C0C0] text-sm">
                                            {submission.telegram || 'N/A'}
                                        </div>
                                    </div>
                                </td>

                                {/* Topic */}
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTopicColor(submission.topic)}`}>
                                        {formatTopic(submission.topic)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(submission.status)}
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                            {formatStatus(submission.status)}
                                        </span>
                                    </div>
                                    {submission.actionTakenBy && (
                                        <div className="text-[#666] text-xs mt-1">
                                            by {submission.actionTakenBy.email}
                                        </div>
                                    )}
                                </td>

                                {/* Submitted Date */}
                                <td className="px-4 py-3 hidden md:table-cell">
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
                                        {/* View Message */}
                                        {submission.message && (
                                            <button
                                                onClick={() => {
                                                    // You can implement a modal to show the message
                                                    alert(`Message: ${submission.message}`)
                                                }}
                                                className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                                title="View Message"
                                            >
                                                <Eye size={16} className="text-blue-400" />
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

                                        {/* Status Change Dropdown */}
                                        {onStatusChange && (
                                            <div className="relative group">
                                                <button
                                                    className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                                    title="Change Status"
                                                >
                                                    <CheckCircle size={16} className="text-green-400" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    {getNextStatusOptions(submission.status).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => onStatusChange(submission._id, status as any)}
                                                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#bf953f]/10 transition-colors flex items-center space-x-2"
                                                        >
                                                            {getStatusIcon(status)}
                                                            <span>{formatStatus(status)}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
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
                    <div className="text-[#666] mb-2">No consultation submissions found</div>
                    <div className="text-[#C0C0C0] text-sm">No consultation requests have been submitted yet</div>
                </div>
            )}

            {/* Selected Rows Info */}
            {selectedRows.length > 0 && (
                <div className="px-4 py-3 bg-[#bf953f]/10 border-t border-[#333]">
                    <div className="flex items-center justify-between">
                        <div className="text-[#bf953f] text-sm">
                            {selectedRows.length} submission{selectedRows.length !== 1 ? 's' : ''} selected
                        </div>
                        <button
                            onClick={() => onDelete(selectedRows)}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                        >
                            <Trash2 size={14} />
                            <span>Delete Selected</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ConsultationRequestTable