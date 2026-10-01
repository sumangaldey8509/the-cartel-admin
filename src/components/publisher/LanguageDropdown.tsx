import { LANGUAGES } from '@/constants/constData'
import { ChevronDown, X, Globe, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface LanguageMultiSelectProps {
    value: string[] // Array of language codes
    onChange: (value: string[]) => void
    label?: string
    placeholder?: string
    className?: string
    required?: boolean
    maxSelections?: number // Optional limit on number of selections
}

const LanguageMultiSelect = ({
    value,
    onChange,
    label = "Languages",
    placeholder = "Select languages",
    className = '',
    required = false,
    maxSelections
}: LanguageMultiSelectProps) => {


    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredLanguages = LANGUAGES.filter(language =>
        language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedLanguages = LANGUAGES.filter(l => value.includes(l.name))

    const handleToggleLanguage = (name: string) => {
        if (maxSelections && value.length >= maxSelections && !value.includes(name)) {
            return // Don't allow more selections if max is reached
        }

        if (value.includes(name)) {
            onChange(value.filter(code => code !== name))
        } else {
            onChange([...value, name])
        }
    }

    const handleRemoveLanguage = (name: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter(code => code !== name))
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
                        <Globe size={14} className="mr-2 text-gray-400" />
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
                    className={`w-full min-h-[42px] px-3 py-2 bg-[#1a1a1a] border ${isOpen ? 'border-[#bf953f]' : 'border-[#333]'} rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors`}
                >
                    <div className="flex-1 flex flex-wrap gap-1 items-center">
                        {selectedLanguages.length > 0 ? (
                            <>
                                {selectedLanguages.map(language => (
                                    <div
                                        key={language.name}
                                        className="inline-flex items-center space-x-1 px-2 py-1 bg-[#2a2a2a] rounded-md text-xs text-white mr-1 mb-1"
                                    >
                                        <span>{language.name}</span>
                                        <span className="text-gray-400 text-xs">({language.name})</span>
                                        <p

                                            onClick={(e) => handleRemoveLanguage(language.name, e)}
                                            className="text-gray-400 hover:text-white ml-1"
                                        >
                                            <X size={10} />
                                        </p>
                                    </div>
                                ))}
                                {selectedLanguages.length > 0 && (
                                    <p

                                        onClick={handleClearAll}
                                        className="text-xs text-gray-400 hover:text-white ml-1 mb-1"
                                    >
                                        Clear all
                                    </p>
                                )}
                            </>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-2 border-b border-[#333]">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search languages..."
                                className="w-full px-3 py-1.5 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>

                        {/* Languages List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredLanguages.length === 0 ? (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    {searchQuery ? 'No languages found' : 'No languages available'}
                                </div>
                            ) : (
                                <>
                                    {filteredLanguages.map((language) => {
                                        const isSelected = value.includes(language.name)
                                        const isDisabled = maxSelections && value.length >= maxSelections && !isSelected

                                        return (
                                            <button
                                                key={language.name}
                                                type="button"
                                                onClick={() => handleToggleLanguage(language.name)}
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
                                                        <div className="text-white text-sm">{language.name}</div>
                                                        <div className="text-gray-400 text-xs">{language.nativeName}</div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">{language.name}</div>
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
                                    Maximum {maxSelections} language{maxSelections !== 1 ? 's' : ''} selected
                                </div>
                            ) : selectedLanguages.length > 0 ? (
                                <div className="text-xs text-gray-400">
                                    Selected: {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400">
                                    No languages selected
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LanguageMultiSelect