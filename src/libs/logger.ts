import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';
import { parseSessionFromCookie } from './session/utils';

/**
 * Logger utility for structured logging.
 */
class Logger {
  /**
   * Logs general information with user & request details.
   * @param req - The Next.js request object.
   * @param message - Log message.
   * @param extra - Additional metadata for the log.
   */
  static log(
    req: NextRequest,
    message: string,
    extra: Record<string, unknown> = {}
  ): void {
    const logData = {
      level: 'info',
      message,
      request: this.getRequestDetails(req),
      extra,
    };

    console.log(JSON.stringify(logData, null, 2)); // Pretty-print log
    Sentry.captureMessage(message, { extra: logData });
  }

  /**
   * Logs errors and sends them to Sentry with request & user details.
   * @param req - The Next.js request object.
   * @param error - The error object.
   * @param extra - Additional metadata for the log.
   */
  static error(
    req: NextRequest,
    error: Error,
    extra: Record<string, unknown> = {}
  ): void {
    const logData = {
      level: 'error',
      message: error.message,
      stack: error.stack,
      request: this.getRequestDetails(req),
      extra,
    };

    console.error(JSON.stringify(logData, null, 2)); // Pretty-print error log
    Sentry.captureException(error, { extra: logData });
  }

  /**
   * Extracts useful request details including user info.
   * @param req - The Next.js request object.
   * @returns Extracted request details.
   */
  private static getRequestDetails(req: NextRequest) {
    return {
      method: req.method,
      url: req.url,
      session: parseSessionFromCookie(req),
      headers: req.headers,
      body: req.body || {},
    };
  }
}

export default Logger;
