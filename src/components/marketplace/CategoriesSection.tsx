import { Plus, RefreshCw, Edit2, Trash2, Loader2 } from 'lucide-react';
import SearchBar from './SearchBar';
import SelectionBar from './SelectionBar';
import Pagination from '../common/paginatoin/pagination';

interface CategoriesSectionProps {
    categoriesData: any[];
    loading: boolean;
    selectedRows: string[];
    onSelectRow: (id: string) => void;
    onSelectAll: () => void;
    onEdit: (category: any) => void;
    onDelete: (ids: string[]) => void;
    onOpenModal: () => void;
    onRefresh: () => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    onSearchClear: () => void;
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    totalDocs: number;
    itemsPerPage: number;
}

const CategoriesSection = ({
    categoriesData,
    loading,
    selectedRows,
    onSelectRow,
    onSelectAll,
    onEdit,
    onDelete,
    onOpenModal,
    onRefresh,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onSearchClear,
    page,
    totalPages,
    onPageChange,
    totalDocs,
    itemsPerPage
}: CategoriesSectionProps) => {
    const allSelected = categoriesData.length > 0 && selectedRows.length === categoriesData.length;

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Categories</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage marketplace categories</p>
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
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>
            </div>

            <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                onClear={onSearchClear}
                onSubmit={onSearchSubmit}
                placeholder="Search categories..."
            />

            {selectedRows.length > 0 && (
                <SelectionBar
                    count={selectedRows.length}
                    onDelete={() => onDelete(selectedRows)}
                    type="category"
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
                                <th className="p-3 text-left">Category Name</th>
                                <th className="p-3 text-left">Parent Category</th>
                                <th className="p-3 text-left">Created By</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : categoriesData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-400">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                categoriesData.map((category) => (
                                    <tr key={category._id} className="border-t border-gray-800 hover:bg-gray-800/30">
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(category._id)}
                                                onChange={() => onSelectRow(category._id)}
                                                className="rounded border-gray-600 bg-gray-700"
                                            />
                                        </td>
                                        <td className="p-3 font-medium">{category.name}</td>
                                        <td className="p-3 text-gray-400">
                                            {category.parent?.name || '—'}
                                        </td>
                                        <td className="p-3 text-gray-400 text-sm">
                                            {category.createdBy?.email || 'System'}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onEdit(category)}
                                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-400" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete([category._id])}
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

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        totalItems={totalDocs}
                        itemsPerPage={itemsPerPage}
                    />
                </div>
            )}

            <p className="text-gray-400 text-sm mt-3">
                Total Categories: {totalDocs}
            </p>
        </div>
    );
};

export default CategoriesSection;