export interface Niches {
    _id: string,
    name: string,
    isActive: boolean,
    createdBy: {
        _id: string,
        email: string
    },
    createdAt: string,
    updatedAt: string,
}

export interface MarketplaceCategory {
    _id: string,
    name: string,
    parent: {
        _id: string,
        name: string
    } | null,
    isActive: boolean,
    createdBy: {
        _id: string,
        email: string
    },
    createdAt: string,
    updatedAt: string,
}