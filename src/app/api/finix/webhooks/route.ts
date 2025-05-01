'use server';
import { DealStage, type DealUpdateSchema } from '@/libs/deal/schema';
import { updateDeal } from '@/libs/deal/utils.server';
import Logger from '@/libs/logger';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { PaymentMethod } from '@prisma/client';
import type { NextRequest } from 'next/server';

function validateAuthHeader(request: NextRequest) {
  const base64EncodedString = request.headers
    .get('Authorization')
    ?.split(' ')[1];
  if (!base64EncodedString) {
    Logger.log({
      message: 'Authorization header is required for finix webhook\n\n',
    });
    return {
      valid: false,
      message: 'Authorization header is required',
    };
  }
  const decodedString = Buffer.from(base64EncodedString, 'base64').toString();
  const [username, password] = decodedString.split(':');
  if (
    !(
      username === process.env.FINIX_WH_USERNAME &&
      password === process.env.FINIX_WH_PASSWORD
    )
  ) {
    Logger.log(
      {
        message: 'Invalid finix credentials\n\n',
        extra: { username, password },
      },
      request
    );
    return {
      valid: false,
      message: 'Invalid credentials',
    };
  }
  return {
    valid: true,
    message: '',
  };
}

// FINIX sends multiple webhook events for the same transaction - the subtype differs
export async function POST(request: NextRequest) {
  Logger.log({ message: '\nBEGIN Finix Webhook:' }, request);
  const { valid, message } = validateAuthHeader(request);

  if (!valid) {
    return errorResponse(message, 401);
  }

  try {
    const body = (await request.json()) as {
      id: string;
      type: string;
      entity: string;
      _embedded: {
        transfers: [
          {
            id: string | null;
            failure_message: string | null;
            failure_code: string | null;
            source: string | null;
            state: string | null;
            amount: number | null;
            currency: string | null;
            subtype: string | null;
            operation_key?: string | null;
            tags: {
              transaction_id: string | null;
              dealHubspotId: string | null;
              project: string | null;
            };
            ready_to_settle_at?: string;
          },
        ];
      };
    };

    if (!body._embedded.transfers.length) {
      Logger.error(
        'Webhook not processed due to missing transfer data or because transaction was CANCELLED',
        request,
        {
          extra: body,
        }
      );
      return jsonResponse({
        message:
          'Webhook not processed due to missing transfer data or because transaction was CANCELLED',
        body,
      });
    }

    const transfer = body._embedded.transfers[0];

    // Log operation_key parts if available
    if (transfer.operation_key) {
      const [fundingSpeed, resource, direction, rail] =
        transfer.operation_key.split('_');
      Logger.log(
        {
          message: 'Parsed operation_key from Finix webhook',
          extra: { fundingSpeed, resource, direction, rail },
        },
        request
      );
    }

    if (transfer.subtype !== 'API') {
      Logger.warn('Webhook not processed because the subtype is not "API"');
      return jsonResponse({
        message: 'Webhook not processed because the subtype is not "API"',
      });
    }

    if (!transfer.ready_to_settle_at) {
      Logger.warn('Webhook not processed because transaction is not done yet');
      return jsonResponse({
        message: 'Webhook not processed because transaction is not done yet',
      });
    }

    // Handle failed transactions
    if (transfer.state?.toUpperCase() === 'FAILED') {
      Logger.warn('Finix transfer failed', request, {
        extra: {
          transferId: transfer.id,
          failureCode: transfer.failure_code,
          failureMessage: transfer.failure_message,
          tags: transfer.tags,
        },
      });
      return jsonResponse({
        message: `Transfer failed: ${transfer.failure_code} - ${transfer.failure_message}`,
      });
    }

    if (transfer.state?.toUpperCase() === 'SUCCEEDED') {
      Logger.log({
        message: 'Processing Transfer Succeeded Webhook: ',
        extra: transfer,
      });

      const { dealHubspotId } = transfer.tags;
      if (!dealHubspotId) {
        Logger.error(
          'The ACH transfer was NOT successful because the tags were missing',
          request,
          {
            extra: transfer.tags,
          }
        );
        return errorResponse(
          'The ACH transfer was NOT successful because the tags were missing',
          500
        );
      }

      try {
        const dealData: DealUpdateSchema = {
          hubspotId: dealHubspotId,
          dealStage: DealStage.CLOSED,
          closingDate: new Date(Date.now()),
          dateFundsSent: new Date(Date.now()),
          paymentMethod: PaymentMethod.ACH,
          paymentReferenceId: transfer.id,
        };
        await updateDeal(dealData, true);
      } catch (error) {
        Logger.warn('unable to set deal stage to 5 in webhook route', request, {
          extra: error,
        });
        return errorResponse('The ACH transfer was NOT successful', 500);
      }

      return jsonResponse({ message: 'The ACH transfer was successful' });
    }

    return jsonResponse({ message: 'Webhook processed but no action taken' });
  } catch (error) {
    Logger.error('Webhook not processed due to error:', request, {
      extra: error,
    });
    return jsonResponse({ message: 'Webhook not processed' });
  }
}
