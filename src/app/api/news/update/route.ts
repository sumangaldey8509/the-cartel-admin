// import { NextRequest, NextResponse } from "next/server";
// import FormDataNode from "form-data";
// import apiClient from "@/lib/apiClient";
// import { API_ENDPOINTS } from "@/lib/config/apiConfig";

// export async function POST(req: NextRequest) {
//     console.log("<<<<<<<<======== Hit ========>>>>>>>> /api/news/update");

//     try {
//         const formData = await req.formData();
//         const data = new FormDataNode();

//         for (const [key, value] of formData.entries()) {
//             if (value instanceof File) {
//                 // Convert Web File to Buffer
//                 const arrayBuffer = await value.arrayBuffer();
//                 const buffer = Buffer.from(arrayBuffer);

//                 data.append(key, buffer, {
//                     filename: value.name,
//                     contentType: value.type,
//                 });
//             } else {
//                 data.append(key, value.toString());
//             }
//         }

//         console.log("Forwarding payload to backend via apiClient...");

//         const backendRes = await apiClient.post(API_ENDPOINTS.news.update, data, {
//             headers: data.getHeaders(), // set proper multipart headers
//         });

//         console.log("News Update Response from backend:", backendRes.data);

//         return NextResponse.json(backendRes.data, {
//             status: backendRes.data.statusCode || 200,
//         });
//     } catch (err: any) {
//         console.error("News Update API Route Error:", err);
//         return NextResponse.json(
//             { error: err.message || "News creation failed." },
//             { status: 500 }
//         );
//     }
// }




import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/config/apiConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("<<<<<<<<======== Hit ========>>>>>>>> /api/Coins/create");

    try {
        const payload = await req.json();

        const backendRes = await apiClient.post(API_ENDPOINTS.news.update, payload);

        if (!backendRes?.data) {
            return NextResponse.json(backendRes.data);
        }

        return NextResponse.json(backendRes.data, {
            status: backendRes.data.statusCode,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Coins creation failed." },
            { status: 500 }
        );
    }
}
