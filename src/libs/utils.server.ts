import { NextRequest } from 'next/server';
import slugify from 'slugify';
import Logger from './logger';
import { APIError } from './types';
import { Prisma } from '@prisma/client';

export function getErrorMessage(error: unknown) {
  if (error instanceof Error || error instanceof APIError) return error.message;
  return String(error);
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(
  message: string,
  status: number,
  metadata?: { request: NextRequest; extra?: Record<string, unknown> }
) {
  if (metadata?.request) {
    Logger.error(new Error(message), metadata.request, metadata.extra);
  }
  return jsonResponse({ error: message }, status);
}

export function sanitizeFileName(name: string, maxLength = 60): string {
  const baseName = name.split('.').slice(0, -1).join('.') || name; // drop extension
  const ext = name.includes('.') ? `.${name.split('.').pop()}` : '';
  const safeName = slugify(baseName, {
    lower: true,
    strict: true, // remove special characters
  }).slice(0, maxLength); // truncate
  return `${safeName}${ext}`;
}

/**
 * Recursively sanitizes an unknown input to ensure it conforms to the `Prisma.InputJsonValue` type.
 *
 * - Removes `undefined`, `function`, and `bigint` values from objects and arrays.
 * - Processes nested structures recursively.
 * - Returns a sanitized version suitable for storing in a Prisma JSON field.
 *
 * @param value - The input value to sanitize. Can be any type.
 * @returns A value compatible with `Prisma.InputJsonValue`, with unsupported types removed.
 *
 * @example
 * sanitizeJson({
 *   valid: 'yes',
 *   invalid: undefined,
 *   fn: () => {},
 *   nested: { big: BigInt(1), okay: 2 }
 * })
 * // → { valid: 'yes', nested: { okay: 2 } }
 */
export function sanitizeJson(value: unknown): Prisma.InputJsonValue {
  if (Array.isArray(value)) {
    return value
      .map(sanitizeJson)
      .filter(
        val =>
          val !== undefined &&
          typeof val !== 'function' &&
          typeof val !== 'bigint'
      ) as Prisma.InputJsonValue;
  } else if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, any>)
      .filter(
        ([, val]) =>
          val !== undefined &&
          typeof val !== 'function' &&
          typeof val !== 'bigint'
      )
      .map(([key, val]) => [key, sanitizeJson(val)]);
    return Object.fromEntries(entries);
  }

  if (typeof value === 'function' || typeof value === 'bigint') {
    return undefined as unknown as Prisma.InputJsonValue;
  }

  return value as Prisma.InputJsonValue;
}
