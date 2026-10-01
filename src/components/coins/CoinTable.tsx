import { Coin } from "@/interface/coins"
import { CheckSquare, Edit, Square, Trash2 } from "lucide-react"



// Reusable Table Component
interface TableProps {
    data: Coin[]
    selectedRows: string[]
    onSelectRow: (id: string) => void
    onSelectAll: () => void
    onEdit: (coin: Coin) => void
    onDelete: (payload: string[]) => void
}

const CoinTable: React.FC<TableProps> = ({ data, selectedRows, onSelectRow, onSelectAll, onEdit, onDelete }) => {
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
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Coin</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden md:table-cell">Symbol</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden lg:table-cell">Description</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Launch Date</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm hidden sm:table-cell">Status</th>
                            <th className="px-4 py-3 text-left text-[#bf953f] font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                        {data.map((coin) => (
                            <tr
                                key={coin._id}
                                className={`hover:bg-[#1a1a1a]/50 transition-colors ${selectedRows.includes(coin._id) ? 'bg-[#bf953f]/10' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onSelectRow(coin._id)}
                                        className="flex items-center text-[#bf953f] hover:text-[#d4af37] transition-colors"
                                    >
                                        {selectedRows.includes(coin._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#bf953f] flex items-center justify-center mr-3">
                                            <span className="text-[#bf953f] font-bold text-xs">
                                                {coin.symbol.slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-text-heading font-medium">{coin.name}</div>
                                            <div className="text-[#C0C0C0] text-sm md:hidden">{coin.symbol}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#C0C0C0] hidden md:table-cell">{coin.symbol}</td>
                                <td className="px-4 py-3 text-[#C0C0C0] text-sm hidden lg:table-cell max-w-xs truncate">
                                    {coin.description}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-[#C0C0C0] text-sm">
                                        {new Date(coin.launchDate).toLocaleDateString()}
                                    </div>
                                    <div className="text-[#666] text-xs">
                                        {coin.time}
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coin.status === 'upcoming'
                                        ? 'bg-[#bf953f]/20 text-[#bf953f] border border-[#bf953f]/30'
                                        : 'bg-[#00C851]/20 text-[#00C851] border border-[#00C851]/30'
                                        }`}>
                                        {coin.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onEdit(coin)}
                                            className="p-1.5 rounded-lg bg-[#333] hover:bg-[#444] transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} className="text-[#bf953f]" />
                                        </button>
                                        <button
                                            onClick={() => onDelete([coin._id])}
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
                    <div className="text-[#666] mb-2">No coins found</div>
                    <div className="text-[#C0C0C0] text-sm">Create your first coin to get started</div>
                </div>
            )}
        </div>
    )
}


export default CoinTable