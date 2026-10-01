"use client"

import Heading from "@/components/common/heading/heading"
import Pagination from "@/components/common/paginatoin/pagination"
import MembersTable from "@/components/members/MembersTable"
import PlanConfigurationDrawer from "@/components/members/planConfig/PlanConfigurationDrawer"
import { Memberstype } from "@/interface/member"
import appClient from "@/lib/appClient"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Members = () => {

    const [data, setData] = useState<Memberstype[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)
    const [isPlanConfigOpen, setIsPlanConfigOpen] = useState(false);

    const router = useRouter()


    const [selectedRows, setSelectedRows] = useState<string[]>([])

    const handleGetMembers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await appClient.get("/api/members/get", {
                params: { page, limit }
            })
            if (res.data.status) {
                setData(res.data.members.docs)
                setTotalDocs(res.data.members.totalDocs)
            }
        } catch (error) {
            console.log("getting error while get coin list", error)
        } finally {
            setLoading(false)
        }
    }, [status, page, limit])

    useEffect(() => {
        handleGetMembers()
    }, [handleGetMembers])



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


    const handleDelete = async (payload: string[]) => {
        console.log({ payload })

        console.log("Delete member:", payload)
        // Implement delete functionality

        if (!payload) return;

        const toastId = toastLoading("Deleting Member(s)", {
            description: `Removing ${payload.length}(s) member from the system`
        })

        try {
            const res = await appClient.delete("/api/members/delete", {
                params: { ids: JSON.stringify(payload) }
            })
            console.log({ res })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Member Delete", {
                    description: res.data.message
                })
                handleGetMembers()
            }

        } catch (error) {
            console.log("getting error while deleing member", error)
        }
    }

    const handleEdit = (coin: Memberstype) => {
        console.log("Edit coin:", coin)
        // Implement edit functionality

    }


    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedRows([]) // Clear selection on page change
    }


    const handleButtonClick = () => {
        router.replace('/members/plans')
    }

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto" >
                <Heading
                    heading="Members"
                    subHeading="Centralized dashboard to view and manage users"
                    showButton={true}
                    buttonText="Configure Plans"
                    onButtonClick={handleButtonClick}
                />


                {selectedRows.length > 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-[#bf953f]/10 to-[#8B0000]/10 rounded-lg border border-[#bf953f]/30 flex items-center justify-between">
                        <div className="text-[#bf953f] text-sm">
                            {selectedRows.length} coin{selectedRows.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleDelete(selectedRows)} className="px-3 py-1 bg-red-600 text-text-heading rounded text-sm hover:bg-red-700 transition-colors">
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}


                <div className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bf953f] mx-auto"></div>
                            <div className="text-[#C0C0C0] text-sm mt-2">Loading coins...</div>
                        </div>
                    ) : (
                        <>
                            <MembersTable
                                data={data}
                                selectedRows={selectedRows}
                                onSelectRow={handleSelectRow}
                                onSelectAll={handleSelectAll}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={totalDocs}
                                    itemsPerPage={limit}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            <PlanConfigurationDrawer
                isOpen={isPlanConfigOpen}
                onClose={() => setIsPlanConfigOpen(false)}
            />
        </div>
    )
}

export default Members