"use client"

import Heading from "@/components/common/heading/heading"
import Pagination from "@/components/common/paginatoin/pagination"
import ConsultationActionModal from "@/components/Consultation/ConsultationActionModal"
import PublisherActionModal from "@/components/publisher/PublisherActionModal"
import PublisherRequestTable from "@/components/publisher/PublisherRequestTable"
import { consultaion } from "@/interface/consultation"
import { PublihserInterface } from "@/interface/publishers"
import appClient from "@/lib/appClient"
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks"
import { editPublisher } from "@/store/slices/publisherSlice"
import { toastLoading, toastUpdate } from "@/utils/toast-message/taost-message"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Publishers = () => {

    const [data, setData] = useState<PublihserInterface[]>([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(10)
    const [totalDocs, setTotalDocs] = useState(0)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<PublihserInterface | null>(null);


    const authedUser = useAppSelector((state) => state.auth.user)
    const dispatch = useAppDispatch()

    const [selectedRows, setSelectedRows] = useState<string[]>([])

    const router = useRouter()

    const handleGetPublisher = useCallback(async () => {
        setLoading(true)
        try {
            const res = await appClient.get("/api/publisher/get", {
                params: { page, limit }
            })
            console.log(res)
            if (res.data.status) {
                setData(res.data.publihsers.docs)
                setTotalDocs(res.data.publihsers.totalDocs)
            }
        } catch (error) {
            console.log("getting error while get publisher list", error)
        } finally {
            setLoading(false)
        }
    }, [status, page, limit])

    useEffect(() => {
        handleGetPublisher()
    }, [handleGetPublisher])



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
        console.log(payload)
        if (!payload) return;

        const toastId = toastLoading("Deleting Publisher submission(s)", {
            description: `Removing ${payload.length}(s) submissions from the system`
        })

        try {
            const res = await appClient.delete("/api/publisher/delete", {
                params: { ids: JSON.stringify(payload) }
            })
            console.log({ res })

            if (res.data.status) {
                toastUpdate(toastId, "success", "Publisher submission Delete", {
                    description: res.data.message
                })
                handleGetPublisher()
                setSelectedRows([])
            }

        } catch (error) {
            console.log("getting error while deleing publisher request", error)
        }
    }

    const handleEdit = (submission: PublihserInterface) => {
        console.log("Edit submission:", submission)
        // Implement edit functionality
        dispatch(editPublisher(submission))
        router.push(`/publishers/${submission.userId.email}`)
        // setSelectedSubmission(submission)
        // setIsModalOpen(true);
    }

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSubmission(null);
    };

    // Handle status change
    const handleStatusChange = async (id: string, status: 'pending' | 'verified' | 'rejected' | 'hold' | 'pause', actionNote?: string) => {
        const toastId = toastLoading("Updating", {
            description: `Updating status to ${status}, please wait`
        })


        try {
            console.log(`Updating submission ${id} to status: ${status}`, actionNote ? `Remarks: ${actionNote}` : 'No remarks');

            const payload = {
                _id: id,
                verificationStatus: status,
                actionNote: actionNote ? actionNote : "No actionNote",
                actionTakenBy: authedUser?._id,
                userId: selectedSubmission?.userId._id,
                userEmail: selectedSubmission?.userId.email
            }

            console.log({ payload })

            const response = await appClient.post("/api/publisher/action", payload)

            if (response.data.status) {
                handleGetPublisher()
                handleCloseModal()
                toastUpdate(toastId, "success", "Publisher status is updated", {
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

    const totalPages = Math.ceil(totalDocs / limit)

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] p-4">
            <div className="mx-auto" >
                <Heading
                    heading="Publisher Request"
                    subHeading="Track, review, and take action on publishers requests."
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
                            <div className="text-[#C0C0C0] text-sm mt-2">Loading Consulation requests...</div>
                        </div>
                    ) : (
                        <>
                            <PublisherRequestTable
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

            <PublisherActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                publisher={selectedSubmission}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default Publishers