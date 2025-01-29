import { NextRequest } from 'next/server';
import Logger from './logger';

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
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
  metadata?: { request: NextRequest; extra: Record<string, unknown> }
) {
  console.error(metadata, 'should log the error');
  if (metadata?.request) {
    console.error('should log the error');
    Logger.error(metadata.request, new Error(message), metadata.extra);
  }
  return jsonResponse({ error: message }, status);
}
