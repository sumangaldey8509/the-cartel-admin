"use client"

import Heading from "@/components/common/heading/heading"
import appClient from "@/lib/appClient"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useCallback, useEffect, useState } from "react"
import { Search, X, RefreshCw, Save, Plus, Shield } from "lucide-react"
import RolesTable from "@/components/roles/RolesTable"
import { RoleInterface } from "@/interface/roles"
import RoleForm from "@/components/roles/RoleForm"

const RolesPage = () => {
    const [data, setData] = useState<RoleInterface[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<RoleInterface | null>(null)
    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [showForm, setShowForm] = useState(false)


    const handleGetRoles = useCallback(async () => {
        setLoading(true)
        try {
            const response = await appClient.get("/api/roles/get")
            if (response.data.status) {
                setData(response.data.roles)
            }
        } catch (error) {
            console.log("getting error while fetching roles list", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        handleGetRoles()
    }, [handleGetRoles])

    const handleDelete = async (payload: string[]) => {
        if (!payload) return;

        const toastId = toastLoading("Deleting Role(s)", {
            description: `Removing ${payload.length} role(s) from the system`
        })

        try {
            const res = await appClient.delete("/api/roles/delete", {
                params: { ids: JSON.stringify(payload) }
            })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Role Deleted", {
                    description: res.data.message
                })
                handleGetRoles()
                setSelectedRows([])
                if (selectedRole && payload.includes(selectedRole._id)) {
                    setSelectedRole(null)
                    setShowForm(false)
                }
            }

        } catch (error) {
            console.log("getting error while deleting role", error)
        }
    }

    const handleSelectRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        setSelectedRows(prev =>
            prev.length === data.length ? [] : data.map(role => role._id)
        )
    }

    const handleEdit = (role: RoleInterface) => {
        setSelectedRole(role)
        setShowForm(true)
    }

    const handleRefresh = () => {
        handleGetRoles()
    }

    const handleCreateNew = () => {
        setSelectedRole(null)
        setShowForm(true)
    }

    const handleFormSuccess = () => {
        handleGetRoles()
        setSelectedRole(null)
        setShowForm(false)
    }

    const handleCancelForm = () => {
        setSelectedRole(null)
        setShowForm(false)
    }

    return (
        <div className="min-h-screen bg-transparent p-4">
            <div className="mx-auto">
                <Heading
                    heading="Role Management"
                    subHeading="Manage your admin panel role module"
                    showButton={false}
                />

                {/* Selected Items Bar */}
                {selectedRows.length > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-[#bf953f]/10 to-[#8B0000]/10 rounded-xl border border-[#bf953f]/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#bf953f]/20 flex items-center justify-center">
                                <span className="text-[#bf953f] font-bold">{selectedRows.length}</span>
                            </div>
                            <div>
                                <div className="text-[#bf953f] font-medium">
                                    {selectedRows.length} role{selectedRows.length !== 1 ? 's' : ''} selected
                                </div>
                                <div className="text-[#888] text-sm">
                                    Click on role to select/deselect
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

                {/* Main Content with Sidebar Form */}
                <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    {/* Form Section - 1/4 width on large screens */}
                    {(showForm || selectedRole) && (
                        <div className="lg:w-1/3">
                            <RoleForm
                                role={selectedRole}
                                onSuccess={handleFormSuccess}
                                onCancel={handleCancelForm}
                            />
                        </div>
                    )}

                    {/* Table Section - 3/4 width on large screens, full width when form is hidden */}
                    <div className={`${showForm || selectedRole ? 'lg:w-3/4' : 'w-full'}`}>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#bf953f]/30 border-t-[#bf953f] mx-auto"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <RefreshCw className="h-6 w-6 text-[#bf953f] animate-pulse" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-[#bf953f] font-medium">Loading Roles</div>
                                    <div className="text-[#666] text-sm mt-1">Fetching your role data...</div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {data.length === 0 && !showForm ? (
                                    <div className="text-center py-16 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-[#222]">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#bf953f]/10 to-[#d4af37]/10 flex items-center justify-center">
                                            <Search className="h-10 w-10 text-[#666]" />
                                        </div>
                                        <h3 className="text-[#C0C0C0] text-lg font-medium mb-2">
                                            No roles found
                                        </h3>
                                        <p className="text-[#666] text-sm mb-6">
                                            Start by creating your first role
                                        </p>
                                        <button
                                            onClick={handleCreateNew}
                                            className="px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create First Role
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Action Bar */}
                                        <div className="mb-4 flex justify-between items-center">
                                            <div className="text-[#C0C0C0] text-sm">
                                                Showing {data.length} role{data.length !== 1 ? 's' : ''}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleRefresh}
                                                    className="p-2 rounded-lg bg-[#222] hover:bg-[#333] text-[#bf953f] hover:text-[#d4af37] transition-all duration-200"
                                                    title="Refresh"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button
                                                    onClick={handleCreateNew}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#bf953f] to-[#d4af37] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Create Role
                                                </button>
                                            </div>
                                        </div>

                                        <RolesTable
                                            data={data}
                                            selectedRows={selectedRows}
                                            onSelectRow={handleSelectRow}
                                            onSelectAll={handleSelectAll}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RolesPage