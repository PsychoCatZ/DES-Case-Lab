export function jsonResponse(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function errorResponse(status: number, code: string, message: string): Response {
  return jsonResponse({ error: { code, message } }, status);
}

export function methodNotAllowed(allowed: string[]): Response {
  return new Response(
    JSON.stringify({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Метод не поддерживается.' },
    }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: allowed.join(', '),
      },
    },
  );
}

export function internalErrorResponse(): Response {
  return errorResponse(500, 'INTERNAL_ERROR', 'Не удалось выполнить запрос.');
}
