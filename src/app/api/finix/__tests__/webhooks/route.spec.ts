import { PaymentMethod } from '@prisma/client';
import { errorResponse, jsonResponse } from '@/libs/utils.server';
import { updateDeal } from '@/libs/deal/utils.server';
import { nextRequestMock } from '@/mocks/nextRequest.mock';
import Logger from '@/libs/logger';
import { POST } from '../../webhooks/route';

jest.mock('@/libs/deal/utils.server', () => ({
  updateDeal: jest.fn(),
}));

jest.mock('@/libs/logger', () => ({
  log: jest.fn(),
  error: jest.fn(),
}));

describe('POST /api/finix/webhook', () => {
  const validAuthHeader = `Basic ${Buffer.from(
    `${process.env.FINIX_WH_USERNAME}:${process.env.FINIX_WH_PASSWORD}`
  ).toString('base64')}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if Authorization header is missing', async () => {
    const response = await POST(nextRequestMock({}, {}) as any);

    expect(Logger.log).toHaveBeenNthCalledWith(
      1,
      { message: '\nBEGIN Finix Webhook:' },
      expect.any(Object)
    );
    expect(Logger.log).toHaveBeenLastCalledWith({
      message: 'Authorization header is required for finix webhook\n\n',
    });
    expect(response).toEqual(
      errorResponse('Authorization header is required', 401)
    );
  });

  it('should return 401 if Authorization credentials are invalid', async () => {
    const invalidAuthHeader = `Basic ${Buffer.from('wrongUser:wrongPass').toString('base64')}`;

    const response = await POST(
      nextRequestMock({}, { Authorization: invalidAuthHeader }) as any
    );

    expect(Logger.log).toHaveBeenLastCalledWith(
      {
        message: 'Invalid finix credentials\n\n',
        extra: { username: 'wrongUser', password: 'wrongPass' },
      },
      expect.any(Object)
    );
    expect(response).toEqual(errorResponse('Invalid credentials', 401));
  });

  it('should log and return success when ignoring webhook due to subtype', async () => {
    const requestBody = {
      _embedded: {
        transfers: [{ subtype: 'OTHER' }],
      },
    };

    const response = await POST(
      nextRequestMock(requestBody, { Authorization: validAuthHeader }) as any
    );

    expect(Logger.log).toHaveBeenLastCalledWith({
      message: 'ignoring the Webhook because the subtype is not "API"',
    });
    expect(response).toEqual(jsonResponse({ message: 'ignoring the Webhook' }));
  });

  it('should return 500 if dealHubspotId is missing in tags', async () => {
    const requestBody = {
      _embedded: {
        transfers: [
          {
            subtype: 'API',
            state: 'SUCCEEDED',
            tags: {}, // Missing dealHubspotId
          },
        ],
      },
    };

    const response = await POST(
      nextRequestMock(requestBody, { Authorization: validAuthHeader }) as any
    );

    expect(Logger.error).toHaveBeenCalledWith(
      'The ACH transfer was NOT successful because the tags were missing',
      expect.any(Object),
      { extra: {} }
    );
    expect(response).toEqual(
      errorResponse(
        'The ACH transfer was NOT successful because the tags were missing',
        500
      )
    );
  });

  it('should update deal and return success message on ACH transfer success', async () => {
    const requestBody = {
      _embedded: {
        transfers: [
          {
            id: 'transfer-123',
            subtype: 'API',
            state: 'SUCCEEDED',
            tags: { dealHubspotId: 'hubspot-123' },
          },
        ],
      },
    };

    const response = await POST(
      nextRequestMock(requestBody, { Authorization: validAuthHeader }) as any
    );

    expect(updateDeal).toHaveBeenCalledWith(
      {
        hubspotId: 'hubspot-123',
        dealStage: 5,
        closingDate: expect.any(Date),
        dateFundsSent: expect.any(Date),
        paymentMethod: PaymentMethod.ACH,
        paymentReferenceId: 'transfer-123',
      },
      true
    );
    expect(response).toEqual(
      jsonResponse({ message: 'The ACH transfer was successful' })
    );
  });

  it('should return 500 if updateDeal fails', async () => {
    (updateDeal as jest.Mock).mockRejectedValue(new Error('DB error'));

    const requestBody = {
      _embedded: {
        transfers: [
          {
            id: 'transfer-123',
            subtype: 'API',
            state: 'SUCCEEDED',
            tags: { dealHubspotId: 'hubspot-123' },
          },
        ],
      },
    };

    const response = await POST(
      nextRequestMock(requestBody, { Authorization: validAuthHeader }) as any
    );

    expect(updateDeal).toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledWith(
      'unable to set deal stage to 5 in webhook route',
      expect.any(Object),
      { extra: expect.any(Error) }
    );
    expect(response).toEqual(
      errorResponse('The ACH transfer was NOT successful', 500)
    );
  });

  it('should log an error and return success response if webhook data is missing or cancelled', async () => {
    const requestBody = { _embedded: { transfers: [] } };

    const response = await POST(
      nextRequestMock(requestBody, { Authorization: validAuthHeader }) as any
    );

    expect(Logger.error).toHaveBeenCalledWith(
      'Webhook not processed due to missing transfer data or because transaction was CANCELLED',
      expect.any(Object),
      { extra: requestBody }
    );
    expect(response).toEqual(
      jsonResponse({
        message:
          'Webhook not processed due to missing transfer data or because transaction was CANCELLED',
        body: requestBody,
      })
    );
  });

  it('should return 500 if request processing fails', async () => {
    const response = await POST(
      nextRequestMock('{ invalid json }' as any, {
        Authorization: validAuthHeader,
      }) as any
    );

    expect(Logger.error).toHaveBeenCalledWith(
      'Webhook not processed due to error:',
      expect.any(Object),
      { extra: expect.any(Error) }
    );
    expect(response).toEqual(
      jsonResponse({ message: 'Webhook not processed' })
    );
  });
});
