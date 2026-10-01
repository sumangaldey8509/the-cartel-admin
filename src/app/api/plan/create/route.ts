import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("<<<<<<<<======== Hit ========>>>>>>>> /api/plan/create");

    try {
        const payload = await req.json();

        console.log("plan Create Payload", payload);

        const backendRes = await apiClient.post(API_ENDPOINTS.plan.create, payload);

        console.log("Fetching from backend URL:", API_ENDPOINTS.plan.create);
        console.log("plan Create Response ===> Backend", backendRes?.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("plan Create API Route Error:", error);
        return NextResponse.json(
            { error: "plan creation failed." },
            { status: 500 }
        );
    }
}
