import { COUNTRIES } from '@/constants/constData'
import { ChevronDown, Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CountryDropdownProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    required?: boolean
}

const CountryDropdown = ({
    value,
    onChange,
    label = "Country",
    placeholder = "Select country",
    className = '',
    required = false
}: CountryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedCountry = COUNTRIES.find(c => c.name === value || c.code === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-sm font-medium text-white flex items-center">
                    <Globe size={14} className="mr-2 text-gray-400" />
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 bg-[#1a1a1a] border ${isOpen ? 'border-[#bf953f]' : 'border-[#333]'} rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors`}
                >
                    <div className="flex items-center space-x-2">
                        {selectedCountry ? (
                            <>
                                <span className="text-lg">{selectedCountry.flag}</span>
                                <span className="text-white">{selectedCountry.name}</span>
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
                                placeholder="Search countries..."
                                className="w-full px-3 py-1.5 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Countries List */}
                        <div className="overflow-y-auto flex-1">
                            {filteredCountries.length === 0 ? (
                                <div className="p-3 text-center text-gray-400 text-sm">
                                    No countries found
                                </div>
                            ) : (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                            onChange(country.name)
                                            setIsOpen(false)
                                            setSearchQuery('')
                                        }}
                                        className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] flex items-center space-x-2 ${value === country.name ? 'bg-[#bf953f]/10' : ''}`}
                                    >
                                        <span className="text-lg">{country.flag}</span>
                                        <div>
                                            <div className="text-white text-sm">{country.name}</div>
                                            <div className="text-gray-400 text-xs">{country.code}</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CountryDropdown