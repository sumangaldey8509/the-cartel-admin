// components/common/IconPicker.tsx
"use client"

import { useState } from "react"
import {
    Folder,
    FolderOpen,
    Tag,
    Hash,
    Star,
    Bookmark,
    Calendar,
    FileText,
    Image,
    Video,
    Music,
    Code,
    Database,
    Globe,
    Map,
    Camera,
    Bell,
    Heart,
    TrendingUp,
    Users,
    ShoppingBag,
    Package,
    Home,
    Settings,
    Search,
    Download,
    Upload,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Check,
    X,
    Plus,
    Minus,
    AlertCircle,
    Info,
    HelpCircle,
    Link,
    ExternalLink,
    Copy,
    Edit,
    Trash2,
    Save,
    Share,
    MessageCircle,
    Phone,
    Mail
} from "lucide-react"

const ALL_ICONS = [
    { name: "folder", component: Folder },
    { name: "folder-open", component: FolderOpen },
    { name: "tag", component: Tag },
    { name: "hash", component: Hash },
    { name: "star", component: Star },
    { name: "bookmark", component: Bookmark },
    { name: "calendar", component: Calendar },
    { name: "file-text", component: FileText },
    { name: "image", component: Image },
    { name: "video", component: Video },
    { name: "music", component: Music },
    { name: "code", component: Code },
    { name: "database", component: Database },
    { name: "globe", component: Globe },
    { name: "map", component: Map },
    { name: "camera", component: Camera },
    { name: "bell", component: Bell },
    { name: "heart", component: Heart },
    { name: "trending-up", component: TrendingUp },
    { name: "users", component: Users },
    { name: "shopping-bag", component: ShoppingBag },
    { name: "package", component: Package },
    { name: "home", component: Home },
    { name: "settings", component: Settings },
    { name: "search", component: Search },
    { name: "download", component: Download },
    { name: "upload", component: Upload },
    { name: "eye", component: Eye },
    { name: "eye-off", component: EyeOff },
    { name: "lock", component: Lock },
    { name: "unlock", component: Unlock },
    { name: "check", component: Check },
    { name: "x", component: X },
    { name: "plus", component: Plus },
    { name: "minus", component: Minus },
    { name: "alert-circle", component: AlertCircle },
    { name: "info", component: Info },
    { name: "help-circle", component: HelpCircle },
    { name: "link", component: Link },
    { name: "external-link", component: ExternalLink },
    { name: "copy", component: Copy },
    { name: "edit", component: Edit },
    { name: "trash", component: Trash2 },
    { name: "save", component: Save },
    { name: "share", component: Share },
    { name: "message-circle", component: MessageCircle },
    { name: "phone", component: Phone },
    { name: "mail", component: Mail },
]

interface IconPickerProps {
    selectedIcon: string | null
    onIconSelect: (iconName: string | null) => void
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconSelect }) => {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredIcons = ALL_ICONS.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleClearIcon = () => {
        onIconSelect(null)
    }

    const renderIcon = (iconName: string, size: number = 20) => {
        const icon = ALL_ICONS.find(i => i.name === iconName)
        if (!icon) return null
        const IconComponent = icon.component
        return <IconComponent size={size} />
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-[#C0C0C0] placeholder:text-[#666] focus:outline-none focus:border-[#bf953f] text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-[#bf953f]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Selected Icon Preview */}
            {selectedIcon && (
                <div className="p-4 bg-[#0f0f0f] border border-[#333] rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 rounded-lg flex items-center justify-center">
                                {renderIcon(selectedIcon, 24)}
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">
                                    Selected Icon
                                </div>
                                <div className="text-[#888] text-xs">
                                    {selectedIcon}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClearIcon}
                            className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-[#666] hover:text-red-400 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Icons Grid */}
            <div className="border border-[#333] rounded-lg overflow-hidden">
                <div className="max-h-60 overflow-y-auto p-2">
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 gap-2">
                        {filteredIcons.map((icon) => (
                            <button
                                key={icon.name}
                                onClick={() => onIconSelect(icon.name)}
                                className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${selectedIcon === icon.name
                                    ? 'bg-gradient-to-br from-[#bf953f]/30 to-[#d4af37]/30 border border-[#bf953f]'
                                    : 'bg-[#0f0f0f] hover:bg-[#1a1a1a] border border-transparent hover:border-[#333]'
                                    }`}
                                title={icon.name}
                            >
                                <icon.component className="h-5 w-5 text-[#C0C0C0]" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-[#666] text-sm">
                    No icons found matching "{searchTerm}"
                </div>
            )}
        </div>
    )
}

export default IconPicker