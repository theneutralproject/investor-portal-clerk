'use server';
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const user = await currentUser();
    if(!user) {
        return errorResponse('User not found', 404);
    }

    const body = await request.json() as { plaid_public_token: string, plaid_account_id: string };
    if(!(body.plaid_public_token || body.plaid_account_id)) {
        return errorResponse('plaid_public_token and plaid_account_id are required', 400);
    }

    const response = await fetch(`${process.env.FINIX_BASE_URL!}/third_party_tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            plaid_public_token: body.plaid_public_token,
            plaid_account_id: body.plaid_account_id,
            type: "PLAID_PROCESSOR_TOKEN"
        })
    });
    const data = (await response.json()) as { token: string };

    return jsonResponse(data.token);
}