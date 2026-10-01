import { Memberstype } from "@/interface/member"
import { CheckSquare, Edit, Square, Trash2 } from "lucide-react"

interface TableProps {
    data: Memberstype[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (member: Memberstype) => void
    onDelete: (payload: string[]) => void
}

const MembersTable: React.FC<TableProps> = ({
    data,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete
}) => {
    const allSelected = data.length > 0 && selectedRows.length === data.length

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
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Email</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden md:table-cell">Telegram Username</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden lg:table-cell">Trading Experience</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Plan</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Joined Date</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {data.map((member, index) => (
                            <tr
                                key={member._id}
                                className={`hover:bg-[#1a1a1a]/50 transition-colors ${selectedRows.includes(member._id) ? 'bg-[#bf953f]/10' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onSelectRow(member._id)}
                                        className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                    >
                                        {selectedRows.includes(member._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm">{index + 1}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="text-[#C0C0C0] text-sm">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#C0C0C0] text-sm hidden md:table-cell">
                                    {member.telegramUsername || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-[#C0C0C0] text-sm hidden lg:table-cell">
                                    {member.tradingExperience}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm max-w-[120px] truncate">
                                        {member?.plan?.name || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onEdit(member)}
                                            className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} className="text-[#bf953f]" />
                                        </button>
                                        <button
                                            onClick={() => onDelete([member._id])}
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
                    <div className="text-[#666] mb-2">No members found</div>
                    <div className="text-[#C0C0C0] text-sm">No members have registered yet</div>
                </div>
            )}
        </div>
    )
}

export default MembersTable