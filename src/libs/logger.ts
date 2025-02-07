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
  timestamp: pino.stdTimeFunctions.isoTime, // Similar to Winston timestamp
});

type MetaData =
  | { message?: string; extra?: Record<string, unknown> | object }
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
   * Logs warnings with user & request details.
   * @param req - The Next.js request object.
   * @param message - Warning message.
   * @param extra - Additional metadata for the log.
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
   * Logs errors and sends them to Sentry with request & user details.
   * @param req - The Next.js request object.
   * @param error - The error object.
   * @param extra - Additional metadata for the log.
   */
  static error(
    error: Error,
    req?: NextRequest,
    extra: Record<string, unknown | Sentry.SeverityLevel> = {}
  ): void {
    const apiMessage = req
      ? `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`
      : `An error has ocurred: ${error.message}`;
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
      `Error '${logData.message}' ocurred at ${logData.apiMessage}`
    );
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

  /**
   * Generates a structured error log message including the HTTP method, request path, and function name.
   * Extracts the function name from the stack trace automatically.
   *
   * @param {NextRequest} req - The Next.js request object containing method and URL information.
   * @param {any} error - The error object to extract the message from.
   * @param {string} method - [Optional] The method where the issue failed.
   * @returns {string} - A formatted log message indicating where the failure occurred.
   */
  private static getLogError = (
    error: any,
    req?: NextRequest,
    method?: string | unknown
  ) => {
    const stack = new Error().stack?.split('\n')[2] || '';
    const functionName = stack.match(/at (\w+)/)?.[1] || 'unknown function';
    return req
      ? `Failed at ${req.method} ${req.nextUrl.pathname} -> ${method || functionName}: ${error.message}`
      : `Failed at ${method || functionName}: ${error.message}`;
  };
}

export default Logger;
