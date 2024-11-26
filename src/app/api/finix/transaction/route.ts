'use server';
import { updateDeal } from "@/libs/deal/utils.server";
import prisma from "@/libs/prisma.server";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { isError } from "lodash";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const user = await currentUser();
    if (!user) {
        return errorResponse('User not found', 404);
    }

    const body = await request.json() as { plaid_public_token: string, plaid_account_id: string, dealId: number };
    if (!(body.plaid_public_token || body.plaid_account_id || !body.dealId)) {
        return errorResponse('plaid_public_token and plaid_account_id are required', 400);
    }
    // get plaid exhange token
    const plaidTokenResponse = await fetch(`${process.env.FINIX_BASE_URL!}/third_party_tokens`, {
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
    const { token: third_party_token } = (await plaidTokenResponse.json()) as { token: string, type: string };

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
    });
    if (!dbUser) {
        return errorResponse('User not found', 404);
    }
    // get customer identity
    const identityResponse = await fetch(`${process.env.FINIX_BASE_URL!}/identities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            entity: {
                phone: dbUser.phoneNumber,
                first_name: dbUser.firstName,
                last_name: dbUser.lastName,
                email: dbUser.email,
            }
        })
    });
    const { id: identity } = (await identityResponse.json()) as { id: string };
    // create finix payment instrument for customer
    const paymentInstrumentResponse = await fetch(`${process.env.FINIX_BASE_URL!}/payment_instruments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            identity: identity,
            third_party: "PLAID",
            third_party_token: third_party_token,
            type: "BANK_ACCOUNT"
        })
    });
    // https://finix.com/docs/guides/payments/online-payments/getting-started/adding-bank-accounts-with-plaid/#step-4-create-a-finix-payment-instrument
    const paymentInstrumentResponseData = (await paymentInstrumentResponse.json()) as { id: string, application: string, currency: string, third_party: string, type: string, bank_account_validation_check: string, instrument_type: string };
    const { id: buyerId } = paymentInstrumentResponseData;
    // You can use Finix payment_instruments connected and verified with Plaid for ACH payments.
    // bankcode, account number, buyer name

    const deal = await prisma.deal.findUnique({
        where: { id: body.dealId },
        include: {
            investmentStats: true,
            project: true
        }
    });
    if (!deal?.investmentStats?.amount) {
        return errorResponse('Deal not found', 404);
    }
    const amountInCents = deal.investmentStats.amount * (process.env.NODE_ENV === "production" ? 100 : 1);
    const { slug, name: projectName } = deal.project;
    const merchantId = process.env[`FINIX_MERCHANT_ID_${slug.toUpperCase()}`]!;
    // transfer money to Finix merchant
    const achTransferResponse = await fetch(`${process.env.FINIX_BASE_URL!}/transfers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            amount: amountInCents,
            currency: "USD",
            fee: 0,
            merchant: merchantId,
            source: buyerId,
            tags: {
                transaction_id: deal.transactionId,
                dealHubspotId: deal.hubspotId,
                project: projectName
            },
            idempotency_id: deal.transactionId
        })
    });

    const achTransferResponseData = await achTransferResponse.json() as { type?: string, state?: string, id?: string, trace_id: string, failure_code: string, failure_message: string, _embedded?: { errors: { message: string }[] } };
    // console.log(achTransferResponseData)
    if (isError(achTransferResponseData)) {
        console.error(achTransferResponseData);
        return errorResponse('Error transferring money', 500);
    }
    if (!achTransferResponseData.state && achTransferResponseData._embedded) {
        console.error(achTransferResponseData._embedded.errors);
        return errorResponse(achTransferResponseData._embedded.errors[0]?.message ?? "The ACH transfer failed. Please contact your Neutral Representative", 500);
    }

    if (achTransferResponseData.state?.toUpperCase() === 'SUCCEEDED') {
        try {
            await updateDeal({
                hubspotId: deal.hubspotId,
                dealStage: 5,
                closingDate: new Date(Date.now())
            }, true);
        } catch (error) {
            console.error("unable to set deal stage to 5", error);
            // return errorResponse('The ACH transfer was NOT successful', 500);
        }
        return jsonResponse({ message: 'The ACH transfer was successful' });
    }
    else if (achTransferResponseData.state?.toUpperCase() === 'FAILED') {
        return errorResponse('The ACH transfer failed. Please contact your Neutral Representative', 400);
    }
    return jsonResponse({ message: 'The ACH transfer is pending' });
}
