"use client"

import Heading from "@/components/common/heading/heading"
import appClient from "@/lib/appClient"
import { useAppSelector } from "@/store/hooks/hooks"
import { useCallback, useEffect, useState, useRef } from "react"
import { MarketplaceCategory, Niches } from "@/interface/marketplace"

// Import components
import NichesSection from "@/components/marketplace/NichesSection"
import CategoriesSection from "@/components/marketplace/CategoriesSection"
import NicheModal from "@/components/marketplace/NicheModal"
import CategoryModal from "@/components/marketplace/CategoryModal"

const MarketplaceCategoryPage = () => {
    const [nichesData, setNichesData] = useState<Niches[]>([])
    const [marketplaceCategoryData, setMarketplaceCategoryData] = useState<MarketplaceCategory[]>([])

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [name, setName] = useState("")

    const [isNicheModalOpen, setIsNicheModalOpen] = useState(false)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [selectedCategoryRows, setSelectedCategoryRows] = useState<string[]>([])

    const authedUser = useAppSelector((state) => state.auth.user)
    const [nicheName, setNicheName] = useState("")
    const [categoryName, setCategoryName] = useState("")
    const [parentCategoryName, setParentCategoryName] = useState("")
    const [editingNiche, setEditingNiche] = useState<Niches | null>(null)
    const [editingCategory, setEditingCategory] = useState<MarketplaceCategory | null>(null)

    const [categorySearchQuery, setCategorySearchQuery] = useState("")
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
    const categoryDropdownRef = useRef<HTMLDivElement>(null)
    const [categoryDropdownPage, setCategoryDropdownPage] = useState(1)
    const [hasMoreCategories, setHasMoreCategories] = useState(true)
    const [loadingCategories, setLoadingCategories] = useState(false)

    // Niche CRUD operations
    const handleGetNiches = useCallback(async () => {
        setLoading(true)
        try {
            const response = await appClient.get("/api/marketplace/niches/get")
            if (response.data.status) {
                setNichesData(response.data.niches.docs)
            }
        } catch (error) {
            console.error("Error getting niche list", error)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreateNiche = async () => {
        if (!nicheName.trim()) return

        const payload = {
            _id: editingNiche?._id,
            name: nicheName.trim(),
            createdBy: authedUser?._id
        }

        try {
            if (editingNiche) {
                await appClient.post(`/api/marketplace/niches/update`, payload)
            } else {
                await appClient.post("/api/marketplace/niches/create", payload)
            }

            handleGetNiches()
            setNicheName("")
            setEditingNiche(null)
            setIsNicheModalOpen(false)
        } catch (error) {
            console.error("Error saving niche", error)
        }
    }

    const handleDeleteNiches = async (ids: string[]) => {
        if (!ids.length) return

        try {
            await appClient.delete("/api/marketplace/niches/delete", {
                params: { ids: JSON.stringify(ids) }
            })
            handleGetNiches()
            setSelectedRows([])
        } catch (error) {
            console.error("Error deleting niches", error)
        }
    }

    const handleEditNiche = (niche: Niches) => {
        setEditingNiche(niche)
        setNicheName(niche.name)
        setIsNicheModalOpen(true)
    }

    // Marketplace Category CRUD operations
    const handleGetMarketplaceCategory = useCallback(async () => {
        setLoading(true)
        try {
            const response = await appClient.get("/api/marketplace/category/get", {
                params: { page, limit, name }
            })
            if (response.data.status) {
                setMarketplaceCategoryData(response.data.marketplaceCategory.docs)
                setTotalDocs(response.data.marketplaceCategory.totalDocs)
            }
        } catch (error) {
            console.error("Error getting category list", error)
        } finally {
            setLoading(false)
        }
    }, [name, page, limit])

    const loadMoreCategories = async () => {
        if (loadingCategories || !hasMoreCategories) return

        setLoadingCategories(true)
        try {
            const response = await appClient.get("/api/marketplace/category/get", {
                params: { page: categoryDropdownPage, limit: 20, name: categorySearchQuery }
            })

            if (response.data.status) {
                const newCategories = response.data.marketplaceCategory.docs
                setHasMoreCategories(newCategories.length === 20)
                setCategoryDropdownPage(prev => prev + 1)
            }
        } catch (error) {
            console.error("Error loading more categories", error)
        } finally {
            setLoadingCategories(false)
        }
    }

    const handleCreateMarketplaceCategory = async () => {
        if (!categoryName.trim()) return

        const payload = {
            _id: editingCategory?._id,
            name: categoryName.trim(),
            createdBy: authedUser?._id,
            parent: parentCategoryName || undefined
        }

        try {
            if (editingCategory) {
                await appClient.post(`/api/marketplace/category/update`, payload)
            } else {
                await appClient.post("/api/marketplace/category/create", payload)
            }

            handleGetMarketplaceCategory()
            setCategoryName("")
            setParentCategoryName("")
            setEditingCategory(null)
            setIsCategoryModalOpen(false)
        } catch (error) {
            console.error("Error saving category", error)
        }
    }

    const handleDeleteCategory = async (ids: string[]) => {
        if (!ids.length) return

        try {
            await appClient.delete("/api/marketplace/category/delete", {
                params: { ids: JSON.stringify(ids) }
            })
            handleGetMarketplaceCategory()
            setSelectedCategoryRows([])
        } catch (error) {
            console.error("Error deleting categories", error)
        }
    }

    const handleEditCategory = (category: MarketplaceCategory) => {
        setEditingCategory(category)
        setCategoryName(category.name)
        setParentCategoryName(category.parent?._id || "")
        setIsCategoryModalOpen(true)
    }

    // Selection handlers
    const handleSelectNicheRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectCategoryRow = (id: string) => {
        setSelectedCategoryRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectAllNiches = () => {
        if (selectedRows.length === nichesData.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(nichesData.map(niche => niche._id))
        }
    }

    const handleSelectAllCategories = () => {
        if (selectedCategoryRows.length === marketplaceCategoryData.length) {
            setSelectedCategoryRows([])
        } else {
            setSelectedCategoryRows(marketplaceCategoryData.map(cat => cat._id))
        }
    }

    // Pagination and search
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedCategoryRows([])
    }

    const handleCategorySearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        handleGetMarketplaceCategory()
    }

    const handleClearSearch = () => {
        setName("")
        setPage(1)
        handleGetMarketplaceCategory()
    }

    const handleRefresh = () => {
        handleGetNiches()
        handleGetMarketplaceCategory()
    }

    const handleCategoryDropdownSearch = async (query: string) => {
        setCategorySearchQuery(query)
        setCategoryDropdownPage(1)
        setLoadingCategories(true)

        try {
            const response = await appClient.get("/api/marketplace/category/get", {
                params: { page: 1, limit: 20, name: query }
            })

            if (response.data.status) {
                setMarketplaceCategoryData(response.data.marketplaceCategory.docs)
                setHasMoreCategories(response.data.marketplaceCategory.docs.length === 20)
                setCategoryDropdownPage(2)
            }
        } catch (error) {
            console.error("Error searching categories", error)
        } finally {
            setLoadingCategories(false)
        }
    }

    // Effects
    useEffect(() => {
        handleGetNiches()
    }, [handleGetNiches])

    useEffect(() => {
        handleGetMarketplaceCategory()
    }, [handleGetMarketplaceCategory])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-black p-4 text-white">
            <div className="mx-auto">
                <Heading
                    heading="Marketplace Configuration"
                    subHeading="Configure your marketplace at one place"
                    showButton={false}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <NichesSection
                        nichesData={nichesData}
                        loading={loading}
                        selectedRows={selectedRows}
                        onSelectRow={handleSelectNicheRow}
                        onSelectAll={handleSelectAllNiches}
                        onEdit={handleEditNiche}
                        onDelete={handleDeleteNiches}
                        onOpenModal={() => {
                            setEditingNiche(null)
                            setNicheName("")
                            setIsNicheModalOpen(true)
                        }}
                        onRefresh={handleRefresh}
                    />

                    <CategoriesSection
                        categoriesData={marketplaceCategoryData}
                        loading={loading}
                        selectedRows={selectedCategoryRows}
                        onSelectRow={handleSelectCategoryRow}
                        onSelectAll={handleSelectAllCategories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        onOpenModal={() => {
                            setEditingCategory(null)
                            setCategoryName("")
                            setParentCategoryName("")
                            setIsCategoryModalOpen(true)
                        }}
                        onRefresh={handleRefresh}
                        searchValue={name}
                        onSearchChange={setName}
                        onSearchSubmit={handleCategorySearch}
                        onSearchClear={handleClearSearch}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalDocs={totalDocs}
                        itemsPerPage={limit}
                    />
                </div>
            </div>

            <NicheModal
                isOpen={isNicheModalOpen}
                onClose={() => {
                    setIsNicheModalOpen(false)
                    setEditingNiche(null)
                    setNicheName("")
                }}
                onSubmit={handleCreateNiche}
                nicheName={nicheName}
                setNicheName={setNicheName}
                editing={!!editingNiche}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false)
                    setEditingCategory(null)
                    setCategoryName("")
                    setParentCategoryName("")
                }}
                onSubmit={handleCreateMarketplaceCategory}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryName={parentCategoryName}
                setParentCategoryName={setParentCategoryName}
                editing={!!editingCategory}
                categories={marketplaceCategoryData}
                showCategoryDropdown={showCategoryDropdown}
                setShowCategoryDropdown={setShowCategoryDropdown}
                categorySearchQuery={categorySearchQuery}
                setCategorySearchQuery={handleCategoryDropdownSearch}
                loadingCategories={loadingCategories}
                hasMoreCategories={hasMoreCategories}
                loadMoreCategories={loadMoreCategories}
                categoryDropdownRef={categoryDropdownRef}
            />
        </div>
    )
}

export default MarketplaceCategoryPage