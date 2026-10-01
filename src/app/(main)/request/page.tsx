"use client"

import Heading from "@/components/common/heading/heading"
import Pagination from "@/components/common/paginatoin/pagination"
import ActionModal from "@/components/request/ActionModal"
import RequestTable from "@/components/request/RequestTable"
import { TokenSubmission } from "@/interface/request"
import appClient from "@/lib/appClient"
import { useAppSelector } from "@/store/hooks/hooks"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useCallback, useEffect, useState } from "react"

const Members = () => {

    const [data, setData] = useState<TokenSubmission[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<TokenSubmission | null>(null);


    const authedUser = useAppSelector((state) => state.auth.user)


    const [selectedRows, setSelectedRows] = useState<string[]>([])

    const handleGetTokenSubmission = useCallback(async () => {
        setLoading(true)
        try {
            const res = await appClient.get("/api/request/get", {
                params: { page, limit }
            })
            console.log(res)
            if (res.data.status) {
                setData(res.data.submissions.docs)
                setTotalDocs(res.data.submissions.totalDocs)
            }
        } catch (error) {
            console.log("getting error while get coin list", error)
        } finally {
            setLoading(false)
        }
    }, [status, page, limit])

    useEffect(() => {
        handleGetTokenSubmission()
    }, [handleGetTokenSubmission])



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

        console.log("Delete token submission:", payload)
        // Implement delete functionality

        if (!payload) return;

        const toastId = toastLoading("Deleting Token submission(s)", {
            description: `Removing ${payload.length}(s) submissions from the system`
        })

        try {
            const res = await appClient.delete("/api/request/delete", {
                params: { ids: JSON.stringify(payload) }
            })
            console.log({ res })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Token submission Delete", {
                    description: res.data.message
                })
                handleGetTokenSubmission()
                setSelectedRows([])
            }

        } catch (error) {
            console.log("getting error while deleing token", error)
        }
    }

    const handleEdit = (submission: TokenSubmission) => {
        console.log("Edit submission:", submission)
        // Implement edit functionality

        setSelectedSubmission(submission)
        setIsModalOpen(true);
    }

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
    };

    // Handle status change
    const handleStatusChange = async (id: string, status: 'pending' | 'verified' | 'published' | 'rejected', remarks?: string) => {
        const toastId = toastLoading("Updating", {
            description: `Updating status to ${status}, please wait`
        })


        try {
            console.log(`Updating submission ${id} to status: ${status}`, remarks ? `Remarks: ${remarks}` : 'No remarks');

            const payload = {
                _id: id,
                status: status,
                remarks: remarks ? remarks : "No remarks",
                actionTakenBy: authedUser?._id
            }

            const response = await appClient.post("/api/request/action", payload)

            if (response.data.status) {
                handleGetTokenSubmission()
                handleCloseModal()
                toastUpdate(toastId, "success", "Request status is updated", {
                    description: response.data.message
                })
            }


        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Somethign went wrong"

            toastUpdate(toastId, "error", "Status updation failed", {
                description: errorMessage
            })
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setSelectedRows([]) // Clear selection on page change
    }


    // Handle PDF view
    const handleViewPDF = (url: string) => {
        window.open(url, '_blank');
    };

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto" >
                <Heading
                    heading="Token Publish Request"
                    subHeading="Review and manage user-submitted token publish requests."
                    showButton={false}
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
                            <RequestTable
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

            <ActionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                submission={selectedSubmission}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onViewPDF={handleViewPDF}
            />
        </div>
    )
}

export default Members