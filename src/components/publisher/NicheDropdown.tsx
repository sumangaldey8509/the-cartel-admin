import { ChevronDown, Tag, Check, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Niche {
    _id: string
    name: string
}

interface NicheDropdownProps {
    value: string[] | null
    onChange: (value: string[]) => void
    niches: Niche[]
    label?: string
    placeholder?: string
    className?: string
    required?: boolean
    loading?: boolean
    multiple?: boolean
}

const NicheDropdown = ({
    value,
    onChange,
    niches,
    label = "Niche",
    placeholder = "Select niche",
    className = '',
    required = false,
    loading = false,
    multiple = false
}: NicheDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Normalize selected values based on mode
    const selectedIds = multiple
        ? (Array.isArray(value) ? value : [])
        : (value && !Array.isArray(value) ? [value] : [])

    const filteredNiches = niches.filter(niche =>
        niche.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const isSelected = (id: string) => selectedIds.includes(id)

    const handleSelect = (id: string) => {
        const newSelection = isSelected(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id]
        onChange(newSelection)

    }

    const handleClearAll = () => {
        onChange([])
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Render button content based on mode and selection
    const renderButtonContent = () => {
        if (loading) {
            return <span className="text-gray-400">Loading niches...</span>
        }

        if (selectedIds.length === 0) {
            return <span className="text-gray-400">{placeholder}</span>
        }

        if (!multiple) {
            const niche = niches.find(n => n._id === selectedIds[0])
            return <span className="text-white">{niche?.name || placeholder}</span>
        }

        // Multiple mode
        const selectedNiches = niches.filter(n => selectedIds.includes(n._id))
        if (selectedNiches.length === 1) {
            return <span className="text-white">{selectedNiches[0].name}</span>
        }

        // Show count or first two names
        const firstTwo = selectedNiches.slice(0, 2).map(n => n.name).join(', ')
        const remaining = selectedNiches.length - 2
        return (
            <span className="text-white truncate">
                {firstTwo}{remaining > 0 ? ` +${remaining}` : ''}
            </span>
        )
    }

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-sm font-medium text-white flex items-center">
                    <Tag size={14} className="mr-2 text-purple-400" />
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={loading}
                    className={`w-full px-3 py-2 bg-[#1a1a1a] border ${isOpen ? 'border-[#bf953f]' : 'border-[#333]'} rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <div className="flex items-center space-x-2 truncate">
                        {renderButtonContent()}
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
                                placeholder="Search niches..."
                                className="w-full px-3 py-1.5 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Clear all (only in multi-select and when items selected) */}
                        {multiple && selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] flex items-center space-x-2 border-b border-[#333] text-sm text-gray-300"
                            >
                                <X size={14} className="text-gray-400" />
                                <span>Clear all</span>
                            </button>
                        )}

                        {/* Niches List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredNiches.length === 0 ? (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    {searchQuery ? 'No niches found' : 'No niches available'}
                                </div>
                            ) : (
                                filteredNiches.map((niche) => {
                                    const selected = isSelected(niche._id)
                                    return (
                                        <button
                                            key={niche._id}
                                            type="button"
                                            onClick={() => handleSelect(niche._id)}
                                            className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] flex items-center justify-between ${selected ? (multiple ? 'bg-[#2a2a2a]' : 'bg-[#bf953f]/10') : ''}`}
                                        >
                                            <span className="text-white text-sm">{niche.name}</span>
                                            {selected && (
                                                <Check size={14} className="text-[#bf953f]" />
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NicheDropdown