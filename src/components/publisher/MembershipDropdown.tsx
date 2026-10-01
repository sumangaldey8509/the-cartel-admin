import { Crown, Star, Zap, Users, ChevronDown, Gem } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface MembershipType {
    id: string
    name: string
    icon: React.ElementType
    color: string
    popular?: boolean
}

const MEMBERSHIP_TYPES: MembershipType[] = [
    {
        id: 'basic',
        name: 'Basic',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
    },
    {
        id: 'pro',
        name: 'Pro',
        icon: Zap,
        color: 'from-purple-500 to-pink-500',
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        icon: Star,
        color: 'from-amber-500 to-orange-500'
    },
    {
        id: 'vip',
        name: 'VIP Elite',
        icon: Crown,
        color: 'from-emerald-500 to-teal-500'
    }
]

interface MembershipDropdownProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    required?: boolean
    showDetails?: boolean
}

const MembershipDropdown = ({
    value,
    onChange,
    label = "Membership",
    placeholder = "Select membership",
    className = '',
    required = false,
    showDetails = true
}: MembershipDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredMemberships = MEMBERSHIP_TYPES.filter(membership =>
        membership.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedMembership = MEMBERSHIP_TYPES.find(m => m.id === value || m.name === value)

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
                    <Gem size={14} className="mr-2 text-gray-400" />
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 bg-[#1a1a1a] border ${isOpen ? 'border-[#bf953f]' : 'border-[#333]'} rounded-lg flex items-center justify-between hover:bg-[#222] transition-colors group`}
                >
                    <div className="flex items-center space-x-2">
                        {selectedMembership ? (
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedMembership.color} flex items-center justify-center`}>
                                    <selectedMembership.icon size={16} className="text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-medium">{selectedMembership.name}</div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-3 border-b border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-white font-semibold">Choose Your Plan</h3>
                                {selectedMembership && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange('')
                                            setSearchQuery('')
                                        }}
                                        className="text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Search */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search plans..."
                                className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#333] rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#bf953f]"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Membership Cards */}
                        <div className="overflow-y-auto flex-1 p-2">
                            {filteredMemberships.length === 0 ? (
                                <div className="p-4 text-center">
                                    <Gem size={32} className="mx-auto text-gray-500 mb-2" />
                                    <div className="text-gray-400 text-sm">No plans found</div>
                                    <div className="text-gray-500 text-xs mt-1">Try a different search term</div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredMemberships.map((membership) => (
                                        <button
                                            key={membership.id}
                                            type="button"
                                            onClick={() => {
                                                onChange(membership.id)
                                                setIsOpen(false)
                                                setSearchQuery('')
                                            }}
                                            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${value === membership.id
                                                ? 'border-[#bf953f] bg-[#bf953f]/10'
                                                : 'border-[#333] bg-[#2a2a2a] hover:border-[#444]'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${membership.color} flex items-center justify-center flex-shrink-0`}>
                                                        <membership.icon size={18} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-white font-semibold">{membership.name}</h4>
                                                            {membership.popular && (
                                                                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                                                                    Popular
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center mt-2">
                                                        </div>
                                                    </div>
                                                </div>
                                                {value === membership.id && (
                                                    <div className="w-5 h-5 rounded-full bg-[#bf953f] flex items-center justify-center flex-shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MembershipDropdown