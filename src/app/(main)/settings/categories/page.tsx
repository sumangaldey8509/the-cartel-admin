"use client"

import CategoryTable from "@/components/category/CategoryTable"
import Heading from "@/components/common/heading/heading"
import Pagination from "@/components/common/paginatoin/pagination"
import { CategoryInterface } from "@/interface/cateogry"
import appClient from "@/lib/appClient"
import { useAppSelector } from "@/store/hooks/hooks"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useCallback, useEffect, useState } from "react"
import { Search, Filter, X, RefreshCw, Plus } from "lucide-react"
import CategoryForm from "@/components/category/CategoryForm"

const CategoriesPage = () => {

    const [data, setData] = useState<CategoryInterface[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [search, setSearch] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<CategoryInterface | null>(null)
    const [selectedRows, setSelectedRows] = useState<string[]>([])

    const authedUser = useAppSelector((state) => state.auth.user)

    const handleCategories = useCallback(async () => {
        setLoading(true)
        try {
            const response = await appClient.get("/api/category/get", {
                params: { search, page, limit }
            })
            console.log(response)
            if (response.data.status) {
                setData(response.data.categories.docs)
                setTotalDocs(response.data.categories.totalDocs)
            }

        } catch (error) {
            console.log("getting error while category list", error)
        } finally {
            setLoading(false)
        }
    }, [search, page, limit])

    useEffect(() => {
        handleCategories()
    }, [handleCategories])

    const handleDelete = async (payload: string[]) => {
        console.log(payload)
        if (!payload) return;

        const toastId = toastLoading("Deleting Category item(s)", {
            description: `Removing ${payload.length}(s) submissions from the system`
        })

        try {
            const res = await appClient.delete("/api/category/delete", {
                params: { ids: JSON.stringify(payload) }
            })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Category item Delete", {
                    description: res.data.message
                })
                handleCategories()
                setSelectedRows([])
            }

        } catch (error) {
            console.log("getting error while deleing publisher request", error)
        }
    }

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        setSelectedRows(prev =>
            prev.length === data.length ? [] : data.map(member => member._id)
        )
    }

    const handleEdit = (cateogry: CategoryInterface) => {
        setSelectedCategories(cateogry)
        setIsModalOpen(true)
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedRows([]) // Clear selection on page change
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1) // Reset to first page on new search
        handleCategories()
    }

    const handleClearSearch = () => {
        setSearch("")
        setPage(1)
    }

    const handleRefresh = () => {
        handleCategories()
    }

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="Categories"
                    subHeading="Manage your news categories module"
                    showButton={false}
                />

                <CategoryForm
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedCategories(null)
                    }}
                    category={selectedCategories}
                    onSuccess={handleCategories}
                />


                {/* Search and Filter Section */}
                <div className="mt-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="flex-1 w-full lg:w-auto">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by category name, slug..."
                                        className="w-full pl-10 pr-10 py-2.5 bg-[#0f0f0f] border border-[#333] rounded-lg text-[#C0C0C0] placeholder:text-[#666] focus:outline-none focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f]/30 transition-all duration-200"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-[#bf953f] transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] hover:text-white hover:border-[#444] transition-all duration-200"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium">Refresh</span>
                            </button>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="text-sm font-medium">Add Category</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats and Filters */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-[#bf953f]/10 text-[#bf953f] rounded-full">
                                {totalDocs} Total Categories
                            </div>
                            <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                                {data.filter(c => c.isActive).length} Active
                            </div>
                            <div className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                                {data.filter(c => c.isFeatured).length} Featured
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <div className="text-[#666]">Show:</div>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value))
                                    setPage(1)
                                }}
                                className="bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#bf953f]"
                            >
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Selected Items Bar */}
                {selectedRows.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#bf953f]/10 to-[#8B0000]/10 rounded-xl border border-[#bf953f]/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#bf953f]/20 flex items-center justify-center">
                                <span className="text-[#bf953f] font-bold">{selectedRows.length}</span>
                            </div>
                            <div>
                                <div className="text-[#bf953f] font-medium">
                                    {selectedRows.length} categor{selectedRows.length !== 1 ? 'ies' : 'y'} selected
                                </div>
                                <div className="text-[#888] text-sm">
                                    Click on categories to select/deselect
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedRows([])}
                                className="px-3 py-1.5 border border-[#333] text-[#C0C0C0] rounded-lg text-sm hover:bg-[#1a1a1a] transition-colors"
                            >
                                Clear Selection
                            </button>
                            <button
                                onClick={() => handleDelete(selectedRows)}
                                className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#bf953f]/30 border-t-[#bf953f] mx-auto"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <RefreshCw className="h-6 w-6 text-[#bf953f] animate-pulse" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-[#bf953f] font-medium">Loading Categories</div>
                                <div className="text-[#666] text-sm mt-1">Fetching your category data...</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {data.length === 0 ? (
                                <div className="text-center py-16 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222]">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                        <Search className="h-10 w-10 text-[#666]" />
                                    </div>
                                    <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">
                                        {search ? "No matching categories found" : "No categories found"}
                                    </h3>
                                    <p className="text-[#666] text-sm mb-6">
                                        {search ? `Try a different search term or clear the search` : "Start by creating your first category"}
                                    </p>
                                    {search && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="px-4 py-2 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <CategoryTable
                                        data={data}
                                        selectedRows={selectedRows}
                                        onSelectRow={handleSelectRow}
                                        onSelectAll={handleSelectAll}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />

                                    {totalPages > 1 && (
                                        <div className="mt-8">
                                            <Pagination
                                                currentPage={page}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                                totalItems={totalDocs}
                                                itemsPerPage={limit}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CategoriesPage