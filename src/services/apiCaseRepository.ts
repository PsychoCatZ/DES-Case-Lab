import { isExpertCase, type CaseInput, type ExpertCase } from '../domain/case';
import type { CaseRepository } from './caseRepository';

type FetchClient = typeof fetch;

interface ApiErrorPayload {
  error?: {
    message?: unknown;
  };
}

export class ApiCaseRepository implements CaseRepository {
  private readonly baseUrl: string;
  private readonly fetchClient: FetchClient;

  constructor(
    baseUrl = '/api',
    fetchClient: FetchClient = globalThis.fetch,
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.fetchClient = fetchClient.bind(globalThis);
  }

  async getAll(): Promise<ExpertCase[]> {
    const payload = await this.request('/cases');
    if (!Array.isArray(payload) || !payload.every(isExpertCase)) {
      throw new Error('API вернул некорректный список кейсов.');
    }
    return payload;
  }

  async create(input: CaseInput): Promise<ExpertCase> {
    return this.requestCase('/cases', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async update(id: string, input: CaseInput): Promise<ExpertCase> {
    return this.requestCase(`/cases/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async remove(id: string): Promise<void> {
    await this.request(`/cases/${encodeURIComponent(id)}`, { method: 'DELETE' }, false);
  }

  private async requestCase(path: string, init: RequestInit): Promise<ExpertCase> {
    const payload = await this.request(path, init);
    if (!isExpertCase(payload)) {
      throw new Error('API вернул кейс в некорректном формате.');
    }
    return payload;
  }

  private async request(
    path: string,
    init: RequestInit = {},
    expectsJson = true,
  ): Promise<unknown> {
    let response: Response;
    try {
      response = await this.fetchClient(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...init.headers,
        },
      });
    } catch {
      throw new Error('Не удалось соединиться с API.');
    }

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }

    if (!expectsJson) return undefined;

    try {
      return await response.json();
    } catch {
      throw new Error('API вернул некорректный JSON.');
    }
  }
}

async function readApiError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as ApiErrorPayload;
    if (typeof payload.error?.message === 'string' && payload.error.message.trim()) {
      return payload.error.message;
    }
  } catch {
    // The status-based message below is enough when the body is not JSON.
  }

  return `API вернул ошибку ${response.status}.`;
}
