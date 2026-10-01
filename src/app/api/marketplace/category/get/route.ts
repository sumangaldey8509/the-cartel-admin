import apiClient from "@/lib/apiClient";
import { authClient } from "@/lib/authClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {


    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") ?? ""
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10"

    const getAuthClient = await authClient()
    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.marketplace.category.get(page, limit, name));

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("plan List Get API Route Error:", error);
        return NextResponse.json(
            { error: "plan list fetching failed." },
            { status: 500 }
        );
    }
}
