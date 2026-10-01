export interface PublihserInterface {
    _id: string,
    accountType: "individual" | "company",
    fullName: string,
    organizationName: string,
    countryCode: string,
    phoneNumber: string,
    telegramUsername: string,
    profileLink: string,
    website: string,
    publisherInfo: string,
    verificationToken: string,
    verificationStatus: string,
    userId: {
        _id: string,
        email: string
    },
    actionTakenBy: {
        _id: string,
        email: string
    } | null,
    actionNote: string | "",
    createdAt: string,
    updatedAt: string,

    profilePhoto: string | null,
    profileName: string | null,
    profileDescription: string | null,
    pageViews: string | null,
    subscribers: string | null,
    topGEO: string[] | null,
    price: string | null,
    language: string[] | null,
    country: string | null,
    marketplaceCategory: MarketplaceCategory[] | null,
    niches: {
        _id: string,
        name: string
    }[] | null,

    __v: number

    membershipType: string | null
}

interface MarketplaceCategory {
    _id: string,
    name: string,
    parent: {
        _id: string,
        name: string
    } | null
}

interface Language {
    name: string
}