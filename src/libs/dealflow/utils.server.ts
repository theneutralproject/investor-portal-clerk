import 'server-only';

// Build redirect URL
export function buildRedirectUrl(projectSlug: string, dealId: string): URL {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is not set');
  }
  return new URL(`/dealflow/${projectSlug}/${dealId}/review`, baseUrl);
}
