


export interface TokenSubmission {
    _id: string
    userType: "individual" | "organization"
    name: string
    email: string
    telegram: string
    tokenName: string
    tokenSymbol: string
    description: string
    website: string
    pdfFileUrl?: string
    plan: "free" | "premium"
    status: "pending" | "verified" | "published" | "rejected"
    isMember: boolean
    createdAt: string
    actionTakenBy?: {
        _id: string
        email: string
    }
}
