import * as Sentry from '@sentry/nextjs';
import { createLogger, format, transports } from 'winston';
import type { NextRequest } from 'next/server';
import { parseSessionFromCookie } from './session/utils';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.colorize({ all: true }),
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
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
  static log(req: NextRequest, metadata: MetaData = { extra: {} }): void {
    const apiMessage = `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`;
    const logData = {
      apiMessage,
      level: 'log',
      message: metadata.message || '',
      request: this.getRequestDetails(req),
      extra: metadata.extra,
    };

    logger.info(logData.apiMessage, logData);
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
    req: NextRequest,
    message: string,
    extra: Record<string, unknown> = {}
  ): void {
    const apiMessage = `Warning from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`;
    const logData = {
      apiMessage,
      level: 'warn',
      message,
      request: this.getRequestDetails(req),
      extra,
    };

    logger.warn(logData.apiMessage, logData);
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
    req: NextRequest,
    error: Error,
    extra: Record<string, unknown | Sentry.SeverityLevel> = {}
  ): void {
    const apiMessage = `Log from ${req.method.toUpperCase()} -> ${req.nextUrl.pathname}`;
    const logData = {
      apiMessage,
      level: 'error',
      message: error.message,
      stack: error.stack,
      request: this.getRequestDetails(req),
      log: this.getLogError(req, error, extra.method),
      extra,
    };

    logger.error(
      `Error '${logData.message}' ocurred at ${logData.apiMessage}`,
      logData
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
    req: NextRequest,
    error: any,
    method?: string | unknown
  ) => {
    const stack = new Error().stack?.split('\n')[2] || '';
    const functionName = stack.match(/at (\w+)/)?.[1] || 'unknown function';
    return `Failed at ${req.method} ${req.nextUrl.pathname} -> ${method || functionName}: ${error.message}`;
  };
}

export default Logger;
