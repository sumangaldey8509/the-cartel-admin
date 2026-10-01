import { ChevronDown, X, Folder, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Category {
    _id: string
    name: string
    parent?: {
        _id: string
        name: string
    } | null
}

interface CategoryMultiSelectProps {
    value: string[] // Array of category IDs
    onChange: (value: string[]) => void
    categories: Category[]
    label?: string
    placeholder?: string
    className?: string
    loading?: boolean
    required?: boolean
    maxSelections?: number // Optional limit on number of selections
}

const CategoryMultiSelect = ({
    value,
    onChange,
    categories,
    label = "Categories",
    placeholder = "Select categories",
    className = '',
    loading = false,
    required = false,
    maxSelections
}: CategoryMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.parent?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedCategories = categories.filter(c => value.includes(c._id))

    const handleToggleCategory = (categoryId: string) => {
        if (maxSelections && value.length >= maxSelections && !value.includes(categoryId)) {
            return // Don't allow more selections if max is reached
        }

        if (value.includes(categoryId)) {
            onChange(value.filter(id => id !== categoryId))
        } else {
            onChange([...value, categoryId])
        }
    }

    const handleRemoveCategory = (categoryId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter(id => id !== categoryId))
    }

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange([])
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-white flex items-center">
                        <Folder size={14} className="mr-2 text-blue-400" />
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {maxSelections && (
                        <span className="text-xs text-gray-400">
                            {value.length}/{maxSelections}
                        </span>
                    )}
                </div>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={loading}
                    className={`w-full min-h-[42px] px-3 py-2 bg-[#1a1a1a] border ${isOpen ? 'border-[#bf953f]' : 'border-[#333]'} rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <div className="flex-1 flex flex-wrap gap-1 items-center">
                        {loading ? (
                            <span className="text-gray-400">Loading categories...</span>
                        ) : selectedCategories.length > 0 ? (
                            <>
                                {selectedCategories.map(category => (
                                    <div
                                        key={category._id}
                                        className="inline-flex items-center space-x-1 px-2 py-1 bg-[#2a2a2a] rounded-md text-xs text-white mr-1 mb-1"
                                    >
                                        <span>{category.name}</span>
                                        {category.parent && (
                                            <span className="text-gray-400 text-xs">({category.parent.name})</span>
                                        )}
                                        <p
                                            onClick={(e) => handleRemoveCategory(category._id, e)}
                                            className="text-gray-400 hover:text-white ml-1 cursor-pointer"
                                        >
                                            <X size={10} />
                                        </p>
                                    </div>
                                ))}
                                {selectedCategories.length > 0 && (
                                    <p
                                        onClick={handleClearAll}
                                        className="text-xs text-gray-400 hover:text-white ml-1 mb-1 cursor-pointer"
                                    >
                                        Clear all
                                    </p>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>
                    {!loading && (
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                </button>

                {isOpen && !loading && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-2 border-b border-[#333]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full px-3 py-1.5 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>

                        {/* Categories List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredCategories.length === 0 ? (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    {searchQuery ? 'No categories found' : 'No categories available'}
                                </div>
                            ) : (
                                <>
                                    {filteredCategories.map((category) => {
                                        const isSelected = value.includes(category._id)
                                        const isDisabled = maxSelections && value.length >= maxSelections && !isSelected

                                        return (
                                            <button
                                                key={category._id}
                                                type="button"
                                                onClick={() => handleToggleCategory(category._id)}
                                                // disabled={isDisabled}
                                                className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] flex items-center justify-between ${isSelected ? 'bg-[#bf953f]/10' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-5 h-5 flex items-center justify-center border rounded ${isSelected ? 'bg-[#bf953f] border-[#bf953f]' : 'border-gray-600'}`}>
                                                        {isSelected && (
                                                            <Check size={12} className="text-black" />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-white text-sm">{category.name}</div>
                                                        {category.parent && (
                                                            <div className="text-gray-400 text-xs">
                                                                in {category.parent.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </>
                            )}
                        </div>

                        {/* Selected Count and Max Limit Warning */}
                        <div className="p-2 border-t border-[#333] bg-[#2a2a2a]">
                            {maxSelections && value.length >= maxSelections ? (
                                <div className="text-xs text-amber-400">
                                    Maximum {maxSelections} categor{maxSelections !== 1 ? 'ies' : 'y'} selected
                                </div>
                            ) : selectedCategories.length > 0 ? (
                                <div className="text-xs text-gray-400">
                                    Selected: {selectedCategories.length} categor{selectedCategories.length !== 1 ? 'ies' : 'y'}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400">
                                    No categories selected
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryMultiSelect