import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";

    console.log({ page, limit })

    if (!status) {
        return NextResponse.json(
            { message: "status is required" },
            { status: 400 }
        );
    }

    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.coins.get(status, page, limit));

        console.log("Fetching from backend URL:", API_ENDPOINTS.coins.get(status, page, limit));
        console.log("Coin data", backendRes.data);

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("Coin List Get API Route Error:", error);
        return NextResponse.json(
            { error: "Coin list fetching failed." },
            { status: 500 }
        );
    }
}
