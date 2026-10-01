export interface Memberstype {
    _id: string,
    email: string,
    telegramUsername: string,
    tradingExperience: string,
    plan: {
        _id: string,
        name: string,
        price: string,
        oldPrice: string,
        duration: string,
        isBestValue: boolean
    },
    createdAt: string,
    updatedAt: string,
}