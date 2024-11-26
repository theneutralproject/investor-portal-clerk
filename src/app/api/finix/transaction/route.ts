'use server';
import { updateDeal } from "@/libs/deal/utils.server";
import prisma from "@/libs/prisma.server";
import { DealWithInvestmentStats } from "@/libs/types";
import { errorResponse, jsonResponse } from "@/libs/utils";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "@prisma/client";
import { isError } from "lodash";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
        return errorResponse('User not found', 404);
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    });
    if (!user) {
        return errorResponse('User not found', 404);
    }

    const body = await request.json() as { plaid_public_token: string, plaid_account_id: string, dealId: number };
    if (!(body.plaid_public_token || body.plaid_account_id || !body.dealId)) {
        return errorResponse('plaid_public_token and plaid_account_id are required', 400);
    }
    try {
        const third_party_token = await getPlaidToken(body.plaid_public_token, body.plaid_account_id);
        const identity = await getIdentity(user);
        const buyerId = await getBuyerId(identity, third_party_token);

        const deal = await prisma.deal.findUnique({
            where: { id: body.dealId },
            include: {
                investmentStats: true,
                project: true,
                organization: { include: { members: true } }
            }
        });
        if (!deal) {
            return errorResponse('Deal not found', 404);
        }
        if (!deal.organization.members.find(member => member.userId === user.id)) {
            return errorResponse('You are not a member of this organization', 401);
        }

        const maxFinixAmount = parseFloat(process.env.FINIX_MAX_TRANSACTION_AMOUNT ?? "0");
        if (!deal.investmentStats || deal.investmentStats.amount <= 0 || deal.investmentStats.amount > maxFinixAmount) {
            return errorResponse('The investment amount is invalid', 400);
        }

        const { project: { slug, name: projectName }, investmentStats, ...dealData } = deal;
        const merchantId = process.env[`FINIX_MERCHANT_ID_${slug.toUpperCase()}`]!;

        // transfer money to Finix merchant
        const achTransferResponseData = await initializeFinixTransfer({ ...dealData, investmentStats }, merchantId, buyerId, projectName);
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
            }
            return jsonResponse({ message: 'The ACH transfer was successful' });
        }
        else if (achTransferResponseData.state?.toUpperCase() === 'FAILED') {
            return errorResponse('The ACH transfer failed. Please contact your Neutral Representative', 400);
        }
        return jsonResponse({ message: 'The ACH transfer is pending' });
    } catch (error) {
        console.error(error);
        return errorResponse('Error transferring money', 500);
    }
}



async function getPlaidToken(plaid_public_token: string, plaid_account_id: string) {
    const plaidTokenResponse = await fetch(`${process.env.FINIX_BASE_URL!}/third_party_tokens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            plaid_public_token,
            plaid_account_id,
            type: "PLAID_PROCESSOR_TOKEN"
        })
    });
    const { token } = await plaidTokenResponse.json() as { token: string, type: string };
    return token;
}

async function getIdentity(user: User) {
    const identityResponse = await fetch(`${process.env.FINIX_BASE_URL!}/identities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            entity: {
                phone: user.phoneNumber,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
            }
        })
    });
    const { id } = (await identityResponse.json()) as { id: string };
    return id;
}

async function getBuyerId(identity: string, third_party_token: string) {
    const paymentInstrumentResponse = await fetch(`${process.env.FINIX_BASE_URL!}/payment_instruments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Finix-Version': '2022-02-01',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.FINIX_USERNAME!}:${process.env.FINIX_PASSWORD!}`).toString('base64')
        },
        body: JSON.stringify({
            identity,
            third_party: "PLAID",
            third_party_token,
            type: "BANK_ACCOUNT"
        })
    });
    const paymentInstrumentResponseData = (await paymentInstrumentResponse.json()) as { id: string, application: string, currency: string, third_party: string, type: string, bank_account_validation_check: string, instrument_type: string };
    return paymentInstrumentResponseData.id;
}

async function initializeFinixTransfer(deal: DealWithInvestmentStats, merchantId: string, buyerId: string, projectName: string) {

    const amountInCents = deal.investmentStats.amount * (process.env.NODE_ENV === "production" ? 100 : 1);
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

    return await achTransferResponse.json() as { type?: string, state?: string, id?: string, trace_id: string, failure_code: string, failure_message: string, _embedded?: { errors: { message: string }[] } };
}
