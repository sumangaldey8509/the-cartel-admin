// types/coin.ts
export interface Coin {
    time: string;
    _id: string;
    name: string;
    symbol: string;
    logo?: string;
    launchDate: string; // ISO string
    description: string;
    status: "upcoming" | "launched";
    ath?: string; // only for launched
    currentPrice?: string; // only for launched
    holders?: number; // only for launched
}
