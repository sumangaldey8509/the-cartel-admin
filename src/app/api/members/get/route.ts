import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const limit = searchParams.get("limit") ?? "10";


    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.members.get(page, limit));

        console.log("members data", backendRes.data);

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("members List Get API Route Error:", error);
        return NextResponse.json(
            { error: "members list fetching failed." },
            { status: 500 }
        );
    }
}
