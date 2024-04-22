import { type NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  return new Response(JSON.stringify({ error: "Error fetching data" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
