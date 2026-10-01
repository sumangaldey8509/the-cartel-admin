import { Plus, RefreshCw, Edit2, Trash2, Loader2 } from 'lucide-react';
import SelectionBar from './SelectionBar';

interface NichesSectionProps {
    nichesData: any[];
    loading: boolean;
    selectedRows: string[];
    onSelectRow: (id: string) => void;
    onSelectAll: () => void;
    onEdit: (niche: any) => void;
    onDelete: (ids: string[]) => void;
    onOpenModal: () => void;
    onRefresh: () => void;
}

const NichesSection = ({
    nichesData,
    loading,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
    onOpenModal,
    onRefresh
}: NichesSectionProps) => {
    const allSelected = nichesData.length > 0 && selectedRows.length === nichesData.length;

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Niches</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage marketplace niches</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRefresh}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onOpenModal}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Niche
                    </button>
                </div>
            </div>

            {selectedRows.length > 0 && (
                <SelectionBar
                    count={selectedRows.length}
                    onDelete={() => onDelete(selectedRows)}
                    type="niche"
                />
            )}

            <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-800/50">
                                <th className="p-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={onSelectAll}
                                        className="rounded border-gray-600 bg-gray-700"
                                    />
                                </th>
                                <th className="p-3 text-left">Niche Name</th>
                                <th className="p-3 text-left">Created By</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : nichesData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-400">
                                        No niches found
                                    </td>
                                </tr>
                            ) : (
                                nichesData.map((niche) => (
                                    <tr key={niche._id} className="border-t border-gray-800 hover:bg-gray-800/30">
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(niche._id)}
                                                onChange={() => onSelectRow(niche._id)}
                                                className="rounded border-gray-600 bg-gray-700"
                                            />
                                        </td>
                                        <td className="p-3">{niche.name}</td>
                                        <td className="p-3 text-gray-400 text-sm">
                                            {niche.createdBy?.email || 'System'}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onEdit(niche)}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete([niche._id])}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-gray-400 text-sm mt-3">
                Total Niches: {nichesData.length}
            </p>
        </div>
    );
};

export default NichesSection;