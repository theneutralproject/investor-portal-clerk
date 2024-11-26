import type { DealUpdateSchema } from "@/libs/deal/schema";
import { updateDeal } from "@/libs/deal/utils.server";
import { errorResponse, jsonResponse } from "@/libs/utils";
import type { NextRequest } from "next/server";

function validateAuthHeader(request: NextRequest) {
    const base64EncodedString = request.headers.get('Authorization')?.split(' ')[1];
    if (!base64EncodedString) {
        return {
            valid: false,
            message: 'Authorization header is required'
        }
    }
    const decodedString = Buffer.from(base64EncodedString, 'base64').toString();
    const [username, password] = decodedString.split(':');
    if (!(username === process.env.FINIX_WH_USERNAME && password === process.env.FINIX_WH_PASSWORD)) {
        console.log('Invalid credentials\n\n');
        console.log(username, password);
        return {
            valid: false,
            message: 'Invalid credentials'
        }
    }
    return {
        valid: true,
        message: ''
    }
}

// FINIX sends multiple webhook events for the same transaction - the subtype differs
export async function POST(request: NextRequest) {
    console.log('\n\nBEGIN Finix Webhook:');
    const { valid, message } = validateAuthHeader(request);

    if (!valid) {
        return errorResponse(message, 401);
    }

    const body = (await request.json()) as {
        id: string, type: string, entity: string, _embedded: {
            transfers: [
                {
                    id: string | null,
                    failure_message: string | null,
                    failure_code: string | null,
                    source: string | null,
                    state: string | null,
                    amount: number | null,
                    currency: string | null,
                    subtype: string | null,
                    tags: {
                        transaction_id: string | null,
                        dealHubspotId: string | null,
                        project: string | null
                    }
                }
            ]
        }
    };

    if (body._embedded.transfers.length > 0) {
        const transfer = body._embedded.transfers[0];
        if (transfer.subtype !== 'API') {
            console.log('ignoring the Webhook because the subtype is not "API"');
            return jsonResponse({ message: 'ignoring the Webhook' });
        }
        if (transfer.state?.toUpperCase() === 'SUCCEEDED') {
            console.log('Processing Transfer Succeeded Webhook: ', transfer);
            const { dealHubspotId } = transfer.tags;
            if (!dealHubspotId) {
                console.error('The ACH transfer was NOT successful because the tags were missing', transfer.tags);
                return errorResponse('The ACH transfer was NOT successful because the tags were missing', 500);
            }
            try {
                const dealData = {
                    hubspotId: dealHubspotId,
                    dealstage: 5,
                    closingDate: new Date(Date.now())
                } as DealUpdateSchema
                await updateDeal(dealData, true);
            } catch (error) {
                console.error("unable to set deal stage to 5 in webhook route", error);
                return errorResponse('The ACH transfer was NOT successful', 500);
            }
            return jsonResponse({ message: 'The ACH transfer was successful' });
        }
    }
    console.log('Webhook not processed due to missing transfer data or because transaction was CANCELLED');
    console.log(body)
    return jsonResponse({ message: 'Webhook not processed' });
}
