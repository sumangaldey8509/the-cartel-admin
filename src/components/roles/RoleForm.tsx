"use client"

import { RoleInterface } from "@/interface/roles"
import { Save, X, Shield, Key, Settings, Newspaper, Users, Lock, CheckSquare, Square, Home, Coins, GitPullRequest, Server } from "lucide-react"
import { useState, useEffect, JSX } from "react"
import appClient from "@/lib/appClient"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useAppSelector } from "@/store/hooks/hooks"

interface RoleFormProps {
    role: RoleInterface | null
    onSuccess: () => void
    onCancel: () => void
}

interface ContentPermission {
    name: string
    label: string
    icon: JSX.Element
    permissions: string[]
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        roleName: "",
        contents: [] as string[]
    })
    const [loading, setLoading] = useState(false)

    const authedUser = useAppSelector((state) => state.auth.user)

    // Define available content permissions
    // Sidebar items as available content
    const availableContents: ContentPermission[] = [
        {
            name: "dashboard",
            label: "Dashboard",
            icon: <Home size={16} className="text-blue-400" />,
            permissions: ["read"]
        },
        {
            name: "coins",
            label: "Coins",
            icon: <Coins size={16} className="text-yellow-400" />,
            permissions: ["create", "read", "update", "delete", "approve", "reject"]
        },
        {
            name: "members",
            label: "Members",
            icon: <Users size={16} className="text-green-400" />,
            permissions: ["create", "read", "update", "delete", "block", "verify", "assign-role"]
        },
        {
            name: "news",
            label: "News",
            icon: <Newspaper size={16} className="text-purple-400" />,
            permissions: ["create", "read", "update", "delete", "publish", "archive", "feature"]
        },
        {
            name: "request",
            label: "Request",
            icon: <GitPullRequest size={16} className="text-pink-400" />,
            permissions: ["create", "read", "update", "delete", "approve", "reject", "process"]
        },
        {
            name: "consultationRequest",
            label: "Consultation Request",
            icon: <GitPullRequest size={16} className="text-indigo-400" />,
            permissions: ["create", "read", "update", "delete", "approve", "reject", "schedule"]
        },
        {
            name: "publishers",
            label: "Publishers",
            icon: <Users size={16} className="text-cyan-400" />,
            permissions: ["create", "read", "update", "delete", "verify", "block", "feature"]
        },
        {
            name: "adserver",
            label: "Ad Server",
            icon: <Server size={16} className="text-cyan-400" />,
            permissions: ["create", "read", "update", "delete"]
        },
        {
            name: "settings",
            label: "Settings",
            icon: <Settings size={16} className="text-red-400" />,
            permissions: ["create", "read", "update", "delete"]
        }
    ]

    // Initialize form data when role prop changes
    useEffect(() => {
        if (role) {
            setFormData({
                roleName: role.roleName,
                contents: role.contents || []
            })
        } else {
            setFormData({
                roleName: "",
                contents: []
            })
        }
    }, [role])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePermissionChange = (permissionString: string) => {
        setFormData(prev => {
            const isSelected = prev.contents.includes(permissionString)
            if (isSelected) {
                return {
                    ...prev,
                    contents: prev.contents.filter(p => p !== permissionString)
                }
            } else {
                return {
                    ...prev,
                    contents: [...prev.contents, permissionString]
                }
            }
        })
    }

    const handleSelectAllForContent = (contentName: string) => {
        const content = availableContents.find(c => c.name === contentName)
        if (!content) return

        const contentPermissions = content.permissions.map(perm => `${contentName}:${perm}`)
        const allSelected = contentPermissions.every(perm => formData.contents.includes(perm))

        setFormData(prev => {
            if (allSelected) {
                // Remove all permissions for this content
                return {
                    ...prev,
                    contents: prev.contents.filter(perm => !perm.startsWith(`${contentName}:`))
                }
            } else {
                // Add all permissions for this content
                const newPermissions = contentPermissions.filter(
                    perm => !prev.contents.includes(perm)
                )
                return {
                    ...prev,
                    contents: [...prev.contents, ...newPermissions]
                }
            }
        })
    }

    const handleSelectAllPermissions = () => {
        const allPermissions = availableContents.flatMap(content =>
            content.permissions.map(perm => `${content.name}:${perm}`)
        )
        const allSelected = allPermissions.every(perm => formData.contents.includes(perm))

        setFormData(prev => ({
            ...prev,
            contents: allSelected ? [] : allPermissions
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.roleName.trim()) {
            alert("Please enter a role name")
            return
        }

        const isEdit = !!role
        const toastId = toastLoading(
            isEdit ? "Updating Role..." : "Creating Role...",
            {
                description: isEdit ? "Updating role permissions" : "Creating new role with selected permissions"
            }
        )

        setLoading(true)

        try {
            const payload = {
                roleId: role?._id,
                roleName: formData.roleName,
                contents: formData.contents,
                createdBy: authedUser?._id
            }

            let response
            if (isEdit) {
                response = await appClient.post(`/api/roles/update`, payload)
            } else {
                response = await appClient.post("/api/roles/create", payload)
            }

            if (response.data.status) {
                toastUpdate(toastId, "success",
                    isEdit ? "Role Updated" : "Role Created",
                    {
                        description: response.data.message
                    }
                )
                onSuccess()
            } else {
                toastUpdate(toastId, "error", "Error", {
                    description: response.data.message || "Something went wrong"
                })
            }
        } catch (error) {
            console.log("Error saving role:", error)
            const errMessage = error instanceof Error ? error.message : "Failed to save role"
            toastUpdate(toastId, "error", "Error", {
                description: errMessage
            })
        } finally {
            setLoading(false)
        }
    }

    const getContentSelectedCount = (contentName: string) => {
        const content = availableContents.find(c => c.name === contentName)
        if (!content) return 0
        return content.permissions.filter(perm =>
            formData.contents.includes(`${contentName}:${perm}`)
        ).length
    }

    return (
        <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222] p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield size={20} className="text-[#bf953f]" />
                        {role ? "Edit Role" : "Create Role"}
                    </h2>
                    <p className="text-[#666] text-sm mt-1">
                        {role ? "Modify role permissions" : "Define a new role with specific permissions"}
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#666] hover:text-white transition-all duration-200"
                    title="Cancel"
                >
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Name Input */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#C0C0C0]">
                        Role Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#bf953f]/50 focus:border-transparent transition-all"
                            placeholder="e.g., Editor, Admin, Viewer"
                            required
                        />
                        <Key className="absolute right-3 top-3 h-5 w-5 text-[#666]" />
                    </div>
                    <p className="text-xs text-[#666] mt-1">
                        A descriptive name for this role (e.g., "Content Editor", "System Administrator")
                    </p>
                </div>

                {/* Permissions Header */}
                <div className="flex items-center justify-between pt-4 border-t border-[#333]">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Lock size={18} className="text-[#bf953f]" />
                            Permissions
                        </h3>
                        <p className="text-sm text-[#666] mt-1">
                            Select permissions for this role
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSelectAllPermissions}
                        className="text-xs px-3 py-1.5 bg-[#222] hover:bg-[#333] text-[#C0C0C0] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        {availableContents.flatMap(c => c.permissions).length === formData.contents.length ? (
                            <CheckSquare size={12} />
                        ) : (
                            <Square size={12} />
                        )}
                        Select All
                    </button>
                </div>

                {/* Permissions Selection */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {availableContents.map((content) => {
                        const selectedCount = getContentSelectedCount(content.name)
                        const totalCount = content.permissions.length
                        const allSelected = selectedCount === totalCount

                        return (
                            <div key={content.name} className="bg-[#0f0f0f] rounded-lg border border-[#333] p-4">
                                {/* Content Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {content.icon}
                                        <div>
                                            <h4 className="text-white font-medium text-sm">
                                                {content.label}
                                            </h4>
                                            <div className="text-xs text-[#666]">
                                                {selectedCount} of {totalCount} permissions selected
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectAllForContent(content.name)}
                                        className="text-xs px-3 py-1 bg-[#222] hover:bg-[#333] text-[#C0C0C0] rounded transition-colors flex items-center gap-1.5"
                                    >
                                        {allSelected ? (
                                            <CheckSquare size={12} />
                                        ) : (
                                            <Square size={12} />
                                        )}
                                        {allSelected ? "Deselect All" : "Select All"}
                                    </button>
                                </div>

                                {/* Permission Checkboxes */}
                                <div className="grid grid-cols-2 gap-2">
                                    {content.permissions.map((permission) => {
                                        const permissionString = `${content.name}:${permission}`
                                        const isSelected = formData.contents.includes(permissionString)

                                        return (
                                            <label
                                                key={permissionString}
                                                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all ${isSelected
                                                    ? 'bg-[#bf953f]/10 border border-[#bf953f]/30'
                                                    : 'hover:bg-[#222] border border-transparent'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handlePermissionChange(permissionString)}
                                                    className="hidden"
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected
                                                    ? 'bg-[#bf953f] border-[#bf953f]'
                                                    : 'bg-[#222] border-[#444]'
                                                    }`}>
                                                    {isSelected && <CheckSquare size={12} className="text-white" />}
                                                </div>
                                                <span className={`text-sm ${isSelected ? 'text-white' : 'text-[#C0C0C0]'
                                                    }`}>
                                                    {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Selected Permissions Summary */}
                <div className="pt-4 border-t border-[#333]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#C0C0C0]">Selected Permissions</span>
                        <span className="text-sm font-medium text-[#bf953f]">
                            {formData.contents.length} permission{formData.contents.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="max-h-32 overflow-y-auto bg-[#0f0f0f] rounded-lg p-3 border border-[#333]">
                        {formData.contents.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.contents.slice(0, 8).map((permission, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-[#222] text-[#C0C0C0] text-xs rounded-md border border-[#333]"
                                        title={permission}
                                    >
                                        {permission}
                                    </span>
                                ))}
                                {formData.contents.length > 8 && (
                                    <span className="px-2 py-1 bg-[#bf953f]/20 text-[#bf953f] text-xs rounded-md">
                                        +{formData.contents.length - 8} more
                                    </span>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-[#666] text-center py-2">
                                No permissions selected
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#333]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 bg-[#222] hover:bg-[#333] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        <X size={18} />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                {role ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {role ? "Update Role" : "Create Role"}
                            </>
                        )}
                    </button>
                </div>

                {/* Role Code Preview */}
                {formData.roleName && (
                    <div className="text-xs text-[#666] bg-[#0f0f0f] p-3 rounded-lg border border-[#333]">
                        <div className="flex items-center justify-between mb-1">
                            <span>Role Code:</span>
                            <code className="text-[#bf953f] font-mono">
                                {formData.roleName.toLowerCase().replace(/\s+/g, '-')}
                            </code>
                        </div>
                        <p className="text-[#666]">
                            This will be used as the unique identifier for API calls
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}

export default RoleForm