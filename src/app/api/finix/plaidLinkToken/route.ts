'use server';
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
    const user = await currentUser();
    if(!user) {
        return errorResponse('User not found', 401);
    }
    const response = await fetch(`${process.env.FINIX_BASE_URL!}/third_party_tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            type: 'PLAID_LINK_TOKEN',
            countries: ['USA'],
            language: "en",
        })
    });
    const data = (await response.json()) as { token: string, expires_at: string };

    return jsonResponse(data.token);
}
