import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';
import Logger from '../logger';

jest.mock('pino', () => {
  const fakePino = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const pinoMock = jest.fn(() => fakePino);

  Object.assign(pinoMock, {
    stdTimeFunctions: {
      isoTime: jest.fn(() => '2024-03-06T12:00:00.000Z'),
    },
  });

  return pinoMock;
});

import pino from 'pino';

jest.mock('@sentry/nextjs');
jest.mock('../utils.server', () => ({
  getErrorMessage: jest.fn(() => 'Mocked error message'),
}));
jest.mock('../session/utils', () => ({
  parseSessionFromCookie: jest.fn(() => ({ user: 'mock-user' })),
}));

describe('Logger', () => {
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = pino(); // Mock Pino Logger
    jest.clearAllMocks();
  });

  const mockRequest = (method = 'GET', pathname = '/test'): NextRequest =>
    ({
      method,
      nextUrl: { pathname },
      cookies: { get: jest.fn(() => ({ value: '__session_token__' })) },
    }) as unknown as NextRequest;

  describe('log', () => {
    it('should log an info message', () => {
      const metadata = { message: 'Test log', extra: { key: 'value' } };

      Logger.log(metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test log', level: 'log' }),
        'Test log'
      );

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'log', level: 'info' })
      );
    });

    it('should log an info message without metadata', () => {
      Logger.log();

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'log' }),
        expect.any(String) // Log message might be generated dynamically
      );

      expect(Sentry.addBreadcrumb).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log a warning message', () => {
      const req = mockRequest('GET', '/test');
      Logger.warn('Test warning', req, { user: 'testUser' });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test warning', level: 'warn' }),
        expect.stringContaining('Warning from GET -> /test')
      );

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'log', level: 'warning' })
      );
    });

    it('should log a warning message without extra metadata', () => {
      Logger.warn('Test warning');

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test warning', level: 'warn' }),
        ''
      );

      expect(Sentry.addBreadcrumb).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log an error message and send it to Sentry', () => {
      const error = new Error('Test error');
      const req = mockRequest('POST', '/error');

      Logger.error(error, req);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error', level: 'error' }),
        expect.stringContaining(
          "Error 'Test error' occurred at Log from POST -> /error"
        )
      );

      expect(Sentry.captureException).toHaveBeenCalledWith(
        error,
        expect.objectContaining({ level: 'error' })
      );
    });

    it('should log an error message and NOT send it to Sentry when disableSentry is true', () => {
      const error = new Error('Test error');

      Logger.error(error, undefined, { disableSentry: true });

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Test error', level: 'error' }),
        expect.stringContaining(
          "Error 'Test error' occurred at An error has occurred: Test error"
        )
      );

      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('should handle non-object error messages correctly', () => {
      Logger.error('String error message');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'String error message',
          level: 'error',
        }),
        expect.stringContaining(
          "Error 'String error message' occurred at An error has occurred: String error message"
        )
      );

      expect(Sentry.captureException).toHaveBeenCalledWith(
        'String error message',
        expect.objectContaining({ level: 'error' })
      );
    });

    it('should handle a null error', () => {
      Logger.error(null);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: String(null), // Ensures `null` is converted to a string
          level: 'error',
        }),
        expect.stringContaining(
          "Error 'null' occurred at An error has occurred: null"
        )
      );
    });

    it('should handle an undefined error', () => {
      Logger.error(undefined);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'undefined', level: 'error' }),
        expect.stringContaining(
          "Error 'undefined' occurred at An error has occurred: undefined"
        )
      );
    });

    it('should extract stack trace correctly from an error', () => {
      const error = new Error('Test stack error');
      error.stack =
        'Error: Test stack error\n    at SomeFunction (index.js:10:5)';

      Logger.error(error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test stack error',
          level: 'error',
          stack: expect.stringContaining('SomeFunction'),
        }),
        expect.any(String)
      );
    });
  });
});
