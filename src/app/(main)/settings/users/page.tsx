"use client"

import Heading from "@/components/common/heading/heading"
import Pagination from "@/components/common/paginatoin/pagination"
import appClient from "@/lib/appClient"
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useCallback, useEffect, useState, useRef } from "react"
import { Search, X, RefreshCw, Plus, Filter, User, Users, UserCheck, UserX, Eye, EyeOff, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserInterface } from "@/interface/user"
import UserListTable from "@/components/user/UserListTable"
import { RoleInterface } from "@/interface/roles"
import RoleMultiSelect from "@/components/user/RoleMultiSelect"
import { editUser } from "@/store/slices/manageUserSlice"

const UserManagePage = () => {

    const router = useRouter();
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useAppDispatch()

    const [data, setData] = useState<UserInterface[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")

    const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
    const [selectedRows, setSelectedRows] = useState<string[]>([])


    const [roles, setRoles] = useState<RoleInterface[]>([])
    const [rolesLoading, setRolesLoading] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    // New status filter state
    const [statusFilter, setStatusFilter] = useState<string>("all") // "all", "active", "inactive"

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(searchInput)
            setPage(1) // Reset to first page on new search
        }, 500) // 500ms debounce delay

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchInput])

    const handleGetRoles = useCallback(async () => {
        setRolesLoading(true)
        try {
            const response = await appClient.get("/api/roles/get")
            if (response.data.status) {
                setRoles(response.data.roles)
            }
        } catch (error) {
            console.log("getting error while fetching roles list", error)
        } finally {
            setRolesLoading(false)
        }
    }, [])

    useEffect(() => {
        handleGetRoles()
    }, [handleGetRoles])

    const handelSelectRoles = (id: string[]) => {
        setSelectedRoles(id)
        setPage(1) // Reset page when roles filter changes
    }

    const handleGetUser = useCallback(async () => {
        setLoading(true)
        try {
            const params: any = {
                search,
                page,
                limit,
                status: statusFilter === "all" ? "all" : statusFilter
            }

            if (selectedRoles.length > 0) {
                params.roles = JSON.stringify(selectedRoles)
            }

            const response = await appClient.get("/api/auth/getUser", {
                params
            })
            if (response.data.status) {
                setData(response.data.users.docs)
                setTotalDocs(response.data.users.totalDocs)
            }

        } catch (error) {
            console.log("getting error while category list", error)
        } finally {
            setLoading(false)
        }
    }, [search, page, limit, selectedRoles, statusFilter])

    useEffect(() => {
        handleGetUser()
    }, [handleGetUser])

    const handleDelete = async (payload: string[]) => {
        if (!payload) return;

        const toastId = toastLoading("Deleting User(s)", {
            description: `Removing ${payload.length} user(s) from the system`
        })

        try {
            const res = await appClient.delete("/api/auth/delete", {
                params: { ids: JSON.stringify(payload) }
            })

            if (res.data.status) {
                toastUpdate(toastId, "success", "User(s) Deleted", {
                    description: res.data.message
                })
                handleGetUser()
                setSelectedRows([])
            }

        } catch (error) {
            console.log("getting error while deleing user", error)
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

    const handleEdit = (user: UserInterface) => {
        dispatch(editUser(user))
        router.push("/settings/users/manage")
    }

    const handleAddUser = () => {
        dispatch(editUser(null)) // Clear any existing user data
        router.push("/settings/users/manage")
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedRows([]) // Clear selection on page change
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        handleGetUser()
    }

    const handleClearSearch = () => {
        setSearchInput("")
        setSearch("")
        setPage(1)
    }

    const handleRefresh = () => {
        handleGetUser()
    }

    const handleToggleActive = async (userId: string, isActive: boolean) => {
        const toastId = toastLoading(
            "Updating User...",
            {
                description: "Updating user information"
            }
        )
        try {
            let submitData = {
                _id: userId,
                isUserActive: isActive
            }
            try {
                const response = await appClient.post(`/api/auth/update`, submitData)

                if (response.data.status) {
                    toastUpdate(toastId, "success",
                        "User Updated",
                        {
                            description: response.data.message || "User updated successfully!"
                        }
                    )
                    handleGetUser()
                }

            } catch (error: any) {
                console.log("Error saving user:", error)
                const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
                toastUpdate(toastId, "error", "Operation Failed", {
                    description: errorMessage
                })
            } finally {

            }

        } catch (error) {
            console.error("Failed to toggle user active status:", error);
        }
    };

    const handleClearFilters = () => {
        setSearchInput("")
        setSearch("")
        setSelectedRoles([])
        setStatusFilter("all")
        setPage(1)
    }

    const totalPages = Math.ceil(totalDocs / limit)

    // Calculate active/inactive counts (you might want to get this from your API)
    const activeUsersCount = data.filter(user => user.isUserActive).length
    const inactiveUsersCount = data.filter(user => !user.isUserActive).length

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="User Management"
                    subHeading="Manage all system users, their roles and permissions"
                    showButton={false}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[#888] text-sm">Total Users</div>
                                <div className="text-white text-2xl font-semibold mt-1">{totalDocs}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#bf953f]/20 to-[#d4af37]/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-[#bf953f]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[#888] text-sm">Active Users</div>
                                <div className="text-green-400 text-2xl font-semibold mt-1">{activeUsersCount}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[#888] text-sm">Inactive Users</div>
                                <div className="text-red-400 text-2xl font-semibold mt-1">{inactiveUsersCount}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                                <UserX className="h-6 w-6 text-red-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-[#333] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[#888] text-sm">This Page</div>
                                <div className="text-[#C0C0C0] text-2xl font-semibold mt-1">{data.length}</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Bar - Now takes less width */}
                        <div className="w-full lg:w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full pl-10 pr-10 py-2.5 bg-[#0f0f0f] border border-[#333] rounded-lg text-[#C0C0C0] placeholder:text-[#666] focus:outline-none focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f]/30 transition-all duration-200"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        title="Clear search"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-[#bf953f] transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Section - Takes remaining space */}
                        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto">
                            {/* Status Filter */}
                            <div className="flex-1 w-full sm:w-auto">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
                                    <select
                                        aria-label="Filter by status"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value)
                                            setPage(1)
                                        }}
                                        className="w-full pl-10 pr-4 py-2.5 px-3 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg appearance-none focus:outline-none focus:border-[#bf953f] focus:ring-1 focus:ring-[#bf953f]/30 transition-all duration-200"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">
                                            Active
                                        </option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ChevronDown className="h-4 w-4 text-[#666]" />
                                    </div>
                                </div>
                            </div>

                            {/* Role Filter - Takes more space */}
                            <div className="flex-1 w-full sm:w-auto">
                                <RoleMultiSelect
                                    value={selectedRoles}
                                    onChange={handelSelectRoles}
                                    roles={roles}
                                    label=""
                                    placeholder="Filter by roles"
                                    loading={rolesLoading}
                                    maxVisibleSelected={2}
                                    className="h-full"
                                />
                            </div>

                            {/* Clear Filters Button */}
                            {(searchInput || selectedRoles.length > 0 || statusFilter !== "all") && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] hover:text-white hover:border-[#444] transition-all duration-200 whitespace-nowrap"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="text-sm font-medium">Clear Filters</span>
                                </button>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] hover:text-white hover:border-[#444] transition-all duration-200 whitespace-nowrap"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="text-sm font-medium">Refresh</span>
                                </button>

                                <button
                                    onClick={handleAddUser}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm font-medium">Add User</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(search || selectedRoles.length > 0 || statusFilter !== "all") && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <div className="text-[#888] text-sm">Active filters:</div>
                            {search && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#bf953f]/10 text-[#bf953f] rounded-full text-sm">
                                    <Search size={12} />
                                    <span>{search}</span>
                                    <button 
                                        onClick={handleClearSearch} 
                                        className="ml-1 text-[#bf953f]/70 hover:text-[#bf953f]"
                                        title="Clear search filter"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                            {selectedRoles.length > 0 && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                                    <Users size={12} />
                                    <span>{selectedRoles.length} role(s)</span>
                                    <button 
                                        onClick={() => setSelectedRoles([])} 
                                        className="ml-1 text-blue-400/70 hover:text-blue-400"
                                        title="Clear role filter"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                            {statusFilter !== "all" && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                                    {statusFilter === "active" ? <Eye size={12} /> : <EyeOff size={12} />}
                                    <span>{statusFilter === "active" ? "Active" : "Inactive"}</span>
                                    <button onClick={() => setStatusFilter("all")} className="ml-1 text-green-400/70 hover:text-green-400" title="Clear status filter">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 bg-[#bf953f]/10 text-[#bf953f] rounded-full text-sm font-medium">
                                    {totalDocs} Total Users
                                </div>
                                {selectedRows.length > 0 && (
                                    <div className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium">
                                        {selectedRows.length} Selected
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="text-[#666] text-sm">Show:</div>
                            <select
                                aria-label="Items per page"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value))
                                    setPage(1)
                                }}
                                className="bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#bf953f] appearance-none"
                            >
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                            <ChevronDown className="h-4 w-4 text-[#666] -ml-6 pointer-events-none" />
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
                                    {selectedRows.length} user{selectedRows.length !== 1 ? 's' : ''} selected
                                </div>
                                <div className="text-[#888] text-sm">
                                    Click on users to select/deselect
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
                                <div className="text-[#bf953f] font-medium">Loading Users</div>
                                <div className="text-[#666] text-sm mt-1">Fetching user data...</div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {data.length === 0 ? (
                                <div className="text-center py-16 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222]">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                        <Users className="h-10 w-10 text-[#666]" />
                                    </div>
                                    <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">
                                        {search ? "No matching users found" : "No users found"}
                                    </h3>
                                    <p className="text-[#666] text-sm mb-6">
                                        {search ? `Try a different search term or clear the search` : "Start by creating your first user"}
                                    </p>
                                    <div className="flex items-center justify-center gap-3">
                                        {search && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="px-4 py-2 bg-[#0f0f0f] border border-[#333] text-[#C0C0C0] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        )}
                                        <button
                                            onClick={handleAddUser}
                                            className="px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            <Plus className="h-4 w-4 inline mr-2" />
                                            Add User
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UserListTable
                                        data={data}
                                        selectedRows={selectedRows}
                                        onSelectRow={handleSelectRow}
                                        onSelectAll={handleSelectAll}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleActive={handleToggleActive}
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

export default UserManagePage