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
 * PATCH update a specific transaction
 */
export async function PATCH(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  let transactionId: number;
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    dealId = parseInt(pathSegments[4] ?? '');
    transactionId = parseInt(pathSegments[6] ?? '');

    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
    if (!transactionId || !isNumber(transactionId)) {
      throw new Error('transactionId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId and transactionId are required in url`, 400, {
      request,
    });
  }

  // Verify transaction exists and belongs to the deal
  const existingTransaction = await prisma.dealTransaction.findFirst({
    where: {
      id: transactionId,
      dealId: dealId,
    },
  });

  if (!existingTransaction) {
    return errorResponse(
      `Transaction id ${transactionId} not found for deal ${dealId}`,
      404,
      { request }
    );
  }

  let patchData: any;
  try {
    const requestBody = await request.json();
    patchData = requestBody;
    Logger.log(
      {
        message: 'Updating deal transaction',
        extra: {
          dealId,
          transactionId,
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

  // Validate transaction type enum if provided
  if (
    patchData.type &&
    !Object.values(DealTransactionType).includes(patchData.type)
  ) {
    return errorResponse('Invalid transaction type', 400, { request });
  }

  try {
    const updateData: any = {};

    if (patchData.type !== undefined) updateData.type = patchData.type;
    if (patchData.transactionDate !== undefined)
      updateData.transactionDate = new Date(patchData.transactionDate);
    if (patchData.fullTransactionAmount !== undefined)
      updateData.fullTransactionAmount = patchData.fullTransactionAmount;
    if (patchData.interestAmount !== undefined)
      updateData.interestAmount = patchData.interestAmount;
    if (patchData.principalAmount !== undefined)
      updateData.principalAmount = patchData.principalAmount;
    if (patchData.startPeriod !== undefined)
      updateData.startPeriod = patchData.startPeriod
        ? new Date(patchData.startPeriod)
        : null;
    if (patchData.endPeriod !== undefined)
      updateData.endPeriod = patchData.endPeriod
        ? new Date(patchData.endPeriod)
        : null;
    if (patchData.notes !== undefined) updateData.notes = patchData.notes;
    if (patchData.newMaturityDate !== undefined)
      updateData.newMaturityDate = patchData.newMaturityDate
        ? new Date(patchData.newMaturityDate)
        : null;

    const updatedTransaction = await prisma.dealTransaction.update({
      where: { id: transactionId },
      data: updateData,
    });

    await createChangeLog({
      userId: adminUser.id,
      entityId: transactionId,
      entityName: 'DEAL_TRANSACTION',
      previousValue: existingTransaction,
      newValue: patchData,
    });

    return jsonResponse(updatedTransaction);
  } catch (error) {
    return errorResponse('Unable to update transaction', 500, {
      request,
      extra: {
        method: 'prisma.dealTransaction.update',
        error,
      },
    });
  }
}

/**
 * DELETE remove a specific transaction
 */
export async function DELETE(request: NextRequest) {
  let adminUser;
  try {
    adminUser = await getAdminFromRequest(request);
  } catch (error) {
    Logger.log({ message: getErrorMessage(error) }, request);
    return jsonResponse(getErrorMessage(error), 500);
  }

  let dealId: number;
  let transactionId: number;
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    dealId = parseInt(pathSegments[4] ?? '');
    transactionId = parseInt(pathSegments[6] ?? '');

    if (!dealId || !isNumber(dealId)) {
      throw new Error('dealId is required in url');
    }
    if (!transactionId || !isNumber(transactionId)) {
      throw new Error('transactionId is required in url');
    }
  } catch (__error) {
    return errorResponse(`dealId and transactionId are required in url`, 400, {
      request,
    });
  }

  // Verify transaction exists and belongs to the deal
  const existingTransaction = await prisma.dealTransaction.findFirst({
    where: {
      id: transactionId,
      dealId: dealId,
    },
  });

  if (!existingTransaction) {
    return errorResponse(
      `Transaction id ${transactionId} not found for deal ${dealId}`,
      404,
      { request }
    );
  }

  try {
    await prisma.dealTransaction.delete({
      where: { id: transactionId },
    });

    await createChangeLog({
      userId: adminUser.id,
      entityId: transactionId,
      entityName: 'DEAL_TRANSACTION',
      previousValue: existingTransaction,
      newValue: null,
    });

    Logger.log(
      {
        message: 'Deal transaction deleted',
        extra: {
          dealId,
          transactionId,
          deletedTransaction: existingTransaction,
        },
      },
      request
    );

    return jsonResponse({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return errorResponse('Unable to delete transaction', 500, {
      request,
      extra: {
        method: 'prisma.dealTransaction.delete',
        error,
      },
    });
  }
}
