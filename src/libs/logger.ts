import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';
import { parseSessionFromCookie } from './session/utils';

type MetaData =
  | { message?: string; extra: Record<string, unknown> | object }
  | undefined;
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
  static log(req: NextRequest, metadata: MetaData = { extra: {} }): void {
    const apiMessage = `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`;
    const logData = {
      apiMessage,
      level: 'log',
      message: metadata.message || '',
      request: this.getRequestDetails(req),
      extra: metadata.extra,
    };

    console.log(JSON.stringify(logData, null, 4)); // Pretty-print log
    Sentry.addBreadcrumb({
      category: 'log',
      message: apiMessage,
      level: 'info',
      data: logData,
    });
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
    extra: Record<string, unknown | Sentry.SeverityLevel> = {}
  ): void {
    const logData = {
      level: 'error',
      message: error.message,
      stack: error.stack,
      request: this.getRequestDetails(req),
      extra,
    };

    console.error(JSON.stringify(logData, null, 2)); // Pretty-print error log
    Sentry.captureException(error, { level: 'error', extra: logData });
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
