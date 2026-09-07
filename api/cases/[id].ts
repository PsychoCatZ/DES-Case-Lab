import { removeCase, updateCase } from '../_lib/caseQueries';
import {
  errorResponse,
  internalErrorResponse,
  jsonResponse,
} from '../_lib/responses';
import { validateCaseInput } from '../_lib/validation';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PUT(request: Request): Promise<Response> {
  const id = getCaseId(request.url);
  if (!id || !UUID_PATTERN.test(id)) {
    return errorResponse(400, 'INVALID_ID', 'Передан некорректный идентификатор кейса.');
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, 'INVALID_JSON', 'Тело запроса должно содержать JSON.');
    }

    const validation = validateCaseInput(body);
    if (!validation.ok) {
      return errorResponse(400, 'INVALID_CASE', validation.message);
    }

    const updatedCase = await updateCase(id, validation.value);
    return updatedCase
      ? jsonResponse(updatedCase)
      : errorResponse(404, 'CASE_NOT_FOUND', 'Кейс не найден.');
  } catch {
    return internalErrorResponse();
  }
}

export async function DELETE(request: Request): Promise<Response> {
  const id = getCaseId(request.url);
  if (!id || !UUID_PATTERN.test(id)) {
    return errorResponse(400, 'INVALID_ID', 'Передан некорректный идентификатор кейса.');
  }

  try {
    return (await removeCase(id))
      ? new Response(null, { status: 204 })
      : errorResponse(404, 'CASE_NOT_FOUND', 'Кейс не найден.');
  } catch {
    return internalErrorResponse();
  }
}

function getCaseId(requestUrl: string): string | null {
  const segments = new URL(requestUrl).pathname.split('/').filter(Boolean);
  const id = segments.at(-1);
  return id ? decodeURIComponent(id) : null;
}
