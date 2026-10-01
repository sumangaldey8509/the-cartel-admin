import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {


    try {
        const backendRes = await apiClient.get(API_ENDPOINTS.plan.get);

        console.log("Fetching from backend URL:", API_ENDPOINTS.plan.get);
        console.log("plan data", backendRes.data);

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
