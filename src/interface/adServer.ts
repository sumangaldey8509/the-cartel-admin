export type Objective = "Traffic" | "Awareness" | "Conversions";
export type Device = "All Devices" | "Mobile" | "Desktop";

export interface Ad {
    headline: string;
    url: string;
}

export interface AdGroup {
    name: string;
    ads: Ad[];
}

export interface CampaignForm {
    name: string;
    advertiser: string;
    objective: Objective;
    budget: string;
    bid: string;
    geo: string;
    device: Device;
    publishers: string[];
    creatives: File[];
    adGroups: AdGroup[];
}