export interface Plan {
    _id?: string;
    name: string;
    price: string;
    oldPrice: string;
    duration: string;
    isBestValue: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PlanFormData {
    name: string;
    price: string;
    oldPrice: string;
    duration: string;
    isBestValue: boolean;
}