import { Search, Check, Loader2 } from 'lucide-react';
import { MarketplaceCategory } from '@/interface/marketplace';

interface CategoryDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedId: string;
    onSelect: (id: string, name: string) => void;
    categories: MarketplaceCategory[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const CategoryDropdown = ({
    isOpen,
    onToggle,
    selectedId,
    onSelect,
    categories,
    searchQuery,
    onSearchChange,
    loading,
    hasMore,
    onLoadMore,
    onScroll,
    dropdownRef
}: CategoryDropdownProps) => {
    const selectedCategory = categories.find(c => c._id === selectedId);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Parent Category (Optional)
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={onToggle}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                    <span className={selectedId ? 'text-white' : 'text-gray-400'}>
                        {selectedCategory?.name || 'Select category...'}
                    </span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-700">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder="Search categories..."
                                    className="w-full pl-8 pr-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div
                            className="overflow-y-auto flex-1"
                            onScroll={onScroll}
                        >
                            <button
                                onClick={() => {
                                    onSelect("", "");
                                    onToggle();
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-800 text-sm flex items-center gap-2"
                            >
                                <span className="text-gray-400">None (Root Category)</span>
                            </button>

                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    onClick={() => {
                                        onSelect(category._id, category.name);
                                        onToggle();
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-800 text-sm flex items-center gap-2 ${selectedId === category._id ? 'bg-purple-900/20' : ''
                                        }`}
                                    disabled={category.parent != null}
                                >
                                    {selectedId === category._id && (
                                        <Check className="w-4 h-4 text-purple-400" />
                                    )}
                                    {category.name}
                                </button>
                            ))}

                            {loading && (
                                <div className="p-2 text-center">
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                </div>
                            )}

                            {!loading && categories.length === 0 && (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    No categories found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDropdown;