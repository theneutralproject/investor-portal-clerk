import * as Sentry from '@sentry/nextjs';
import pino from 'pino';
import type { NextRequest } from 'next/server';
import { parseSessionFromCookie } from './session/utils';

const logger = pino({
  level: 'info',
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime, // Uses ISO timestamp format
});

type MetaData =
  | { message?: string; extra?: Record<string, unknown> | object }
  | undefined;

/**
 * Logger utility for structured logging with Sentry integration.
 */
class Logger {
  /**
   * Logs general information with optional request details.
   *
   * @param {MetaData} metadata - Log message and additional metadata.
   * @param {NextRequest} [req] - The Next.js request object (optional).
   */
  static log(metadata: MetaData = { extra: {} }, req?: NextRequest): void {
    const apiMessage =
      metadata.message ||
      (req &&
        `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`);
    const logData = {
      apiMessage,
      level: 'log',
      message: metadata.message || '',
      request: req ? this.getRequestDetails(req) : null,
      extra: metadata.extra,
    };

    logger.info(logData, logData.apiMessage);
    Sentry.addBreadcrumb({
      category: 'log',
      message: apiMessage,
      level: 'info',
      data: logData,
    });
  }

  /**
   * Logs warnings with optional request details.
   *
   * @param {string} message - Warning message.
   * @param {NextRequest} [req] - The Next.js request object (optional).
   * @param {Record<string, unknown>} [extra] - Additional metadata (optional).
   */
  static warn(
    message: string,
    req?: NextRequest,
    extra: Record<string, unknown> = {}
  ): void {
    const apiMessage = req
      ? `Warning from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`
      : '';
    const logData = {
      apiMessage,
      level: 'warn',
      message,
      request: req ? this.getRequestDetails(req) : null,
      extra,
    };

    logger.warn(logData, logData.apiMessage);
    Sentry.addBreadcrumb({
      category: 'log',
      message: apiMessage,
      level: 'warning',
      data: logData,
    });
  }

  /**
   * Logs errors and sends them to Sentry with optional request details.
   *
   * @param {Error} error - The error object to log.
   * @param {NextRequest} [req] - The Next.js request object (optional).
   * @param {Record<string, unknown | Sentry.SeverityLevel>} [extra] - Additional metadata (optional).
   */
  static error(
    error: Error,
    req?: NextRequest,
    extra: Record<string, unknown | Sentry.SeverityLevel> = {}
  ): void {
    const apiMessage = req
      ? `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`
      : `An error has occurred: ${error.message}`;
    const traces = error.stack?.split('\n    ') || [];
    const logData = {
      apiMessage,
      level: 'error',
      message: error.message,
      stack: [traces[0], traces[1]].join(' ').replaceAll('\n', ''),
      request: req ? this.getRequestDetails(req) : null,
      log: this.getLogError(error, req, extra.method),
      extra,
    };

    logger.error(
      logData,
      `Error '${logData.message}' occurred at ${logData.apiMessage}`
    );
    Sentry.captureException(error, { level: 'error', extra: logData });
  }

  /**
   * Extracts useful request details including user session information.
   *
   * @param {NextRequest} req - The Next.js request object.
   * @returns {Object} Extracted request details.
   */
  private static getRequestDetails(req: NextRequest): object {
    return {
      method: req.method,
      url: req.url,
      session: parseSessionFromCookie(req),
      headers: req.headers,
      body: req.body || {},
    };
  }

  /**
   * Generates a structured error log message, extracting the function name automatically.
   *
   * @param {Error} error - The error object to extract the message from.
   * @param {NextRequest} [req] - The Next.js request object (optional).
   * @param {string} [method] - The method where the issue failed (optional).
   * @returns {string} - A formatted log message indicating where the failure occurred.
   */
  private static getLogError = (
    error: Error,
    req?: NextRequest,
    method?: string | unknown
  ): string => {
    const stack = new Error().stack?.split('\n')[2] || '';
    const functionName = stack.match(/at (\w+)/)?.[1] || 'unknown function';
    return req
      ? `Failed at ${req.method} ${req.nextUrl.pathname} -> ${method || functionName}: ${error.message}`
      : `Failed at ${method || functionName}: ${error.message}`;
  };
}

export default Logger;
