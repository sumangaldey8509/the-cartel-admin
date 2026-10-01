import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const payload = await req.json();

        const backendRes = await apiClient.post(API_ENDPOINTS.roles.update, payload);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("role update API Route Error:", error);
        return NextResponse.json(
            { error: "role updation failed." },
            { status: 500 }
        );
    }
}
