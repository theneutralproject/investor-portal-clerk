import {
  getFinixUserName,
  getFinixPassword,
  initializeFinixTransfer,
  getPlaidToken,
  getIdentity,
  getBuyerId,
} from '@/libs/finix/utils.server';
import { jsonFetchMock } from '@/mocks/fetch.mock';

describe('Finix Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    phoneNumber: '123-456-7890',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockDeal = {
    transactionId: 'txn-123',
    hubspotId: 'hub-456',
    investmentStats: { amount: 10000 },
  };

  const mockMerchantId = 'merchant-xyz';
  const mockBuyerId = 'buyer-xyz';
  const mockProjectName = 'Test Project';
  const mockSlug = 'edison';
  const mockFraudSessionKey = 'fraud-session-123';

  beforeEach(() => {
    process.env.FINIX_USERNAME_EDISON = 'edisonUser';
    process.env.FINIX_USERNAME_BAKERS = 'bakersUser';
    process.env.FINIX_USERNAME_519 = 'user519';

    process.env.FINIX_PASSWORD_EDISON = 'edisonPass';
    process.env.FINIX_PASSWORD_BAKERS = 'bakersPass';
    process.env.FINIX_PASSWORD_519 = 'pass519';
  });

  describe('getFinixUserName', () => {
    it('should return correct username for Edison', () => {
      expect(getFinixUserName('edison')).toBe('edisonUser');
    });

    it('should return correct username for Bakers', () => {
      expect(getFinixUserName('bakers')).toBe('bakersUser');
    });

    it('should return correct username for 519', () => {
      expect(getFinixUserName('519')).toBe('user519');
    });

    it('should throw error for an invalid slug in getFinixUserName', () => {
      expect(() => getFinixUserName('invalid')).toThrow(
        'Invalid project slug in getFinixUserName'
      );
    });
  });

  describe('getFinixPassword', () => {
    it('should return correct password for Edison', () => {
      expect(getFinixPassword('edison')).toBe('edisonPass');
    });

    it('should return correct password for Bakers', () => {
      expect(getFinixPassword('bakers')).toBe('bakersPass');
    });

    it('should return correct password for 519', () => {
      expect(getFinixPassword('519')).toBe('pass519');
    });

    it('should throw error for an invalid slug in getFinixPassword', () => {
      expect(() => getFinixPassword('invalid')).toThrow(
        'Invalid project slug in getFinixPassword'
      );
    });
  });

  describe('initializeFinixTransfer', () => {
    it('should return a successful transfer response', async () => {
      const mockTransferResponse = { state: 'SUCCEEDED', id: 'transfer-xyz' };
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(jsonFetchMock(mockTransferResponse));

      const response = await initializeFinixTransfer(
        mockDeal as any,
        mockMerchantId,
        mockBuyerId,
        mockProjectName,
        mockSlug,
        mockFraudSessionKey
      );

      expect(response).toEqual(mockTransferResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.FINIX_BASE_URL!}/transfers`,
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should throw an error if transfer request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Transfer Error')
      );

      await expect(
        initializeFinixTransfer(
          mockDeal as any,
          mockMerchantId,
          mockBuyerId,
          mockProjectName,
          mockSlug,
          mockFraudSessionKey
        )
      ).rejects.toThrow('Transfer Error');

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPlaidToken', () => {
    it('should return a valid Plaid processor token', async () => {
      const mockPlaidToken = {
        token: 'plaid-token-xyz',
        type: 'PLAID_PROCESSOR_TOKEN',
      };
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(jsonFetchMock(mockPlaidToken));

      const token = await getPlaidToken(
        'plaid-public-token',
        'account-123',
        mockSlug
      );

      expect(token).toBe(mockPlaidToken.token);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.FINIX_BASE_URL!}/third_party_tokens`,
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should throw an error if API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Plaid API Error')
      );

      await expect(
        getPlaidToken('plaid-public-token', 'account-123', mockSlug)
      ).rejects.toThrow('Plaid API Error');

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getIdentity', () => {
    it('should return a valid identity ID', async () => {
      const mockIdentityResponse = { id: 'identity-xyz' };
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(jsonFetchMock(mockIdentityResponse));

      const identityId = await getIdentity(mockUser as any, mockSlug);

      expect(identityId).toBe(mockIdentityResponse.id);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.FINIX_BASE_URL!}/identities`,
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should throw an error if API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Identity API Error')
      );

      await expect(getIdentity(mockUser as any, mockSlug)).rejects.toThrow(
        'Identity API Error'
      );

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBuyerId', () => {
    it('should return a valid buyer ID', async () => {
      const mockBuyerResponse = { id: 'buyer-xyz' };
      jest
        .spyOn(global, 'fetch')
        .mockImplementationOnce(jsonFetchMock(mockBuyerResponse));

      const buyerId = await getBuyerId(
        'identity-xyz',
        'plaid-token-xyz',
        mockSlug
      );

      expect(buyerId).toBe(mockBuyerResponse.id);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.FINIX_BASE_URL!}/payment_instruments`,
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should throw an error if API call fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Buyer API Error')
      );

      await expect(
        getBuyerId('identity-xyz', 'plaid-token-xyz', mockSlug)
      ).rejects.toThrow('Buyer API Error');

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
