import { NextRequest } from 'next/server';
import slugify from 'slugify';
import Logger from './logger';
import { APIError } from './types';

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
