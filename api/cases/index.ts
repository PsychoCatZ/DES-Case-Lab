import { createCase, getAllCases } from '../_lib/caseQueries.js';
import {
  errorResponse,
  internalErrorResponse,
  jsonResponse,
} from '../_lib/responses.js';
import { validateCaseInput } from '../_lib/validation.js';

export async function GET(): Promise<Response> {
  try {
    return jsonResponse(await getAllCases());
  } catch {
    return internalErrorResponse();
  }
}

export async function POST(request: Request): Promise<Response> {
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

    return jsonResponse(await createCase(validation.value), 201);
  } catch {
    return internalErrorResponse();
  }
}
