'use server';
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const user = await currentUser();
    if (!user) {
        return errorResponse('User not found', 404);
    }
    const body = await request.json() as { identity: string, third_party_token: string };
    // NOTE TO BRENT: I dont know where to find the identity value. 
    // I hope that the Plaid React component will provide it.
    if (!(body.identity || body.third_party_token)) {
        return errorResponse('identity and third_party_token are required', 400);
    }

    const response = await fetch(`${process.env.FINIX_BASE_URL!}/payment_instruments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            identity: body.identity,
            third_party: "PLAID",
            third_party_token: body.third_party_token,
            type: "BANK_ACCOUNT"
        })
    });
    const data = (await response.json()) as { token: string, expires_at: string };

    return jsonResponse(data.token);
}
