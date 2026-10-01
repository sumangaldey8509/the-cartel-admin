

export interface consultaion {
    _id: string,
    name: string,
    email: string,
    telegram: string,
    topic: string,
    message: string,
    status: string,
    actionTakenBy?: {
        _id: string,
        email: string
    },
    actionNote: string | "",
    createdAt: string,
    updatedAt: string,
    __v: Number
}
