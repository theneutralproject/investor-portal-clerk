
export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

export function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}