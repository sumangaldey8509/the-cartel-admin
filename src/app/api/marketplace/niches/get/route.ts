import apiClient from "@/lib/apiClient";
import { authClient } from "@/lib/authClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextResponse } from "next/server";

export async function GET() {

    const getAuthClient = await authClient()
    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.marketplace.niches.get);

        if (!backendRes?.data?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("niches List Get API Route Error:", error);
        return NextResponse.json(
            { error: "niches list getting failed" },
            { status: 500 }
        );
    }
}
