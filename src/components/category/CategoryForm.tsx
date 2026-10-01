// components/category/CategoryForm.tsx
"use client"

import { CategoryInterface } from "@/interface/cateogry"
import { useEffect, useState } from "react"
import { X, Save, Loader2 } from "lucide-react"
import IconPicker from "@/components/common/IconPicker"
import appClient from "@/lib/appClient"
import { useAppSelector } from "@/store/hooks/hooks"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"

interface CategoryFormProps {
    isOpen: boolean
    onClose: () => void
    category?: CategoryInterface | null
    onSuccess: () => void
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    isOpen,
    onClose,
    category,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<CategoryInterface[]>([])
    const [loadingCategories, setLoadingCategories] = useState(false)

    const authedUser = useAppSelector((state) => state.auth.user)

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent: "",
        metaTitle: "",
        metaDescription: "",
        isFeatured: false,
        icon: "",
        isActive: true,
        createdBy: authedUser?._id
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load categories for parent dropdown
    useEffect(() => {
        if (isOpen) {
            fetchCategories()
        }
    }, [isOpen])

    // Initialize form with category data when editing
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || "",
                description: category.description || "",
                parent: category?.parent?._id || "",
                metaTitle: category.metaTitle || "",
                metaDescription: category.metaDescription || "",
                isFeatured: category.isFeatured || false,
                icon: category.icon || "",
                isActive: category.isActive,
                createdBy: authedUser?._id
            })
        } else {
            // Reset form for create mode
            setFormData({
                name: "",
                description: "",
                parent: "",
                metaTitle: "",
                metaDescription: "",
                isFeatured: false,
                icon: "",
                isActive: true,
                createdBy: authedUser?._id
            })
        }
        setErrors({})
    }, [category])

    const fetchCategories = async () => {
        setLoadingCategories(true)
        try {
            const response = await appClient.get("/api/category/get", {
                params: { limit: 100 }
            })
            if (response.data.status) {
                // Filter out current category if editing to avoid self-parenting
                const filteredCategories = category
                    ? response.data.categories.docs.filter((cat: CategoryInterface) => cat._id !== category._id)
                    : response.data.categories.docs
                setCategories(filteredCategories)
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
            // toast("error", "Failed to load categories")
        } finally {
            setLoadingCategories(false)
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required"
        }

        if (formData.name.length > 100) {
            newErrors.name = "Category name must be less than 100 characters"
        }

        if (formData.description && formData.description.length > 300) {
            newErrors.description = "Description must be less than 300 characters"
        }

        if (formData.metaTitle && formData.metaTitle.length > 70) {
            newErrors.metaTitle = "Meta title must be less than 70 characters"
        }

        if (formData.metaDescription && formData.metaDescription.length > 160) {
            newErrors.metaDescription = "Meta description must be less than 160 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        const toastId = toastLoading("Creating Coin...", {
            description: "Please wait while we create the Coin"
        })

        try {
            const payload = {
                ...formData,
                // Clean up empty strings for optional fields
                description: formData.description || undefined,
                parent: formData.parent || undefined,
                metaTitle: formData.metaTitle || undefined,
                metaDescription: formData.metaDescription || undefined,
                icon: formData.icon || undefined,
                _id: category?._id || ""
            }

            console.log({ payload })

            let response
            if (category) {
                // Update existing category
                response = await appClient.post(`/api/category/update`, payload)
            } else {
                // Create new category
                response = await appClient.post("/api/category/create", payload)
                console.log({ response })
            }

            if (response?.data.status) {
                // toast("success", category ? "Category updated successfully" : "Category created successfully")
                onSuccess()
                onClose()
            } else {
                console.log("false", { response })

                toastUpdate(toastId, "error", "Category creation failed", {
                    description: response.data.message || "Category creation failed"
                })
            }
        } catch (error: any) {
            console.error("Error saving category:", error)

            // Handle duplicate key error
            if (error.response?.data?.error?.includes("duplicate")) {
                // toast("error", "Category name already exists")
                setErrors({ name: "A category with this name already exists" })
            } else {
                // toast("error", error.response?.data?.message || "Failed to save category")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleIconSelect = (iconName: string | null) => {
        handleChange("icon", iconName || "")
    }

    // Reset form when drawer closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: "",
                description: "",
                parent: "",
                metaTitle: "",
                metaDescription: "",
                isFeatured: false,
                icon: "",
                isActive: true,
                createdBy: authedUser?._id
            })
            setErrors({})
        }
    }, [isOpen])

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 flex max-w-full">
                <div className="relative w-screen max-w-2xl">
                    <div className="flex h-full flex-col bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] shadow-2xl border-l border-[#333]">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#222]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {category ? "Edit Category" : "Create New Category"}
                                    </h2>
                                    <p className="text-sm text-[#888] mt-1">
                                        {category ? "Update category details" : "Add a new category to your system"}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-[#333] text-[#666] hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Basic Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-l-4 border-[#bf953f] pl-3">
                                        Basic Information
                                    </h3>

                                    {/* Name - Required */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#C0C0C0] mb-2">
                                            Category Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            placeholder="Enter category name"
                                            className={`w-full px-4 py-2.5 bg-[#0f0f0f] border rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:ring-1 transition-all ${errors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                                                : 'border-[#333] focus:border-[#bf953f] focus:ring-[#bf953f]/30'
                                                }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                        )}
                                        <p className="mt-1 text-xs text-[#666]">
                                            Required. Maximum 100 characters.
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#C0C0C0] mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            placeholder="Enter category description (optional)"
                                            rows={3}
                                            className={`w-full px-4 py-2.5 bg-[#0f0f0f] border rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:ring-1 transition-all ${errors.description
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                                                : 'border-[#333] focus:border-[#bf953f] focus:ring-[#bf953f]/30'
                                                }`}
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                                        )}
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-[#666]">Optional. Maximum 300 characters.</span>
                                            <span className={formData.description.length > 300 ? 'text-red-400' : 'text-[#666]'}>
                                                {formData.description.length}/300
                                            </span>
                                        </div>
                                    </div>

                                    {/* Parent Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#C0C0C0] mb-2">
                                            Parent Category
                                        </label>
                                        <div className="relative">
                                            {loadingCategories ? (
                                                <div className="flex items-center justify-center py-3 bg-[#0f0f0f] border border-[#333] rounded-lg">
                                                    <Loader2 className="h-4 w-4 animate-spin text-[#666]" />
                                                    <span className="ml-2 text-sm text-[#666]">Loading categories...</span>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.parent}
                                                    onChange={(e) => handleChange("parent", e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f]/30 appearance-none"
                                                >
                                                    <option value="">No parent (Top-level category)</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat._id} value={cat._id} disabled={category ? cat?.parent?.name === category?.name : false} >
                                                            {cat.name.toLocaleUpperCase()} | {cat.parent && `Parent - ${cat.parent.name.toLocaleUpperCase()}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#666]">
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-[#666]">
                                            Optional. Select a parent category to create nested categories.
                                        </p>
                                    </div>
                                </div>

                                {/* SEO Information Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-l-4 border-blue-500 pl-3">
                                        SEO Information
                                    </h3>

                                    {/* Meta Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#C0C0C0] mb-2">
                                            Meta Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.metaTitle}
                                            onChange={(e) => handleChange("metaTitle", e.target.value)}
                                            placeholder="Enter meta title for SEO (optional)"
                                            className={`w-full px-4 py-2.5 bg-[#0f0f0f] border rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:ring-1 transition-all ${errors.metaTitle
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                                                : 'border-[#333] focus:border-[#bf953f] focus:ring-[#bf953f]/30'
                                                }`}
                                        />
                                        {errors.metaTitle && (
                                            <p className="mt-1 text-sm text-red-400">{errors.metaTitle}</p>
                                        )}
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-[#666]">Optional. Recommended: 50-60 characters.</span>
                                            <span className={formData.metaTitle.length > 70 ? 'text-red-400' : 'text-[#666]'}>
                                                {formData.metaTitle.length}/70
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#C0C0C0] mb-2">
                                            Meta Description
                                        </label>
                                        <textarea
                                            value={formData.metaDescription}
                                            onChange={(e) => handleChange("metaDescription", e.target.value)}
                                            placeholder="Enter meta description for SEO (optional)"
                                            rows={2}
                                            className={`w-full px-4 py-2.5 bg-[#0f0f0f] border rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:ring-1 transition-all ${errors.metaDescription
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                                                : 'border-[#333] focus:border-[#bf953f] focus:ring-[#bf953f]/30'
                                                }`}
                                        />
                                        {errors.metaDescription && (
                                            <p className="mt-1 text-sm text-red-400">{errors.metaDescription}</p>
                                        )}
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-[#666]">Optional. Recommended: 150-160 characters.</span>
                                            <span className={formData.metaDescription.length > 160 ? 'text-red-400' : 'text-[#666]'}>
                                                {formData.metaDescription.length}/160
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Icon Selection Section */}
                                {/* <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-l-4 border-purple-500 pl-3">
                                        Icon Selection
                                    </h3>
                                    <IconPicker
                                        selectedIcon={formData.icon}
                                        onIconSelect={handleIconSelect}
                                    />
                                    <p className="text-xs text-[#666]">
                                        Optional. Select an icon to represent this category visually.
                                    </p>
                                </div> */}

                                {/* Settings Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white border-l-4 border-green-500 pl-3">
                                        Settings
                                    </h3>

                                    <div className="space-y-3">
                                        {/* Featured Toggle */}
                                        <label className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#333] rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                                            <div>
                                                <div className="font-medium text-white text-sm">Featured Category</div>
                                                <div className="text-sm text-[#666]">
                                                    Mark this category as featured
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isFeatured}
                                                    onChange={(e) => handleChange("isFeatured", e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isFeatured
                                                    ? 'bg-gradient-to-r from-[#bf953f] to-[#d4af37]'
                                                    : 'bg-[#333]'
                                                    }`}>
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isFeatured ? 'transform translate-x-7' : 'transform translate-x-1'
                                                        }`} />
                                                </div>
                                            </div>
                                        </label>

                                        {/* Active Toggle */}
                                        <label className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#333] rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                                            <div>
                                                <div className="font-medium text-white text-sm">Active Status</div>
                                                <div className="text-sm text-[#666]">
                                                    Category will be visible to users
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => handleChange("isActive", e.target.checked)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-12 h-6 rounded-full transition-colors ${formData.isActive
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                                                    : 'bg-[#333]'
                                                    }`}>
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'transform translate-x-7' : 'transform translate-x-1'
                                                        }`} />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer with Actions */}
                        <div className="px-6 py-4 border-t border-[#333] bg-gradient-to-r from-[#1a1a1a] to-[#222]">
                            <div className="flex flex-row sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="text-sm px-4 py-3 border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.name.trim()}
                                    className="text-sm px-4 py-3 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2 flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            {category ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            {category ? "Update Category" : "Create Category"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryForm