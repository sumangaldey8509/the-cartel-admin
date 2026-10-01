import { X } from 'lucide-react';
import CategoryDropdown from './CategoryDropdown';
import { MarketplaceCategory } from '@/interface/marketplace';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
    parentCategoryName: string;
    setParentCategoryName: (id: string) => void;
    editing: boolean;
    loading?: boolean;
    categories: MarketplaceCategory[];
    showCategoryDropdown: boolean;
    setShowCategoryDropdown: (show: boolean) => void;
    categorySearchQuery: string;
    setCategorySearchQuery: (query: string) => void;
    loadingCategories: boolean;
    hasMoreCategories: boolean;
    loadMoreCategories: () => void;
    categoryDropdownRef: React.RefObject<HTMLDivElement | null>;
}

const CategoryModal = ({
    isOpen,
    onClose,
    onSubmit,
    categoryName,
    setCategoryName,
    parentCategoryName,
    setParentCategoryName,
    editing,
    loading = false,
    categories,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categorySearchQuery,
    setCategorySearchQuery,
    loadingCategories,
    hasMoreCategories,
    loadMoreCategories,
    categoryDropdownRef
}: CategoryModalProps) => {
    if (!isOpen) return null;

    const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50 && !loadingCategories && hasMoreCategories) {
            loadMoreCategories();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">
                        {editing ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="Enter category name"
                            autoFocus
                        />
                    </div>

                    <CategoryDropdown
                        isOpen={showCategoryDropdown}
                        onToggle={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        selectedId={parentCategoryName}
                        onSelect={setParentCategoryName}
                        categories={categories}
                        searchQuery={categorySearchQuery}
                        onSearchChange={setCategorySearchQuery}
                        loading={loadingCategories}
                        hasMore={hasMoreCategories}
                        onLoadMore={loadMoreCategories}
                        onScroll={handleDropdownScroll}
                        dropdownRef={categoryDropdownRef}
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            disabled={!categoryName.trim() || loading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;