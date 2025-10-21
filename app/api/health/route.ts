import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json(
        {
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        },
    );
}
