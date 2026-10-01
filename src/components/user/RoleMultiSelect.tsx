import { RoleInterface } from '@/interface/roles'
import { ChevronDown, X, Folder, Check, Plus } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface RoleMultiSelectProps {
    value: string[] // Array of role IDs
    onChange: (value: string[]) => void
    roles: RoleInterface[]
    label?: string
    placeholder?: string
    className?: string
    loading?: boolean
    required?: boolean
    maxSelections?: number // Optional limit on number of selections
    maxVisibleSelected?: number // Optional: Control how many selected roles are visible
}

const RoleMultiSelect = ({
    value,
    onChange,
    roles,
    label = "Roles",
    placeholder = "Select roles",
    className = '',
    loading = false,
    required = false,
    maxSelections,
    maxVisibleSelected // New prop to control visible selected roles
}: RoleMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedRoles = roles.filter(role => value.includes(role._id))

    // Split selected roles into visible and hidden based on maxVisibleSelected
    const visibleSelectedRoles = maxVisibleSelected && selectedRoles.length > maxVisibleSelected
        ? selectedRoles.slice(0, maxVisibleSelected)
        : selectedRoles

    const hiddenSelectedCount = maxVisibleSelected && selectedRoles.length > maxVisibleSelected
        ? selectedRoles.length - maxVisibleSelected
        : 0

    const handleToggleRole = (roleId: string) => {
        if (maxSelections && value.length >= maxSelections && !value.includes(roleId)) {
            return // Don't allow more selections if max is reached
        }

        if (value.includes(roleId)) {
            onChange(value.filter(id => id !== roleId))
        } else {
            onChange([...value, roleId])
        }
    }

    const handleRemoveRole = (roleId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter(id => id !== roleId))
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
                    {(maxSelections || maxVisibleSelected) && (
                        <div className="flex items-center space-x-2">
                            {maxSelections && (
                                <span className="text-xs text-gray-400">
                                    {value.length}/{maxSelections}
                                </span>
                            )}
                            {maxVisibleSelected && selectedRoles.length > maxVisibleSelected && (
                                <span className="text-xs text-[#bf953f]">
                                    {maxVisibleSelected} visible
                                </span>
                            )}
                        </div>
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
                            <span className="text-gray-400">Loading roles...</span>
                        ) : selectedRoles.length > 0 ? (
                            <>
                                {/* Visible selected roles */}
                                {visibleSelectedRoles.map(role => (
                                    <div
                                        key={role._id}
                                        className="inline-flex items-center space-x-1 px-2 py-1 bg-[#2a2a2a] rounded-md text-xs text-white mr-1 mb-1"
                                    >
                                        <span>{role.roleName}</span>
                                        <p
                                            onClick={(e) => handleRemoveRole(role._id, e)}
                                            className="text-gray-400 hover:text-white ml-1 cursor-pointer"

                                        >
                                            <X size={10} />
                                        </p>
                                    </div>
                                ))}

                                {/* Show +X more if there are hidden roles */}
                                {hiddenSelectedCount > 0 && (
                                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-[#bf953f]/20 border border-[#bf953f]/30 rounded-md text-xs text-[#bf953f] mr-1 mb-1">
                                        <Plus size={10} />
                                        <span>+{hiddenSelectedCount} more</span>
                                    </div>
                                )}

                                {/* Clear all button - always visible when there are selected roles */}
                                {selectedRoles.length > 0 && (
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
                    <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg max-h-100 overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-2 border-b border-[#333]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search roles..."
                                className="w-full px-3 py-1.5 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>

                        {/* Roles List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredRoles.length === 0 ? (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    {searchQuery ? 'No roles found' : 'No roles available'}
                                </div>
                            ) : (
                                <>
                                    {filteredRoles.map((role) => {
                                        const isSelected = value.includes(role._id)

                                        return (
                                            <button
                                                key={role._id}
                                                type="button"
                                                onClick={() => handleToggleRole(role._id)}

                                                className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] flex items-center justify-between ${isSelected ? 'bg-[#bf953f]/10' : ''}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-5 h-5 flex items-center justify-center border rounded ${isSelected ? 'bg-[#bf953f] border-[#bf953f]' : 'border-gray-600'}`}>
                                                        {isSelected && (
                                                            <Check size={12} className="text-black" />
                                                        )}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className="text-white text-sm">{role.roleName}</div>
                                                        <div className="text-gray-400 text-xs">
                                                            {role.contents?.length || 0} permissions
                                                        </div>
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="text-[#bf953f] text-xs">
                                                        Selected
                                                    </div>
                                                )}
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
                                    Maximum {maxSelections} role{maxSelections !== 1 ? 's' : ''} selected
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-400">
                                        Selected: {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''}
                                        {maxVisibleSelected && selectedRoles.length > maxVisibleSelected && (
                                            <span className="ml-2 text-[#bf953f]">
                                                ({maxVisibleSelected} visible in tag)
                                            </span>
                                        )}
                                    </div>
                                    {selectedRoles.length > 0 && (
                                        <button
                                            onClick={handleClearAll}
                                            className="text-xs text-gray-400 hover:text-white"
                                            type="button"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RoleMultiSelect