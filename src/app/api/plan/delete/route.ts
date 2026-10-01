import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const idParams = searchParams.get("ids");

    let coinId: string[] = [];

    if (idParams) {
        try {
            coinId = JSON.parse(idParams);
        } catch (error) {
            console.log("Invalid Plan ID format", error);

            return NextResponse.json(
                { message: "Invalid Plan id format" },
                { status: 400 }
            );
        }
    }

    // console.log("Final payload", clientId, CoinId);

    try {
        const backendRes = await apiClient.delete(
            API_ENDPOINTS.plan.delete(coinId)
        );

        console.log("PLAN delete res ===> Backend", backendRes.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("Plan deletion failed", error);

        return NextResponse.json({ error: "Plan deletion failed" }, { status: 500 });
    }
}
