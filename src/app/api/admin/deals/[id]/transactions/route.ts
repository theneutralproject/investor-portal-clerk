import { getAdminFromRequest } from '@/libs/admin/utils.server';
import { createChangeLog } from '@/libs/changelog/utils.server';
import Logger from '@/libs/logger';
import prisma from '@/libs/prisma.server';
import {
  errorResponse,
  getErrorMessage,
  jsonResponse,
} from '@/libs/utils.server';
import { isNumber } from 'lodash';
import { NextRequest } from 'next/server';
import { DealTransactionType } from '@prisma/client';

/**
 * GET all transactions for a specific deal
 */
export async function GET(request: NextRequest) {
  try {
    await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400, { request });
  }

  // Verify deal exists
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404, { request });
  }

  try {
    const transactions = await prisma.dealTransaction.findMany({
      where: { dealId },
      orderBy: { transactionDate: 'desc' },
    });

    return jsonResponse(transactions);
  } catch (error) {
    return errorResponse(getErrorMessage(error), 500, {
      request,
      extra: {
        method: 'prisma.dealTransaction.findMany',
        error,
      },
    });
  }
}

/**
 * POST create a new transaction for a specific deal
 */
export async function POST(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  try {
    const url = new URL(request.url);
    dealId = parseInt(url.pathname.split('/')[4] ?? '');
    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId is required in url`, 400, { request });
  }

  // Verify deal exists
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
  });

  if (!deal) {
    return errorResponse(`Deal id ${dealId} not found`, 404, { request });
  }

  let postData: any;
  try {
    const requestBody = await request.json();
    postData = requestBody;
    Logger.log(
      {
        message: 'Creating deal transaction',
        extra: {
          dealId,
          requestBody,
        },
      },
      request
    );
  } catch (parseError) {
    return errorResponse('Input data malformatted', 400, {
      request,
      extra: {
        method: 'parseError',
        error: parseError,
      },
    });
  }

  // Validate required fields
  if (!postData.type) {
    return errorResponse('type is required', 400, { request });
  }
  if (!postData.transactionDate) {
    return errorResponse('transactionDate is required', 400, { request });
  }

  // Validate transaction type enum
  if (!Object.values(DealTransactionType).includes(postData.type)) {
    return errorResponse('Invalid transaction type', 400, { request });
  }

  try {
    const newTransaction = await prisma.dealTransaction.create({
      data: {
        dealId,
        type: postData.type,
        transactionDate: new Date(postData.transactionDate),
        fullTransactionAmount: postData.fullTransactionAmount || null,
        interestAmount: postData.interestAmount || null,
        principalAmount: postData.principalAmount || null,
        startPeriod: postData.startPeriod
          ? new Date(postData.startPeriod)
          : null,
        endPeriod: postData.endPeriod ? new Date(postData.endPeriod) : null,
        notes: postData.notes || null,
        newMaturityDate: postData.newMaturityDate
          ? new Date(postData.newMaturityDate)
          : null,
      },
    });

    await createChangeLog({
      userId: adminUser.id,
      entityId: newTransaction.id,
      entityName: 'DEAL_TRANSACTION',
      newValue: postData,
    });

    return jsonResponse(newTransaction);
  } catch (error) {
    return errorResponse('Unable to create transaction', 500, {
      request,
      extra: {
        method: 'prisma.dealTransaction.create',
        error,
      },
    });
  }
}
