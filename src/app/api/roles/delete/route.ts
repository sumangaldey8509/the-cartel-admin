import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const idParams = searchParams.get("ids");

    let roleId: string[] = [];

    if (idParams) {
        try {
            roleId = JSON.parse(idParams);
        } catch (error) {
            console.log("Invalid Role ID format", error);

            return NextResponse.json(
                { message: "Invalid Role id format" },
                { status: 400 }
            );
        }
    }

    try {
        const backendRes = await apiClient.delete(
            API_ENDPOINTS.roles.delete(roleId)
        );

        console.log("Role delete res ===> Backend", backendRes.data);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        console.log("Role deletion failed", error);

        return NextResponse.json({ error: "Role deletion failed" }, { status: 500 });
    }
}
