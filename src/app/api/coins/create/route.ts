import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("<<<<<<<<======== Hit ========>>>>>>>> /api/Coins/create");

    try {
        const payload = await req.json();

        console.log("Coins Create Payload", payload);

        const backendRes = await apiClient.post(API_ENDPOINTS.coins.create, payload);

        console.log("Fetching from backend URL:", API_ENDPOINTS.coins.create);
        console.log("Coins Create Response ===> Backend", backendRes?.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("Coins Create API Route Error:", error);
        return NextResponse.json(
            { error: "Coins creation failed." },
            { status: 500 }
        );
    }
}
